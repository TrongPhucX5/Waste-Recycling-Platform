"use client";
import React, { useState } from "react";
import {
  Camera,
  MapPin,
  Trash2,
  FileText,
  AlertCircle,
  Check,
  Plus,
  X,
  Navigation,
} from "lucide-react";

interface ReportFormProps {
  onSubmit: () => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  onSubmit,
  userLocation,
}) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    location: userLocation?.latitude?.toString() || "",
    description: "",
    wasteType: [] as string[],
    address: "",
    longitude: userLocation?.longitude?.toString() || "",
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const wasteTypes = [
    {
      id: "organic",
      label: "Hữu cơ",
      color: "bg-green-100 text-green-700 border-green-300",
    },
    {
      id: "recyclable",
      label: "Tái chế",
      color: "bg-blue-100 text-blue-700 border-blue-300",
    },
    {
      id: "hazardous",
      label: "Nguy hiểm",
      color: "bg-red-100 text-red-700 border-red-300",
    },
    { id: "other", label: "Khác", color: "bg-gray-100 text-gray-700 border-gray-300" },
  ];

  const toggleWasteType = (typeId: string) => {
    setFormData({
      ...formData,
      wasteType: formData.wasteType.includes(typeId)
        ? formData.wasteType.filter((t) => t !== typeId)
        : [...formData.wasteType, typeId],
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages((prev) => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔴 REVERSE GEOCODING - Convert GPS to Address
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "vi", // Vietnamese language
          },
        }
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      const address = data.address?.road
        ? `${data.address.road}${data.address.house_number ? ", " + data.address.house_number : ""}, ${data.address.city || data.address.town || ""}`
        : data.display_name;

      return address;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };

  // 🔴 REQUEST GPS PERMISSION & GET CURRENT LOCATION
  const handleRequestLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Update GPS coordinates
          setFormData((prev) => ({
            ...prev,
            location: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
          }));

          // Get address from GPS coordinates
          const address = await reverseGeocode(latitude, longitude);
          if (address) {
            setFormData((prev) => ({
              ...prev,
              address: address,
            }));
          }

          setLocationLoading(false);
        },
        (error) => {
          setLocationError(
            "Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập."
          );
          console.error("Geolocation error:", error);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Trình duyệt không hỗ trợ Geolocation");
      setLocationLoading(false);
    }
  };

  // 🟢 USE CURRENT LOCATION FROM PROPS
  const handleUseCurrentLocation = async () => {
    if (userLocation) {
      const { latitude, longitude } = userLocation;

      // Update GPS coordinates
      setFormData((prev) => ({
        ...prev,
        location: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
      }));

      // Get address from GPS coordinates
      setLocationLoading(true);
      const address = await reverseGeocode(latitude, longitude);
      if (address) {
        setFormData((prev) => ({
          ...prev,
          address: address,
        }));
      }
      setLocationLoading(false);
      setLocationError(null);
    } else {
      setLocationError("Vị trí hiện tại không khả dụng");
    }
  };

  const canProceedStep1 = images.length > 0;
  const canProceedStep2 =
    formData.location &&
    formData.address &&
    formData.wasteType.length > 0;
  const canProceedStep3 = formData.description.length > 10;

  const handleSubmit = () => {
    console.log("Report submitted:", formData);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {[1, 2, 3, 4].map((stepNum, idx) => (
          <React.Fragment key={stepNum}>
            <button
              onClick={() => setStep(stepNum)}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                step >= stepNum
                  ? "bg-[#0AA468] text-white shadow-lg"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step > stepNum ? <Check size={24} /> : stepNum}
            </button>
            {idx < 3 && (
              <div
                className={`flex-1 h-1 rounded-full transition-all ${
                  step > stepNum ? "bg-[#0AA468]" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div className="font-semibold text-gray-900">Hình Ảnh</div>
        <div className="font-semibold text-gray-900">Vị Trí</div>
        <div className="font-semibold text-gray-900">Phân Loại</div>
        <div className="font-semibold text-gray-900">Chi Tiết</div>
      </div>

      {/* Step 1: Images */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              📸 Chụp Hình Rác Thải
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Upload Area */}
              <label className="col-span-3 sm:col-span-1 border-2 border-dashed border-[#0AA468] rounded-xl p-6 hover:bg-green-50 cursor-pointer transition-all text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Camera size={32} className="text-[#0AA468] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Thêm Ảnh</p>
                <p className="text-xs text-gray-600 mt-1">JPG, PNG</p>
              </label>

              {/* Image Previews */}
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border-2 border-gray-200 aspect-square group"
                >
                  <img
                    src={img}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {images.length > 0 && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Đã chọn {images.length} ảnh
              </p>
            )}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className="w-full py-3 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            Tiếp Tục
            <Plus size={20} />
          </button>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              📍 Vị Trí Rác Thải
            </label>

            {/* Error Message */}
            {locationError && (
              <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <AlertCircle
                  size={18}
                  className="text-red-600 mt-0.5 shrink-0"
                />
                <span className="text-sm text-red-600">{locationError}</span>
              </div>
            )}

            {/* Location Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Share Location Button */}
              <button
                onClick={handleRequestLocation}
                disabled={locationLoading}
                className="py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {locationLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Đang lấy...
                  </>
                ) : (
                  <>
                    <Navigation size={18} />
                    Chia Sẻ Vị Trí
                  </>
                )}
              </button>

              {/* Use Current Location Button */}
              <button
                onClick={handleUseCurrentLocation}
                disabled={!userLocation || locationLoading}
                className="py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {locationLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </>
                ) : (
                  <>
                    <MapPin size={18} />
                    Dùng Vị Trí Hiện Tại
                  </>
                )}
              </button>
            </div>

            {/* Map or Location Input */}
            <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center border-2 border-gray-300 mb-4">
              <div className="text-center">
                <MapPin size={40} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Bản đồ</p>
                {formData.location && formData.longitude && (
                  <p className="text-sm text-gray-500 mt-2">
                    📍 {formData.location}, {formData.longitude}
                  </p>
                )}
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Kinh độ (Latitude)
                </label>
                <input
                  type="text"
                  placeholder="21.0285"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Vĩ độ (Longitude)
                </label>
                <input
                  type="text"
                  placeholder="105.8542"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                />
              </div>
            </div>

            {/* Address - NOW AUTO-FILLED */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                📮 Địa Chỉ Chi Tiết{" "}
                {formData.address && (
                  <span className="text-green-600 font-bold">✓ Tự động</span>
                )}
              </label>
              <input
                type="text"
                placeholder="123 Cầu Giấy, Hà Nội"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
              />
              {!formData.address && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Bấm "Chia Sẻ Vị Trí" để tự động lấy địa chỉ
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              ← Quay Lại
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
            >
              Tiếp Tục →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Waste Type */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              🗑️ Phân Loại Rác
            </label>
            <p className="text-gray-600 mb-4">
              Chọn loại rác (có thể chọn nhiều)
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {wasteTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => toggleWasteType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                    formData.wasteType.includes(type.id)
                      ? type.color + " border-current"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {formData.wasteType.length > 0 && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Đã chọn {formData.wasteType.length} loại rác
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              ← Quay Lại
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!canProceedStep2}
              className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white font-bold rounded-lg transition-all"
            >
              Tiếp Tục →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Description */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              💬 Mô Tả Chi Tiết
            </label>

            <textarea
              placeholder="Mô tả tình trạng rác thải, vị trí, khoảng cách, số lượng... (tối thiểu 10 ký tự)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468] resize-none"
            />
            <p className="text-xs text-gray-600 mt-2">
              {formData.description.length}/100 ký tự (tối thiểu 10)
            </p>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-3">📋 Tóm Tắt Báo Cáo</p>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                📸 <strong>{images.length} ảnh</strong>
              </p>
              <p>
                📮 <strong>{formData.address || "Chưa chọn"}</strong>
              </p>
              <p>
                🗑️{" "}
                <strong>
                  {formData.wasteType.join(", ") || "Chưa chọn"}
                </strong>
              </p>
              <p>
                🧭{" "}
                <strong>
                  GPS: {formData.location || "?"}, {formData.longitude || "?"}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              ← Quay Lại
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canProceedStep3}
              className="flex-1 py-3 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Gửi Báo Cáo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};