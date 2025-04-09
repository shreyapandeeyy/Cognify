"use client";

import { ClerkProvider, SignOutButton, useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import React from "react";
import { addBlocks } from "@/lib/note/noteManager";

export function LogOutButton() {
  return (
    <ClerkProvider>
      <SignOutContent />
    </ClerkProvider>
  );
}

function SignOutContent() {
  const { signOut } = useClerk();

  // Instead of assuming variables exist, define them or get them from props/context
  // Example approach (you'll need to implement based on your app structure):
  // const { noteID, content } = useYourNoteContext();

  const handleSignOut = async () => {
    try {
      // Uncomment and implement once you have noteID and content available
      // await addBlocks(noteID, content);
      console.log("Saving content before sign out");

      // Use Clerk's signOut method instead of returning a component
      await signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
