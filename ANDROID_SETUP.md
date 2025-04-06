# Android Setup for SchoolConnect

This guide provides detailed steps to convert the SchoolConnect web application to an Android app using Capacitor and Firebase.

## Prerequisites

- Node.js installed
- Android Studio installed
- Java Development Kit (JDK) version 11 or higher
- Firebase project with web configuration (already set up)
- `google-services.json` file from Firebase Android app registration

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

1. Place your `google-services.json` file (from Firebase Console) in:
   ```
   android/app/google-services.json
   ```

2. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```

3. Update your Android project's build files to include Firebase:

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

## Step 4: Firebase Authentication Setup

For Google Sign-In and Firebase Auth to work on Android:

1. In Android Studio, add these to your dependencies if not already present:
   ```gradle
   implementation 'com.google.android.gms:play-services-auth:20.6.0'
   ```

2. In your `MainActivity.java` (or `.kt` if using Kotlin), add plugin registration for Firebase:
   ```java
   // Java version
   import com.getcapacitor.BridgeActivity;

   public class MainActivity extends BridgeActivity {
     @Override
     public void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
     }
   }
   ```

## Step 5: Building and Testing

Build and test your Android app:

```bash
# Build Android app
cd android
./gradlew build

# Or run directly from Capacitor
npx cap run android
```

## Troubleshooting

1. **Firebase Auth Issues**:
   - Check that your SHA-1 fingerprint in Firebase console matches your build environment
   - For debug builds, ensure the debug SHA-1 is added
   - For release builds, add the release SHA-1 as well

2. **Build Issues**:
   - Make sure `google-services.json` is in the correct location
   - Check Gradle version compatibility
   - Ensure all Firebase dependencies are correctly added

3. **Runtime Errors**:
   - Check Android Logcat for detailed error messages
   - Verify that all required permissions are in the AndroidManifest.xml

## Further Customization

1. **App Icon**:
   - Replace the icon files in `android/app/src/main/res/` directories
   - Different size icons go in different 'mipmap' folders

2. **Splash Screen**:
   - Customize splash screen in `android/app/src/main/res/drawable/splash.png`

3. **Deep Linking**:
   - For custom URL schemes, update the `AndroidManifest.xml` 
   - Add Intent filters for handling deep links