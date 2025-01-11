"use client";

import { ClerkProvider, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import React from "react";
import { addBlocks } from "@/lib/note/noteManager";

export function LogOutButton() {
  return (
    <ClerkProvider>
      <SignUpContent />
    </ClerkProvider>
  );
}

function SignUpContent() {
  const saveNoteContent = async () => {
    // Assuming noteID and content are available in this scope
    await addBlocks(noteID, content);
  };

  const handleSignOut = async () => {
    await saveNoteContent();
    // Proceed with sign out
    return <SignOutButton />;
  };

  return <SignOutButton onClick={handleSignOut}></SignOutButton>;
}
