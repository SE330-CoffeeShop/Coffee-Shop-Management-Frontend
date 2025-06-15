importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBAvZuzkFPfwFTwBoWonqKTo79Ii8xqt8Y',
  authDomain: 'bcoffee-backend-pushnoti.firebaseapp.com',
  projectId: 'bcoffee-backend-pushnoti',
  storageBucket: 'bcoffee-backend-pushnoti.firebasestorage.app',
  messagingSenderId: '936266773234',
  appId: '1:936266773234:web:d2d05fb72ced6cf93f966b',
  measurementId: 'G-GK4BLD0GGW'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  const notification = payload.notification;
  if (notification) {
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: '/favicon.ico'
    });
  }
});