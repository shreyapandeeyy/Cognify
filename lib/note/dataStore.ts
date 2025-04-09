"use server";

import { db, pc, model, google, sysPrompt } from "./init";
import { Block } from "@/lib/util/model";
import { FieldPath } from "firebase-admin/firestore";
import { generateText } from "ai";
import { deleteBlocks } from "./noteManager";
import { initializeApp, getApps } from "firebase-admin/app";
import * as admin from "firebase-admin";
import * as path from "path";
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error("Service account path is missing");
}

if (!getApps().length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
  console.log("Firebase app initialized successfully.");
} else {
  console.log("Firebase app already initialized.");
}

async function verifyPineconeIndex(indexName: string) {
  try {
    const index = pc.Index(indexName);
    await index.describeIndexStats();
    return true;
  } catch (error) {
    console.error(`Error verifying Pinecone index "${indexName}":`, error);
    return false;
  }
}

export async function EmbedAndInsertBlocks(blocks: Block[], noteID: string) {
  deleteBlocks(noteID);

  const blocksRef = db.collection("blocks");

  const cleanBlocks: Block[] = [];

  for (const block of blocks) {
    if (
      block.content[0] !==
        '{"type":"paragraph","attrs":{"textAlign":"left"}}' &&
      block.content.length > 0
    ) {
      cleanBlocks.push(block);
    }
  }

  if (cleanBlocks.length > 0) {
    for (const block of cleanBlocks) {
      block.noteID = noteID;

      const ref = blocksRef.add({
        id: block.id,
        noteID: block.noteID,
        order: block.order,
        links: block.links,
        content: block.content,
        rawText: block.rawText,
      });

      block.id = (await ref).id;
    }

    const indexName = "embeddings";
    const indexExists = await verifyPineconeIndex(indexName);

    if (!indexExists) {
      throw new Error(`Pinecone index "${indexName}" does not exist or is not correctly configured.`);
    }

    const index = pc.Index(indexName);

    const embeddings = await pc.inference.embed(
      model,
      cleanBlocks.map((cleanBlocks) => cleanBlocks.rawText),
      { inputType: "passage", truncate: "END" },
    );

    const records = cleanBlocks.map((block, i) => ({
      id: block.id,
      values: embeddings[i].values as number[],
    }));

    await index.namespace("namespace").upsert(records);
  }

  return cleanBlocks.map((block) => block.id);
}

export async function BlocksByID(
  blockIDs: string[] | null | undefined,
): Promise<Block[]> {
  try {
    if (!blockIDs || blockIDs.length === 0) {
      return [];
    }

    const blockRef = await db
      .collection("blocks")
      .where(FieldPath.documentId(), "in", blockIDs)
      .orderBy("order")
      .get();

    if (blockRef.empty) {
      return [];
    }

    const blocks: Block[] = [];

    blockRef.forEach((doc) => {
      const block = doc.data();

      blocks.push({
        id: block.id,
        noteID: block.noteID,
        order: block.order,
        links: block.links,
        content: block.content,
        rawText: block.rawText,
      });
    });

    return blocks;
  } catch (error) {
    console.error("Database Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to BlocksByID: ${error.message}`);
    } else {
      throw new Error("Failed to BlocksByID: Unknown error");
    }
  }
}

export async function GetSearchResults(query: string, numResults: number = 3) {
  try {
    const queryEmbedding = await pc.inference.embed(model, [query], {
      inputType: "query",
    });

    const indexName = "embeddings";
    const indexExists = await verifyPineconeIndex(indexName);

    if (!indexExists) {
      throw new Error(`Pinecone index "${indexName}" does not exist or is not correctly configured.`);
    }

    const index = pc.Index(indexName);

    const queryResponse = await index.namespace("namespace").query({
      topK: numResults,
      vector: queryEmbedding[0].values as number[],
      includeValues: false,
      includeMetadata: true,
    });

    const blockIDs: string[] = [];

    queryResponse.matches.forEach((match) => {
      blockIDs.push(match.id);
    });

    const blocks = await BlocksByID(blockIDs);

    blocks.forEach((block, i) => {
      if (
        queryResponse.matches[i] &&
        queryResponse.matches[i].score !== undefined
      ) {
        block.score = parseFloat(
          (queryResponse.matches[i].score * 100).toFixed(2),
        );
      }
    });

    return blocks.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } catch (error) {
    console.error("Error in GetSearchResults:", error);
    throw new Error("Failed to get search results");
  }
}

export async function GetSummary(strs: string[]) {
  const union = strs.join("\nNEW NOTE\n");

  const { text } = await generateText({
    model: google("gemini-1.5-flash-8b"),
    system: sysPrompt,
    prompt: union,
  });

  const cleanedText = text.replace(/>\n/g, "> ");

  return JSON.stringify(cleanedText, null, 2);
}

