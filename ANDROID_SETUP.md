# Android App Setup Guide for LOYAL COMMUNITY

This guide will help you set up and run the LOYAL COMMUNITY app on your Android device.

## Prerequisites

1. **Node.js and npm** - Make sure you have Node.js and npm installed on your computer
2. **Android Studio** - Required for Android SDK tools
3. **Java Development Kit (JDK)** - Version 11 or newer
4. **An Android device or emulator** - For testing

## Setup Instructions

### 1. Install Required Tools

If you haven't already, install the following:

```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli
```

### 2. Build Your Web App

Before building the Android app, you need to build the web version:

```bash
# Build the web app
npm run build
```

This will create a `dist` folder with your optimized web app.

### 3. Sync Your Project with Capacitor

After building your web app, sync it with Capacitor:

```bash
# Sync your web code to the Android platform
npx cap sync android
```

### 4. Open in Android Studio

```bash
# Open the Android project in Android Studio
npx cap open android
```

This will open the Android project in Android Studio where you can build and run the app.

### 5. Build and Run

In Android Studio:
1. Wait for the Gradle sync to complete
2. Click the "Run" button (green triangle) in the toolbar
3. Select your connected device or an emulator

## Firebase Configuration

The app is already configured with Firebase for authentication and messaging. The `google-services.json` file is included in the project.

## Adding SHA-1 Certificate Fingerprint

For Google Sign-In to work properly, you need to add your debug certificate fingerprint to Firebase:

1. Generate your SHA-1 fingerprint:
   ```bash
   # For Windows
   keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android

   # For macOS/Linux
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. Go to Firebase Console > Project settings > Your Android app > Add fingerprint
3. Paste your SHA-1 fingerprint

## Mobile-Specific Features

### Push Notifications

The app is configured to receive push notifications via Firebase Cloud Messaging.

### App Icons and Splash Screen

To customize icons and splash screen:

1. Replace the placeholder icons in:
   ```
   android/app/src/main/res/mipmap-*/
   ```

2. Update splash screen in:
   ```
   android/app/src/main/res/drawable/splash.png
   ```

## Building a Release Version

When you're ready to create a release build:

1. Update the version code and name in `android/app/build.gradle`
2. Create a signed APK or App Bundle in Android Studio:
   - Build > Generate Signed Bundle / APK
   - Follow the instructions to create a signing key and build

## Troubleshooting

### Common Issues

1. **Build fails with Gradle errors**:
   - Make sure you have the latest Android Studio version
   - Try running `./gradlew clean` in the android directory

2. **App crashes at startup**:
   - Check Logcat in Android Studio for error details
   - Verify that `google-services.json` is properly configured

3. **Firebase Authentication issues**:
   - Verify that SHA-1 fingerprint is added to Firebase console
   - Check if the package name matches in all places

### Getting Help

If you encounter issues not covered here, check:
- Capacitor documentation: https://capacitorjs.com/docs
- Firebase Android documentation: https://firebase.google.com/docs/android/setup

## Device Compatibility

The app is configured to support:
- Android 6.0 (API level 23) and higher
- Both phones and tablets