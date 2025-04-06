import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.schoolconnect.app',
  appName: 'LOYAL COMMUNITY',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#6366f1",
      splashFullScreen: true,
      splashImmersive: true
    },
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com", "password"]
    },
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"],
    }
  }
};

export default config;