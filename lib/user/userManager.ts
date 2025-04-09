"use server";
import { db } from "../note/init"; // Assuming auth is correctly initialized
import { User } from "../util/model";
import { currentUser } from "@clerk/nextjs/server";

export async function createUser() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("No user found");
    }

    if (!user.primaryEmailAddress) {
      throw new Error("No email found");
    }

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", user.primaryEmailAddress?.emailAddress)
      .get();

    if (!userSnapshot.empty) {
      return userSnapshot.docs[0].data();
    }

    const userRecord = await db.collection("users").add({
      name: user.fullName || "",
      email: user.primaryEmailAddress.emailAddress,
      emailVerified: false,
      disabled: false,
    });

    const folderRef = db
      .collection("users")
      .doc(userRecord.id)
      .collection("folders");

    await folderRef.add({
      path: "/",
      noteIDs: [],
      name: "",
    });

    return {
      id: userRecord.id,
      name: user.fullName || "",
      email: user.primaryEmailAddress.emailAddress,
      emailVerified: false,
      disabled: false,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new user:", error.message);
    } else {
      console.error("Error creating new user:", error);
    }
    throw new Error("User creation failed");
  }
}

export async function getCurrentUserSnapshot() {
  const user = await currentUser();

  if (!user) {
    throw new Error("No user found");
  }

  if (!user.primaryEmailAddress) {
    throw new Error("No email found");
  }

  const userSnapshot = await db
    .collection("users")
    .where("email", "==", user.primaryEmailAddress?.emailAddress)
    .get();

  if (userSnapshot.empty) {
    return await createUser();
  }

  return userSnapshot.docs[0];
}

export async function getCurrentUser() {
  const userSnapshot = await getCurrentUserSnapshot();

  if (!userSnapshot.exists) {
    throw new Error("No user found");
  }

  const userData = userSnapshot.data();

  if (!userData) {
    throw new Error("No user data found");
  }

  const useRet = {
    id: userSnapshot.id,
    ...userData,
  } as User;

  return useRet;
}
