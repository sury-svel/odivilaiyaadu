// app/(modal)/_layout.tsx
import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',  // iOS-style modal
        headerShown: true,      // show the header bar with back button
        gestureEnabled: true,   // allow swipe-to-dismiss on iOS
      }}
    />
  );
}
