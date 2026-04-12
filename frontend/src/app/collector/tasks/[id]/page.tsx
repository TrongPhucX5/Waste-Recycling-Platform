"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collectorTaskApi } from "@/lib/api/collectorTaskApi";
import { API_CONFIG } from "@/lib/api/config";
import { Button, Input, Badge } from "@/components/ui";
import { MapPin, User, ArrowLeft, Image as ImageIcon, CheckCircle, Clock } from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [weightKg, setWeightKg] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      collectorTaskApi.getTaskById(params.id as string)
        .then(res => setTask(res))
        .catch(() => alert("Failed to load task details"));
    }
  }, [params.id]);

  if (!task) return <div className="p-8 text-center text-gray-500 mt-20">Loading task details...</div>;

  const handleStartPickup = async () => {
    try {
      await collectorTaskApi.setOnTheWay(task.id);
      window.location.reload(); 
    } catch (err: any) {
      console.error(err);
      alert(`Failed to update status: ${err.message || JSON.stringify(err.data)}`);
    }
  };

  const handleComplete = async () => {
    if (!weightKg) return alert("Please enter weight (kg)");
    if (!image) return alert("Please upload a proof image");
    
    try {
      const formData = new FormData();
      formData.append("WeightKg", weightKg);
      formData.append("Notes", notes);
      formData.append("Images", image);

      await collectorTaskApi.completeTask(task.id, formData);
      window.location.reload();
    } catch (err: any) {
      alert(`Failed to complete task: ${err.message || JSON.stringify(err.data)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.back()} className="mb-4 text-emerald-600 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
        </Button>

        {/* WRP-109: Task Details Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.report.categoryName || "Rác thải không xác định"}</h1>
              <p className="text-gray-500 mt-1 text-sm">Mã nhiệm vụ: {task.id}</p>
            </div>
            <Badge variant={task.status === "Collected" ? "success" : task.status === "OnTheWay" ? "info" : "warning"}>
              {task.status.replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Thông tin Người dân</h3>
              <div className="space-y-3 text-gray-700 text-sm">
                <p className="flex items-center"><User className="h-4 w-4 mr-2 text-gray-400"/> {task.report.citizenName}</p>
                <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1 flex-shrink-0"/> {task.report.address}</p>
                {task.report.citizenPhone && <p className="flex items-center text-blue-600">📞 {task.report.citizenPhone}</p>}
                
                {task.report.description && (
                  <div className="mt-4 bg-yellow-50 p-3 rounded text-yellow-800 border border-yellow-200">
                    <b>Ghi chú người gửi:</b> {task.report.description}
                  </div>
                )}
              </div>
            </div>

            <div>
               <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">Lịch trình</h3>
               <div className="space-y-3 flex flex-col text-sm text-gray-600">
                 <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" /> Được chỉ định lúc: {new Date(task.assignedAt).toLocaleString('vi-VN')}
                 </div>
                 {task.completedAt && (
                   <div className="flex items-center">
                     <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Hoàn thành lúc: {new Date(task.completedAt).toLocaleString('vi-VN')}
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* Report Images Section */}
        {task.report?.imageUrls && task.report.imageUrls.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-indigo-500" /> 
              Hình ảnh từ người dân ({task.report.imageUrls.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {task.report.imageUrls.map((fileName: string, index: number) => {
                const fileUrl = `${API_CONFIG.SERVER_URL}/uploads/${fileName}`;
                return (
                  <div 
                    key={index}
                    onClick={() => setSelectedImage(fileUrl)}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-emerald-500 transition-colors group relative"
                  >
                    <img 
                      src={fileUrl} 
                      alt={`Report image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" font-family="sans-serif" font-size="12" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle">Lỗi</text></svg>';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" size={24} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WRP-110: Update Task Status Section */}
        <div className="bg-emerald-50 rounded-lg p-6 shadow-sm border border-emerald-100">
          <h3 className="font-semibold text-lg mb-4 text-emerald-900 border-b border-emerald-200 pb-2">Cập nhật tiến độ nhiệm vụ</h3>
          
          {task.status.toLowerCase() === "assigned" && (
            <div className="space-y-4">
              <p className="text-emerald-800 text-sm">Bạn đã được phân công thu gom rác thải này. Khi bạn đã sẵn sàng di chuyển đến địa điểm, vui lòng nhấn cập nhật trạng thái.</p>
              <Button onClick={handleStartPickup} className="bg-emerald-600 hover:bg-emerald-700">
                Bắt đầu đi lấy rác (Đang trên đường)
              </Button>
            </div>
          )}

          {task.status.toLowerCase() === "ontheway" && (
            <div className="space-y-5 max-w-md bg-white p-5 rounded border border-emerald-100">
              <p className="text-sm text-gray-600">Vui lòng cung cấp thông tin thu gom để hoàn tất nhiệm vụ này.</p>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Khối lượng thu gom (kg) *</label>
                <Input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} required placeholder="VD: 15.5" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Hình ảnh xác nhận thu gom *</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="block w-full text-sm mt-1 file:py-2 file:px-4 file:border-0 file:rounded-md file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Ghi chú (Tùy chọn)</label>
                <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Nhập vấn đề phát sinh hoặc thông tin thêm..." />
              </div>
              <Button onClick={handleComplete} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50" disabled={!weightKg || !image}>
                Hoàn thành nhiệm vụ (Đã thu gom)
              </Button>
            </div>
          )}

          {task.status.toLowerCase() === "collected" && (
            <div>
              <p className="text-emerald-700 font-medium flex items-center bg-white p-3 rounded inline-flex border border-emerald-200">
                <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                Nhiệm vụ này đã được hoàn thành!
              </p>
              {task.collectedWeightKg && (
                <div className="mt-4 text-sm text-gray-600 bg-white p-4 rounded border border-gray-200">
                   <p><b>Khối lượng thu gom:</b> {task.collectedWeightKg} kg</p>
                   {task.notes && <p className="mt-1"><b>Ghi chú:</b> {task.notes}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Image Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Full size" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}