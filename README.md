# SchoolConnect

A Progressive Web App for school friends to stay connected with real-time chat, homework tracking, and shared timetable.

## Features

- User authentication with Firebase
- Real-time chat
- Homework tracking
- Shared timetable
- Fun Learning features for Class 9 students (CBSE syllabus)
  - Subject-wise quizzes
  - Flashcards for formulas and definitions
  - Daily facts
  - Learning videos
  - Leaderboards and challenges

## Tech Stack

- Frontend: React, TailwindCSS, Shadcn/UI
- Backend: Express
- Database: PostgreSQL with Drizzle ORM
- Authentication: Firebase
- Hosting: Replit (development)

## Converting to Android App

### Prerequisites

- Node.js installed
- Android Studio installed
- Java Development Kit (JDK) version 11 or higher

### Setup Instructions

1. Clone the repository from GitHub
2. Install dependencies: `npm install`
3. Build the web app: `npm run build`
4. Add Android platform: `npx cap add android`
5. Copy web assets: `npx cap copy android`
6. Update dependencies: `npx cap sync android`
7. Open in Android Studio: `npx cap open android`

### Firebase Configuration for Android

1. Add Android app in Firebase Console
2. Download google-services.json
3. Place in android/app/ directory
4. Update build.gradle files as needed

## Development

- Run dev server: `npm run dev`
- Test Android app: `npx cap run android`

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- Users
- Quizzes and Quiz Questions
- Flashcards
- Daily Facts
- Learning Videos
- Quiz Attempts
- Challenges