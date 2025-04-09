import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Pinecone } from "@pinecone-database/pinecone";
import { getAuth } from "firebase-admin/auth";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import * as admin from "firebase-admin";
import * as path from "path";
import { fillDatabase } from "./sampleData";
import * as dotenv from 'dotenv';

dotenv.config();

export const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error("Service account path is missing");
}

console.log("Service Account Path:", serviceAccountPath);

if (!getApps().length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
  console.log("Firebase app initialized successfully.");
} else {
  console.log("Firebase app already initialized.");
}

export const auth = getAuth();
export const db = getFirestore();

const pineconeKey = process.env.PINECONE_KEY;
if (!pineconeKey) {
  throw new Error("Pinecone API key is missing");
}

export const pc = new Pinecone({
  apiKey: pineconeKey,
});
export const index = pc.Index("embeddings");
export const model = "multilingual-e5-large";

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_KEY,
});

export const sysPrompt = `
You are a note-summarizer. You will be provided with a series of notes, and you must summarize them.
Be detailed but do not include unnecessary information. 
Give me html, using tags for h1, h2, h3, bold, italics and bulleted lists.
Don't use any spaces between tags. Espeically for lists, do </li><li> not for a new item.
`;

fillDatabase().catch(console.error);

