// notifications.ts
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  console.log('Existing Status:', existingStatus);
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission Denied', 'You will not receive notifications about game scores.');
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo push token:', token);

  return token;
}
