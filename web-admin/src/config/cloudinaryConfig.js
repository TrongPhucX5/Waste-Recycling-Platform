// src/config/cloudinaryConfig.js

// 1. Thay bằng Cloud Name và Preset bạn vừa tạo ở Bước 1
const CLOUD_NAME = "dmlhzqkjk";
const UPLOAD_PRESET = "waste_app_preset";

/**
 * Hàm nhận file ảnh từ giao diện và đẩy lên Cloudinary
 */
export const uploadImageToCloudinary = async (imageFile) => {
  // Đóng gói ảnh để gửi đi
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("cloud_name", CLOUD_NAME);

  try {
    // Gọi API của Cloudinary bằng fetch (có sẵn của trình duyệt, không cần cài thêm)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    // Nếu thành công, trả về đường link ảnh an toàn (HTTPS)
    if (data.secure_url) {
      console.log("☁️ Đã tải ảnh lên thành công:", data.secure_url);
      return data.secure_url;
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
    return null;
  }
};
