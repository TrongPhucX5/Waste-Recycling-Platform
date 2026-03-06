export const uploadImageToCloudinary = async (imageFile) => {
  const cloudName = "TEN_CLOUD_CUA_BAN"; // Lead thay bằng tên thật
  const uploadPreset = "TEN_PRESET_CUA_BAN"; // Lead thay bằng tên preset (Unsigned)

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await response.json();
    return data.secure_url; // Trả về cái link ảnh HTTPs đẹp đẽ
  } catch (error) {
    console.error("Lỗi Upload Ảnh:", error);
    return null;
  }
};
