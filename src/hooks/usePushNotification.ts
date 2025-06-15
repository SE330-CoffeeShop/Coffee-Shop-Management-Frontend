import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getFcmToken, onMessageListener, registerServiceWorker } from '../lib/firebase';

interface NotificationPayload {
  title?: string;
  body?: string;
}

interface PushNotificationState {
  token: string | null;
  notification: NotificationPayload | null;
  error: string | null;
}

export function usePushNotification(): PushNotificationState {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    registerServiceWorker();
    async function init() {
      try {
        const fcmToken = await getFcmToken();
        if (fcmToken && session?.user.accessToken) {
          setToken(fcmToken);
          await sendTokenToBackend(fcmToken, session.user.accessToken);
        } else {
          console.warn('No accessToken available for FCM registration');
        }
      } catch (err: any) {
        console.error('Failed to initialize push notifications:', err.message);
        setError(err.message);
      }
    }
    init();
    const unsubscribe = onMessageListener();
    return () => unsubscribe();
  }, [session]);

  async function sendTokenToBackend(fcmToken: string, accessToken: string): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notification/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token: fcmToken }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to register token: ${errorText}`);
      }
      console.log('Token registered with backend');
    } catch (err: any) {
      console.error('Error sending token to backend:', err.message);
      setError(err.message);
      throw err;
    }
  }

  return { token, notification, error };
}