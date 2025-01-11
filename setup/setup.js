const admin = require('firebase-admin');
const path = require('path');

// Initialize Firestore
const serviceAccountPath = path.resolve(__dirname, 'C:/Users/SHREYA PANDEY/Downloads/noteeyyyy/obsidian-b3268-firebase-adminsdk-x4t2b-993b7dec9d.json');
admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
});
const db = admin.firestore();

// Create Firestore structure
async function createFirestoreStructure() {
    // Add a user
    const userRef = db.collection('users').doc('userID');
    await userRef.set({
        name: "John Doe",
        email: "john.doe@example.com",
        emailVerified: true,
        disabled: false
    });

    // Add a folder under the user
    const folderRef = userRef.collection('folders').doc('folderID');
    await folderRef.set({
        name: "Sample Folder",
        path: "/sampleFolder/",
        noteIDs: ["noteID1", "noteID2"]
    });

    // Add a note
    const noteRef = db.collection('notes').doc('noteID');
    await noteRef.set({
        userID: "userID",
        name: "Sample Note",
        path: "/sampleFolder/sampleNote",
        blockIDs: ["blockID1", "blockID2"]
    });

    // Add a block
    const blockRef = db.collection('blocks').doc('blockID');
    await blockRef.set({
        noteID: "noteID",
        order: 1,
        links: [],
        content: ["{\"type\":\"paragraph\",\"text\":\"Sample text\"}"],
        rawText: "Sample text"
    });

    console.log("Firestore structure created successfully");
}

// Run the function
createFirestoreStructure().catch(console.error);
