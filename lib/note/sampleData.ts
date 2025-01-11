import { getFirestore, FieldValue } from 'firebase-admin/firestore';
const  serviceAccountPath =  "C:/Users/SHREYA PANDEY/Downloads/noteeyyyy/obsidian-b3268-firebase-adminsdk-x4t2b-993b7dec9d.json";
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
// import { serviceAccountPath } from './config';

console.log("Service Account Path:", serviceAccountPath);

if (!serviceAccountPath) {
  throw new Error("Service account path is missing");
}

if (!admin.apps.length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
  console.log("Firebase app initialized successfully.");
} else {
  console.log("Firebase app already initialized.");
}

const db = getFirestore();

async function fillDatabase() {
  try {
    const userRef = db.collection('users').doc('sampleUser');
    await userRef.set({
      name: 'Ayush AI',
      email: 'twenty7fourty5@gmail.com',
      emailVerified: true,
      disabled: false,
    });

    const folderRef = userRef.collection('folders').doc('sampleFolder');
    await folderRef.set({
      name: 'Sample Folder',
      path: '/sampleFolder/',
      noteIDs: [],
    });

    const noteRef = db.collection('notes').doc('sampleNote');
    await noteRef.set({
      userID: 'sampleUser',
      name: 'Sample Note',
      path: '/sampleFolder/sampleNote',
      blockIDs: [],
    });

    await folderRef.update({
      noteIDs: FieldValue.arrayUnion('sampleNote'),
    });

    console.log('Database filled with sample data.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error filling database:', error.message);
    } else {
      console.error('Error filling database:', error);
    }
  }
}

export { fillDatabase };
