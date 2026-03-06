import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Lead nhớ thay các dòng này bằng thông tin lấy trên trang Firebase Console nhé
const firebaseConfig = {
  apiKey: "AIzaSy_MA_CUA_BAN...",
  authDomain: "ten-du-an.firebaseapp.com",
  projectId: "ten-du-an",
  storageBucket: "ten-du-an.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:12345:web:abcdef",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các công cụ ra để các Dev khác lấy dùng
export const db = getFirestore(app); // Dùng để thêm/sửa/xóa rác
export const auth = getAuth(app); // Dùng để đăng nhập/đăng ký
