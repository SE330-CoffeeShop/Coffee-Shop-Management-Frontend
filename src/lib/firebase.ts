import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Khởi tạo Firebase chỉ trên client-side
let firebaseApp: FirebaseApp | undefined;
let messaging: Messaging | undefined;

if (typeof window !== 'undefined') {
  firebaseApp = initializeApp(firebaseConfig);
  try {
    messaging = getMessaging(firebaseApp);
  } catch (err) {
    console.error('Firebase messaging not supported:', err);
  }
}

// Hàm lấy FCM token
export async function getFcmToken(): Promise<string | null> {
  if (!messaging) {
    console.error('Messaging not initialized');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });
      console.log('FCM Token:', token);
      return token;
    } else {
      console.warn('Notification permission denied');
      return null;
    }
  } catch (err) {
    console.error('Error getting FCM token:', err);
    return null;
  }
}

// Xử lý thông báo foreground
export function onMessageListener(): () => void {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload: MessagePayload) => {
    console.log('Foreground Message:', payload);
    const notification = payload.notification;
    if (notification) {
      new Notification(notification.title || 'Notification', {
        body: notification.body,
        icon: '/favicon.ico'
      });
    }
  });
}

export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  }
}

export { firebaseApp, messaging };