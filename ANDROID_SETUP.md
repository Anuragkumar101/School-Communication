# Android Setup for SchoolConnect

This guide provides detailed steps to convert your SchoolConnect web application to an Android app using Capacitor and Firebase.

## Prerequisites

- Node.js installed
- Android Studio installed
- Java Development Kit (JDK) version 11 or higher
- Firebase project with web configuration (already set up)

## Step 1: Build the Web App

```bash
# Install dependencies if not already done
npm install

# Build the web app
npm run build
```

## Step 2: Add Android Platform

```bash
# Add Android platform to your project
npx cap add android

# Copy web assets to Android project
npx cap copy android

# Update Android project with any dependency changes
npx cap sync android
```

## Step 3: Firebase Configuration for Android

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Open your project
3. Add a new Android app to your Firebase project:
   - Click the Android icon to add an Android app
   - Use the package name: `com.schoolconnect.app` (same as in capacitor.config.ts)
   - Enter app nickname: "SchoolConnect"
   - Add SHA-1 key (optional for now, required for Google Sign-In)
   - Register the app

4. Download the `google-services.json` file
5. Place this file in your Android project's app directory: `android/app/google-services.json`

6. Open the Android project in Android Studio:
```bash
npx cap open android
```

7. Update your Android project's build files to include Firebase:

   - **Project-level build.gradle** (android/build.gradle):
     Add Google services plugin to classpath

   ```gradle
   buildscript {
     dependencies {
       // Add this line
       classpath 'com.google.gms:google-services:4.3.15'
     }
   }
   ```

   - **App-level build.gradle** (android/app/build.gradle):
     Apply the Google services plugin at the bottom of the file

   ```gradle
   apply plugin: 'com.android.application'
   // ... other code
   // Add this at the bottom of the file
   apply plugin: 'com.google.gms.google-services'
   ```

   - **App-level build.gradle** (android/app/build.gradle):
     Also add Firebase dependencies in the dependencies section

   ```gradle
   dependencies {
     // ... other dependencies
     
     // Firebase dependencies
     implementation platform('com.google.firebase:firebase-bom:32.3.1')
     implementation 'com.google.firebase:firebase-analytics'
     implementation 'com.google.firebase:firebase-auth'
     implementation 'com.google.firebase:firebase-firestore'
     implementation 'com.google.firebase:firebase-messaging'
   }
   ```

## Step 4: Native Firebase Setup (If needed)

For deeper native integration (like push notifications), you'll need Capacitor Firebase plugins:

```bash
npm install @capacitor-firebase/authentication @capacitor-firebase/messaging
npx cap sync android
```

Then update your `capacitor.config.ts` file to include the Firebase plugin configurations.

## Step 5: Building and Testing

Build and test your Android app:

```bash
# Build Android app
cd android
./gradlew build

# Or run directly from Capacitor
npx cap run android
```

## Important Notes

1. **Google Sign-In with SHA-1 Key**:
   - For Google Sign-In to work on Android, you must add your SHA-1 key to Firebase
   - You can get this from your keystore file or using:
     ```bash
     cd android
     ./gradlew signingReport
     ```

2. **Android Manifest Permissions**:
   - Check `android/app/src/main/AndroidManifest.xml` for proper permissions
   - For notifications, internet access, etc.

3. **Custom URL Schemes**:
   - For deep linking, update AndroidManifest.xml and capacitor.config.ts

4. **Troubleshooting**:
   - If you encounter Firebase initialization errors, check package name consistency
   - Ensure google-services.json is in the correct location
   - Verify Gradle files have proper Firebase dependencies and plugins