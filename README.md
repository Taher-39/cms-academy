# CMS Academy - EdTech Platform (MERN)

An EdTech platform designed for Bangladeshi students (SSC/HSC) focusing on Math, ICT, and Science with AI-powered Q&A features.

## 🚀 Features
- **Course Management:** Browse and view video lessons by subject.
- **AI Chatbot:** Ask questions in Bangla and get instant subject-related answers (Powered by OpenAI).
- **Role-Based Access:** Admin (Manage courses) & Student (Learn & Ask).
- **Progress Tracking:** Keep track of completed lessons.

## 🛠 Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** MongoDB with Mongoose.
- **Security:** JWT (Access & Refresh Tokens), Zod Validation.
- **CI/CD:** GitHub Actions.

## 🛠 Setup Instructions
1. Clone the repo: `git clone <repo-url>`
2. Install Server deps: `cd server && npm install`
3. Create `.env` in `server/` with `PORT` and `DATABASE_URL`.
4. Run server: `npm run dev`