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

1. Add Android app in Firebase Console:
   - Use package name: `com.schoolconnect.app`
   - App nickname: "SchoolConnect"
   - Register app

2. Download `google-services.json` (already included in this project)
3. Place in `android/app/` directory

4. Update build.gradle files:
   
   **Project-level build.gradle** (android/build.gradle):
   ```gradle
   buildscript {
     dependencies {
       // Add this line
       classpath 'com.google.gms:google-services:4.3.15'
     }
   }
   ```

   **App-level build.gradle** (android/app/build.gradle):
   ```gradle
   // Add at the bottom of the file
   apply plugin: 'com.google.gms.google-services'
   
   // In dependencies section:
   dependencies {
     // ... other dependencies
     
     // Firebase dependencies
     implementation platform('com.google.firebase:firebase-bom:32.3.1')
     implementation 'com.google.firebase:firebase-analytics'
     implementation 'com.google.firebase:firebase-auth'
     implementation 'com.google.firebase:firebase-firestore'
     implementation 'com.google.firebase:firebase-messaging'
     implementation 'com.google.android.gms:play-services-auth:20.6.0'
   }
   ```

### Features Available in Android App

The Android version of SchoolConnect includes all features from the web app plus:

- Native push notifications
- Offline access to critical features
- Better performance on mobile devices
- Enhanced security with device-level authentication options

### Troubleshooting Android Build

- If Google Sign-In isn't working: Verify the SHA-1 fingerprint in Firebase Console
- For build errors: Check Android Studio's Logcat for detailed error messages
- For Firebase initialization errors: Ensure google-services.json is placed correctly

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