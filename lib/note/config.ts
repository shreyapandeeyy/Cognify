import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error("Service account path is missing");
}

console.log("Service Account Path:", serviceAccountPath);
