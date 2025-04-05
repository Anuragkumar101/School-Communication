# SchoolConnect

A Progressive Web App for school friends to stay connected with real-time chat, homework tracking, and shared timetable.

## Features

- User authentication
- Real-time chat
- Homework tracking
- Shared timetable
- Fun Learning features (quizzes, flashcards, daily facts, etc.)

## Converting to Android App

After pushing the code to GitHub, follow these steps to create an Android app:

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Android Studio](https://developer.android.com/studio) installed
- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) version 11 or higher

### Setup Instructions

1. Clone the repository from GitHub:
   ```bash
   git clone <your-github-repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the web app:
   ```bash
   npm run build
   ```

4. Initialize Capacitor (already done in this repo):
   ```bash
   npx cap init
   ```

5. Add Android platform:
   ```bash
   npx cap add android
   ```

6. Copy web assets to the Android project:
   ```bash
   npx cap copy android
   ```

7. Update native dependencies:
   ```bash
   npx cap sync android
   ```

8. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```

9. In Android Studio:
   - Wait for the Gradle build to complete
   - Update the package name in the AndroidManifest.xml if necessary
   - Configure app icon and splash screen in the res folder
   - Set up signing configuration in Build > Generate Signed Bundle/APK

10. Build the APK:
    - In Android Studio, go to Build > Build Bundle(s) / APK(s) > Build APK(s)
    - Or use the command line: `./gradlew assembleDebug` (in the android directory)

11. Run the app:
    - Connect your Android device via USB with USB debugging enabled
    - In Android Studio, click the "Run" button (or press Shift+F10)

### Firebase Configuration for Android

1. Go to [Firebase Console](https://console.firebase.google.com/) 
2. Select your project
3. Add Android app to your Firebase project:
   - Use package name from capacitor.config.ts (e.g., "com.schoolconnect.app")
   - Generate and download google-services.json
   - Place the file in the android/app/ directory

4. Update the android/app/build.gradle file to include Firebase SDK

### Troubleshooting

- If you encounter build errors, make sure you have the latest Android Studio and SDK tools
- For Firebase issues, verify the google-services.json file is correctly placed
- Check Capacitor logs for detailed error messages: `npx cap doctor`

## Deployment

For web deployment:
1. Build the project: `npm run build`
2. Deploy to Firebase Hosting: `firebase deploy`

## Development

- Run the development server: `npm run dev`
- Test the Android app: `npx cap run android`