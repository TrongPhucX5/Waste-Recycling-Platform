"use client";
import React, { useState } from "react";
import { X, MapPin, Phone, Weight, Camera, MessageSquare } from "lucide-react";

interface CollectionTask {
  id: string;
  taskNumber: string;
  reportNumber: string;
  location: string;
  address: string;
  wasteType: string;
  estimatedWeight: number;
  status: "pending" | "assigned" | "on_the_way" | "collected";
  createdAt: string;
  latitude: number;
  longitude: number;
  citizenName: string;
  contactPhone: string;
}

interface Props {
  isOpen: boolean;
  task: CollectionTask;
  onClose: () => void;
  onUpdate: (task: CollectionTask) => void;
}

export const TaskDetailModal: React.FC<Props> = ({
  isOpen,
  task,
  onClose,
  onUpdate,
}) => {
  const [step, setStep] = useState<"details" | "update" | "confirm">("details");
  const [actualWeight, setActualWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartCollection = () => {
    const updatedTask = { ...task, status: "on_the_way" as const };
    onUpdate(updatedTask);
  };

  const handleCompleteCollection = () => {
    if (!actualWeight || isNaN(Number(actualWeight))) {
      alert("Vui lòng nhập trọng lượng hợp lệ");
      return;
    }

    const updatedTask = { ...task, status: "collected" as const };
    onUpdate(updatedTask);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{task.taskNumber}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === "details" && (
            <>
              {/* Task Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Báo Cáo</span>
                  <span className="font-bold text-gray-900">{task.reportNumber}</span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Vị Trí</p>
                    <p className="text-gray-900 font-medium">{task.address}</p>
                    <p className="text-xs text-gray-600">
                      GPS: {task.latitude}, {task.longitude}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Liên Hệ</p>
                    <p className="text-gray-900 font-medium">{task.citizenName}</p>
                    <p className="text-xs text-gray-600">{task.contactPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Weight size={20} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Trọng Lượng Dự Kiến
                    </p>
                    <p className="text-gray-900 font-medium">
                      {task.estimatedWeight} kg
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Loại Rác:</strong> {task.wasteType}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Đóng
                </button>
                {task.status === "assigned" && (
                  <button
                    onClick={() => {
                      handleStartCollection();
                      onClose();
                    }}
                    className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all"
                  >
                    Bắt Đầu Thu Gom
                  </button>
                )}
                {task.status === "on_the_way" && (
                  <button
                    onClick={() => setStep("update")}
                    className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all"
                  >
                    Hoàn Thành
                  </button>
                )}
              </div>
            </>
          )}

          {step === "update" && (
            <>
              {/* Completion Form */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Nhập Thông Tin Hoàn Thành</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Trọng Lượng Thực Tế (kg) *
                  </label>
                  <input
                    type="number"
                    placeholder={task.estimatedWeight.toString()}
                    value={actualWeight}
                    onChange={(e) => setActualWeight(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ghi Chú (Tùy Chọn)
                  </label>
                  <textarea
                    placeholder="Thêm ghi chú về công việc..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tải Ảnh Bằng Chứng *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">
                          Nhấp để tải ảnh
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setStep("details")}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Quay Lại
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  disabled={!actualWeight || !image}
                  className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
                >
                  Tiếp Tục
                </button>
              </div>
            </>
          )}

          {step === "confirm" && (
            <>
              {/* Confirmation */}
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-lg font-bold text-green-700 mb-2">
                    ✓ Xác Nhận Hoàn Thành
                  </p>
                  <p className="text-sm text-green-600">
                    Kiểm tra kỹ thông tin trước khi xác nhận
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Trọng lượng</span>
                    <span className="font-bold text-gray-900">
                      {actualWeight} kg
                    </span>
                  </div>
                  {imagePreview && (
                    <div>
                      <p className="text-gray-700 mb-2">Ảnh</p>
                      <img
                        src={imagePreview}
                        alt="evidence"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setStep("update")}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Chỉnh Sửa
                </button>
                <button
                  onClick={() => {
                    handleCompleteCollection();
                    onClose();
                  }}
                  className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all"
                >
                  Xác Nhận Hoàn Thành
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};