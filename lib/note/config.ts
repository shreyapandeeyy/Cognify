import * as path from 'path';

export const serviceAccountPath = path.resolve(__dirname, 'C:Users/SHREYA PANDEY/Downloads/noteeyyyy/obsidian-b3268-firebase-adminsdk-x4t2b-993b7dec9d.json');

if (!serviceAccountPath) {
  throw new Error("Service account path is missing");
}

console.log("Service Account Path:", serviceAccountPath);
