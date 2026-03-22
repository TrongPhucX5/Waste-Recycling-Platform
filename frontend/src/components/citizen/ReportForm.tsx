"use client";
import React, { useState, useEffect } from "react";
import { Camera, MapPin, Upload, Trash2, AlertCircle, X } from "lucide-react";
import { categoryApi, WasteCategory } from "../../lib/api/categoryApi";
import { reportApi } from "../../lib/api/reportApi";

interface ReportFormProps {
  onSubmit: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingGPS, setIsGettingGPS] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [isLoadingCat, setIsLoadingCat] = useState(true);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryApi.getAllCategories()
      .then(res => {
        setCategories(res.data);
        setIsLoadingCat(false);
      })
      .catch(err => {
        console.error("Failed to load categories", err);
        setIsLoadingCat(false);
      });
  }, []);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=vi-VN`);
      const data = await res.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    } catch (error) {
      console.error("Reverse geocoding failed", error);
    }
    return `Vị trí GPS: ${lat}, ${lon}`;
  };

  const handleGPSLocation = () => {
    if ("geolocation" in navigator) {
      setIsGettingGPS(true);
      navigator.geolocation.getCurrentPosition(async (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        const addressName = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setAddress(addressName);
        setIsGettingGPS(false);
      }, (err) => {
        alert("Không thể lấy GPS. Vui lòng kiểm tra quyền truy cập.");
        setIsGettingGPS(false);
      });
    } else {
      alert("Trình duyệt không hỗ trợ GPS.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const geocodeAddress = async (addr: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error("Geocoding failed", error);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCategoryId || imageFiles.length === 0 || !address) {
      setError("Vui lòng điền đầy đủ thông tin địa chỉ, ảnh và loại rác.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Bạn chưa đăng nhập! Vui lòng nhấn nút 'ĐĂNG NHẬP' ở góc trên bên phải bằng tài khoản công dân (Citizen) để tạo báo cáo rác.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalLat = latitude;
      let finalLon = longitude;

      // If user provided address but didn't use GPS, try to geocode it
      if (finalLat === "" || finalLon === "") {
        const coords = await geocodeAddress(address);
        if (coords) {
          finalLat = coords.lat;
          finalLon = coords.lon;
        } else {
          // Default fallback coordinates (Hanoi, Vietnam)
          finalLat = 21.0285;
          finalLon = 105.8048;
        }
      }

      const formData = new FormData();
      formData.append("WasteCategoryId", selectedCategoryId.toString());
      formData.append("Latitude", finalLat.toString());
      formData.append("Longitude", finalLon.toString());
      formData.append("Description", description);
      formData.append("Address", address);
      formData.append("AiSuggestion", "");
      
      // Append multiple images under the same key
      imageFiles.forEach(file => {
        formData.append("Images", file);
      });

      await reportApi.createWasteReport(formData);
      
      setIsSubmitting(false);
      onSubmit();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi khi tạo báo cáo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tạo Báo Cáo Thu Gom</h2>
        <p className="text-gray-500 mt-1">Cung cấp thông tin và vài hình ảnh góc độ khác nhau để người thu gom dễ nhận biết rác tái chế.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Upload Image Section */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/80 transition-colors relative group">
            <input 
              type="file" 
              accept="image/*" 
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleFileChange}
              required={imageFiles.length === 0}
            />
            <div className="flex flex-col items-center pointer-events-none">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800">Chụp hoặc Tải Lên Nhiều Ảnh Cùng Lúc</h3>
              <p className="text-sm text-emerald-600/70 mt-1">Hỗ trợ JPG, PNG • Tối đa 5MB mỗi ảnh</p>
            </div>
          </div>

          {/* Previews Grid */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-100 shadow-sm group">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                      title="Xóa ảnh"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location & GPS */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" />
              Vị Trí Nhận Rác
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ví dụ: 123 Đường Ngọc Khánh, Ba Đình..." 
                className="flex-1 rounded-lg border-gray-200 border p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
              <button 
                type="button" 
                onClick={handleGPSLocation}
                disabled={isGettingGPS}
                className="bg-emerald-100 text-emerald-700 px-4 py-3 rounded-lg font-medium hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70"
              >
                {isGettingGPS ? (
                  <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
                ) : (
                  <MapPin size={18} />
                )}
                {isGettingGPS ? "Đang định vị..." : "GPS Ngay"}
              </button>
            </div>
          </div>

          {/* Waste Type selection */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <label className="text-sm font-semibold text-gray-700">Phân Loại Rác Tại Nguồn</label>
            {isLoadingCat ? (
              <p className="text-sm text-gray-500">Đang tải danh mục...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <label key={category.id} className="relative cursor-pointer">
                    <input 
                      type="radio" 
                      name="wasteType" 
                      value={category.id} 
                      onChange={() => setSelectedCategoryId(category.id)}
                      checked={selectedCategoryId === category.id}
                      className="peer sr-only" 
                      required 
                    />
                    <div className="p-4 h-full rounded-xl border-2 border-gray-100 text-center hover:border-emerald-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50/50 transition-all bg-gray-50">
                      <Trash2 className="mx-auto mb-2 text-emerald-500" size={24} />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Mô Tả Thêm (Ghi chú cho người thu gom)</label>
            <textarea 
              rows={3} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border-gray-200 border p-3 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              placeholder="Ví dụ: Gọi tôi 10 phút trước khi đến..."
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md shadow-emerald-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
          >
            {isSubmitting ? (
               <span className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 Đang Gửi...
               </span>
            ) : (
              <>
                <Upload size={20} />
                Tạo Báo Cáo Có Đính Kèm ({imageFiles.length}) Ảnh
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
