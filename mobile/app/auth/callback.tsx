import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/config/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const currentUrl = window.location.href;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
  
        if (error) {
          console.error('Error handling callback:', error.message);
          setStatus('error');
          return;
        }
  
        if (data?.session) {
          setStatus('success');
  
          // Redirect to profile tab
          setTimeout(() => {
            router.replace('/profile');
          }, 2000);
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setStatus('error');
      }
    };
  
    handleCallback();
  }, []);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {status === 'loading' && (
        <>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Processing your confirmation...</Text>
        </>
      )}
      {status === 'success' && (
        <Text style={{ color: 'green', fontSize: 18 }}>✅ Successfully confirmed! Redirecting...</Text>
      )}
      {status === 'error' && (
        <Text style={{ color: 'red', fontSize: 18 }}>❌ Something went wrong. Please try again.</Text>
      )}
    </View>
  );
}
