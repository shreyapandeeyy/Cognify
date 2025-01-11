<p align="center">
  <img src="https://github.com/user-attachments/assets/b1207ec5-70be-4636-ae27-9c4028147df1"/>
</p>
<p align="center">
AI-powered GitHub for notes, enabling users to share their notes publicly and discover relevant ones in the community through smart vector search.
</p>
<p align="center">
  DandyHacks '24 Winner
</p>
<p align="center"><a href="https://devpost.com/software/netherite">Devpost</a></p>
</p>
</p>
<p align="center"><a href="https://netherite.vercel.com">Try it out</a></p>
</p>

## Features

<li>Create and edit notes with fully-fledged text editor</li>
<li>Search the community database for relevant note segments</li>
<li>Highlight your favorite notes in the community and add them into yours</li>
<li>AI note summaries</li>
<li>Engage and support other notes through likes and stars</li>

## Screenshots

<img width="500" alt="Screenshot 2024-11-17 at 9 45 34 AM" src="https://github.com/user-attachments/assets/5b56f847-a497-46dc-9cd2-b458101fc390">
<img width="500" alt="Screenshot 2024-11-17 at 9 47 23 AM" src="https://github.com/user-attachments/assets/d853b669-bbf5-4f13-8504-89d85f7c5938">
<br><br>
<img width="500" alt="Screenshot 2024-11-17 at 9 47 39 AM" src="https://github.com/user-attachments/assets/b6064c4f-ae27-4afc-994d-e1732af6bb59">
<img width="500" alt="Screenshot 2024-11-17 at 9 48 23 AM" src="https://github.com/user-attachments/assets/d8fe2c25-fc6b-4f28-9a79-d2c4cde11f18">



## Run App Locally

```bash
npm i
npm run dev
```

## Detailed Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/AyushDhimann/obsidian.git
cd obsidian
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory of the project and add the following environment variables. You can refer to the `.env.example` file for the required variables:

```bash
SERVICE_ACCOUNT_KEY=<your-service-account-key>
FIREBASE_PROJECT_ID=<your-firebase-project-id>
PINECONE_KEY=<your-pinecone-api-key>
GEMINI_KEY=<your-gemini-api-key>
```

4. Create a Firebase account and project:

- Go to [Firebase Console](https://console.firebase.google.com/)
- Click on "Add project" and follow the instructions to create a new project
- Once the project is created, go to "Project settings" and click on "Service accounts"
- Click on "Generate new private key" to download the `.json` file
- Place the downloaded `.json` file in your project directory

5. Run the setup script to create the tables:

```bash
node setup/setup.js
```

6. Create a Pinecone account and get the API key:

- Go to [Pinecone](https://www.pinecone.io/)
- Sign up and create an account
- Get the API key from the dashboard
- Add the API key to the `.env` file

7. Create a database with Microsoft embeddings named "embeddings":

- Go to the Pinecone dashboard
- Create a new index with the name "embeddings" and select Microsoft embeddings

8. Create a Clerk account and configure the `.env` file:

- Go to [Clerk](https://clerk.dev/)
- Sign up and create an account
- Add the Clerk values to the `.env` file accordingly

9. Start the development server:

```bash
npm run dev
```

10. Open your browser and navigate to `http://localhost:3000` to see the application running.
