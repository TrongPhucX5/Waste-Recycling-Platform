// Form báo cáo rác (ảnh, GPS, mô tả, loại rác)
import React, { useState } from "react";

const ReportForm = ({ onSubmit }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  // ... các trường GPS

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(image, /*gps*/ {}, description, type);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* upload ảnh, nhập mô tả, chọn loại rác, GPS */}
      <button type="submit">Gửi báo cáo</button>
    </form>
  );
};

export default ReportForm;
