// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Thêm dòng này để dùng Database
import { getAuth } from "firebase/auth"; // Thêm dòng này để Đăng nhập

const firebaseConfig = {
  apiKey: "AIzaSyAZ2kwgqKRV6ZpoVh3nDt4jFvbZcCMcgAU",
  authDomain: "cnpm-bb625.firebaseapp.com",
  projectId: "cnpm-bb625",
  storageBucket: "cnpm-bb625.firebasestorage.app",
  messagingSenderId: "157669961962",
  appId: "1:157669961962:web:589b0acd9be998f3eaa793",
  measurementId: "G-FCVCVPYLEE",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Xuất db và auth ra để các file khác gọi được
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("🔥 Firebase đã sẵn sàng!");
