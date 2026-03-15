import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Upload, Camera, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Badge';

type WasteType = 'Organic' | 'Recyclable' | 'Hazardous' | 'Unknown';

export const AIClassificationTool: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<WasteType | null>(null);
    const [confidence, setConfidence] = useState<number>(0);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setResult(null); // Reset result
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateAnalysis = () => {
        if (!selectedImage) return;
        setIsAnalyzing(true);
        // Simulate API delay
        setTimeout(() => {
            const types: WasteType[] = ['Organic', 'Recyclable', 'Hazardous'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            setResult(randomType);
            setConfidence(Math.floor(Math.random() * 20) + 80); // 80-99%
            setIsAnalyzing(false);
        }, 1500);
    };

    const getWasteColor = (type: WasteType) => {
        switch (type) {
            case 'Organic': return 'green';
            case 'Recyclable': return 'blue';
            case 'Hazardous': return 'red';
            default: return 'gray';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">AI Hỗ trợ phân loại rác (Demo)</h2>
            <div className="text-gray-500 mb-4">
                Công cụ này mô phỏng module AI nhận diện loại rác từ hình ảnh. 
                Trong thực tế, admin sử dụng tool này để kiểm tra độ chính xác của model hoặc xử lý các trường hợp khó.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <Card className="p-6">
                    <h3 className="font-semibold mb-4 text-center">Input: Ảnh rác thải</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Uploaded" className="object-contain h-full w-full" />
                        ) : (
                            <div className="text-center p-4">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                <p className="text-sm text-gray-500">Kéo thả hoặc chọn ảnh để phân tích</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleImageUpload}
                        />
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                        <Button 
                            onClick={simulateAnalysis} 
                            disabled={!selectedImage || isAnalyzing}
                            className="w-full md:w-auto"
                        >
                            {isAnalyzing ? (
                                <span className="flex items-center"><RotateCcw className="animate-spin mr-2"/> Đang phân tích...</span>
                            ) : (
                                <span className="flex items-center"><Camera className="mr-2"/> Phân tích ảnh</span>
                            )}
                        </Button>
                    </div>
                </Card>

                {/* Output Section */}
                <Card className="p-6 flex flex-col justify-center items-center">
                    <h3 className="font-semibold mb-6">Output: Kết quả gợi ý</h3>
                    
                    {result ? (
                        <div className="text-center animate-fade-in w-full">
                            <div className={`inline-flex items-center justify-center p-6 rounded-full bg-${getWasteColor(result)}-100 mb-4`}>
                                <div className={`text-4xl text-${getWasteColor(result)}-600 font-bold`}>
                                    {result === 'Organic' ? '🍃' : result === 'Recyclable' ? '♻️' : '⚠️'}
                                </div>
                            </div>
                            
                            <h4 className="text-3xl font-bold text-gray-800 mb-2">{result}</h4>
                            <p className="text-gray-500 mb-4">Độ tin cậy: <span className="font-bold text-gray-800">{confidence}%</span></p>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left text-sm text-blue-800 mb-6">
                                <p className="flex items-start gap-2">
                                    <AlertTriangle size={16} className="mt-1 flex-shrink-0" />
                                    <span>Hệ thống gợi ý đây là rác <strong>{result}</strong> dựa trên hình ảnh. Vui lòng xác nhận trước khi lưu vào cơ sở dữ liệu huấn luyện.</span>
                                </p>
                            </div>

                            <div className="flex gap-3 justify-center w-full">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 flex-1 text-white">
                                    <Check className="mr-2 h-4 w-4" /> Xác nhận đúng
                                </Button>
                                <Button variant="secondary" className="flex-1 text-red-600 hover:bg-red-50 hover:border-red-200 border border-red-200">
                                    Báo cáo sai
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <div className="mb-4 text-6xl opacity-20">🤖</div>
                            <p>Chưa có kết quả phân tích</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
