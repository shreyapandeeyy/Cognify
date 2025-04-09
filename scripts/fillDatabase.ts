import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error("Service account path is missing");
}

initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

const db = getFirestore();

async function fillDatabase() {
  try {
    const userRef = db.collection('users').doc('sampleUser');
    await userRef.set({
      name: 'Sample User',
      email: 'sampleuser@example.com',
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
      noteIDs: admin.firestore.FieldValue.arrayUnion('sampleNote'),
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

fillDatabase().catch(console.error);

