"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, CheckCircle } from "lucide-react";

interface RewardRule {
  id: string;
  wasteType: string;
  pointsPerKg: number;
  pricePerKg: number;
}

interface Props {
  rules: RewardRule[];
  onUpdate: (rules: RewardRule[]) => void;
}

export const RewardConfiguration: React.FC<Props> = ({ rules, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    wasteType: "",
    pointsPerKg: "",
    pricePerKg: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddNew = () => {
    setEditingId("new");
    setFormData({
      wasteType: "",
      pointsPerKg: "",
      pricePerKg: "",
    });
  };

  const handleEdit = (rule: RewardRule) => {
    setEditingId(rule.id);
    setFormData({
      wasteType: rule.wasteType,
      pointsPerKg: rule.pointsPerKg.toString(),
      pricePerKg: rule.pricePerKg.toString(),
    });
  };

  const handleSave = () => {
    if (!formData.wasteType || !formData.pointsPerKg || !formData.pricePerKg) {
      alert("Vui lòng điền tất cả các trường");
      return;
    }

    if (editingId === "new") {
      const newRule: RewardRule = {
        id: Date.now().toString(),
        wasteType: formData.wasteType,
        pointsPerKg: Number(formData.pointsPerKg),
        pricePerKg: Number(formData.pricePerKg),
      };
      onUpdate([...rules, newRule]);
    } else {
      onUpdate(
        rules.map((r) =>
          r.id === editingId
            ? {
                ...r,
                wasteType: formData.wasteType,
                pointsPerKg: Number(formData.pointsPerKg),
                pricePerKg: Number(formData.pricePerKg),
              }
            : r
        )
      );
    }

    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa quy tắc này?")) {
      onUpdate(rules.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cấu Hình Phần Thưởng</h1>
          <p className="text-gray-600 mt-2">
            Quản lý điểm và giá tiền cho từng loại rác
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="py-2.5 px-4 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm Quy Tắc
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Loại Rác
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Điểm / kg
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Giá / kg (VND)
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {rule.wasteType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {rule.pointsPerKg}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {rule.pricePerKg.toLocaleString()} ₫
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Form */}
      {editingId && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId === "new" ? "Thêm Quy Tắc Mới" : "Chỉnh Sửa Quy Tắc"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Loại Rác
              </label>
              <input
                type="text"
                value={formData.wasteType}
                onChange={(e) =>
                  setFormData({ ...formData, wasteType: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                placeholder="Ví dụ: Plastic"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Điểm / kg
              </label>
              <input
                type="number"
                value={formData.pointsPerKg}
                onChange={(e) =>
                  setFormData({ ...formData, pointsPerKg: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                placeholder="Ví dụ: 10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Giá / kg (VND)
              </label>
              <input
                type="number"
                value={formData.pricePerKg}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerKg: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                placeholder="Ví dụ: 5000"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setEditingId(null)}
              className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Lưu
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-900">Lưu Thành Công</p>
            <p className="text-sm text-green-800 mt-1">
              Quy tắc phần thưởng đã được cập nhật.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};