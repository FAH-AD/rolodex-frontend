// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDAYDoGzJUIYtx-vg_Dp2kdVXEh7uyPOpM",
  authDomain: "ecomrolodex-42ad9.firebaseapp.com",
  databaseURL: "https://ecomrolodex-42ad9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ecomrolodex-42ad9",
  storageBucket: "ecomrolodex-42ad9.appspot.com",
  messagingSenderId: "392811098027",
  appId: "1:392811098027:web:e15e0a2de1ebb65f916cee",
  measurementId: "G-BFTMBPLSSK",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
