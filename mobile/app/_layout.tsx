// app/_layout.tsx
import React, { useEffect, ReactElement } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { ErrorBoundary } from "./error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot, useRouter } from "expo-router";

import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import { Platform, Alert } from "react-native";
import { supabase } from "@/config/supabase";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { registerForPushNotificationsAsync } from "@/utils/notification";
import messaging from '@react-native-firebase/messaging';

export default function RootLayout(): ReactElement | null {
  const [fontsLoaded, fontError] = useFonts({ ...FontAwesome.font });
  const { fetchEvents } = useEventsStore();
  const { fetchUser, user, registerPushToken } = useAuthStore();
  const router = useRouter();

  // 0️⃣ Crash early on font loading errors
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // 1️⃣ Once fonts are loaded, hide splash, init data, deep links and setup notifications
  useEffect(() => {
    if (!fontsLoaded) return;

    // Hide splash screen now that fonts & initial fetchUser have started
    SplashScreen.hideAsync();

    // Fetch initial app data
    fetchEvents();
    fetchUser().catch((err) => {
      if (err.name !== "UserUnAuthenticatedException") {
        console.error("Error checking auth state:", err);
      }
    });

    // A helper to parse & handle the URL
    const handleUrl = (url: string) => {
      const { queryParams } = Linking.parse(url);
      if (queryParams?.type === "magiclink" && queryParams?.access_token) {
        supabase.auth
          .setSession({
            access_token: String(queryParams.access_token),
            refresh_token: String(queryParams.refresh_token),
          })
          .then(() => router.replace("/"))
          .catch(console.error);
      }
    };

    // 1️⃣ Listen for links while the app is running
    const linkSub = Linking.addEventListener("url", ({ url }) => {
      console.log("🔔 Deeplink received:", url);
      handleUrl(url);
    });

    // 2️⃣ ALSO check if we were launched from a link
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log("🔔 Initial URL received:", initialUrl);
        handleUrl(initialUrl);
      }
    })();


    // Notification handler: always show alerts/banners
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Android channel
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    // Foreground listener
    const recvSub = Notifications.addNotificationReceivedListener((n) => {
      console.log("🔔 Notification received:", n);
    });
    // Tap-response listener
    const respSub = Notifications.addNotificationResponseReceivedListener(
      (r) => {
        console.log("👆 Notification response:", r);
      }
    );

    return () => {
      linkSub.remove();
      recvSub.remove();
      respSub.remove();
    };
  }, [fontsLoaded, fetchEvents, fetchUser, router]);

  // 2️⃣ When user logs in (or changes), register their push token
  useEffect(() => {
    if (!fontsLoaded || !user) return;

    (async () => {
      // (optional) quick visual canary to confirm this effect ran:
      // Alert.alert("Push", "Registering for push notifications");
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log("Registering new push token:", token);
        await registerPushToken(token);
      }
    })();
  }, [fontsLoaded, user, registerPushToken]);

  useEffect(() => {
    // Request permission and get the FCM token
    const getFCMToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('✅ FCM Token:', token);
        // Alert.alert('FCM Token', token); // Optional popup for quick viewing
      } else {
        console.warn('🚫 Notification permission not granted');
      }
    };

    getFCMToken();
  }, []);

  // Don’t render anything until fonts are loaded
  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

