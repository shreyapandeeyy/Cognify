"use client";

import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import PageBreak from "@/components/ui/page-break";
import { MenuBar } from "./menu-bar";
import { FloatingToolbar } from "./floating-toolbar";
import { BubbleToolbar } from "./bubble-toolbar";
import { getJSONByNoteID, updateNote, addBlocks } from "@/lib/note/noteManager";
import { useEffect, useState } from "react";
import { HighlightStore } from "@/lib/note/highlightStore";
import { Separator } from "@/components/ui/separator";
import { Note } from "@/lib/util/model";

const getContent = async (noteID: string) => {
  const jsonString = await getJSONByNoteID(noteID);
  return JSON.parse(jsonString);
};

export default function Editor({ note }: { note: Note }) {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "centered-image",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      PageBreak, // Add the PageBreak extension here
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-full min-h-[500px] px-8 py-4",
      },
    },
    onCreate: async ({ editor }) => {
      const content = await getContent(note.id);
      editor.commands.setContent(content);
    },
    onUpdate: ({ editor }) => {
      const { from } = editor.state.selection;
      setCursorPosition(from);
      const json = editor.getJSON();
      const content = JSON.stringify(json);
      addBlocks(note.id, content);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handleFocus = () => {
      if (cursorPosition !== null) {
        editor.commands.setTextSelection(cursorPosition);
      }
    };

    editor.on("focus", handleFocus);

    return () => {
      editor.off("focus", handleFocus);
    };
  }, [editor, cursorPosition]);

  const insertText = HighlightStore.useState((s) => s.insertText);
  useEffect(() => {
    insertTextAtCursor(insertText);
  }, [insertText]);

  const insertTextAtCursor = (text: string) => {
    if (editor && cursorPosition !== null) {
      editor.chain().focus().insertContentAt(cursorPosition, text).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="relative mx-auto flex h-full w-full flex-col">
      <input
        className="w-full bg-transparent p-5 text-2xl font-bold focus-visible:outline-none"
        defaultValue={note.name}
        onBlur={(e) => {
          if (e.target.value !== note.name) {
            updateNote(note, e.target.value);
          }
        }}
      />
      <Separator />
      <MenuBar editor={editor} noteID={note.id} />

      {editor && (
        <>
          <BubbleMenu editor={editor}>
            <BubbleToolbar editor={editor} />
          </BubbleMenu>
          <FloatingMenu
            editor={editor}
            shouldShow={({ state }) => {
              const { $from } = state.selection;
              const currentLineText = $from.nodeBefore?.textContent;
              return currentLineText === "/";
            }}
            tippyOptions={{
              interactive: true,
              placement: "bottom-start",
              appendTo: () => document.body,
            }}
          >
            <FloatingToolbar editor={editor} />
          </FloatingMenu>
        </>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
