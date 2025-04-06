# LOYAL COMMUNITY

A comprehensive educational and social platform designed to enhance school connectivity, providing students with real-time communication tools, academic tracking, and collaborative features.

## Features

- **Social Hub**: Connect with friends through games, events, and polls
- **Real-time Chat**: Communicate with classmates and teachers 
- **Homework Tracking**: Manage assignments and deadlines
- **Shared Timetable**: Coordinate schedules with classmates
- **Learning Resources**: Access quizzes, flashcards, daily facts, and educational videos
- **AI Tutoring**: Get personalized help with homework using Gemini AI
- **Gamification**: Earn XP and maintain streaks for consistent engagement
- **User Profiles**: Track achievements and learning progress

## Tech Stack

- Frontend: React, TailwindCSS, Shadcn/UI
- Backend: Express with TypeScript
- Database: PostgreSQL with Drizzle ORM
- Authentication: Firebase
- AI Integration: Google Gemini API
- Hosting: GitHub/Replit

## Converting to Android App

### Prerequisites

- Node.js installed
- Android Studio installed
- Java Development Kit (JDK) version 11 or higher

### Setup Instructions

1. Clone the repository from GitHub
2. Install dependencies
3. Build the web app
4. Add Android platform with Capacitor
5. Copy web assets to Android
6. Update dependencies
7. Open in Android Studio

### Firebase Configuration for Android

1. Add Android app in Firebase Console:
   - Use package name: com.loyalcommunity.app
   - App nickname: "LOYAL COMMUNITY"
   - Register app

2. Download google-services.json and place in android/app/ directory

4. Update build.gradle files with Firebase dependencies

### Features Available in Android App

The Android version of LOYAL COMMUNITY includes all features from the web app plus:

- Native push notifications
- Offline access to critical features
- Better performance on mobile devices
- Enhanced security with device-level authentication options

## Development

- Run development server through the workflow
- Test Android app using Capacitor

## Database Schema

The application uses a PostgreSQL database with the following main entities:
- Users
- Quizzes and Quiz Questions
- Flashcards
- Daily Facts
- Learning Videos
- Quiz Attempts
- Challenges
- Social Events
- Games
- Polls/Voting
- Messages
- Conversations
- AI Interactions & Learning Profiles
