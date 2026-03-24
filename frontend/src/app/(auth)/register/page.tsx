"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input, Button } from "@/components/ui";
import { useForm } from "@/hooks/useForm";
import { useAuth, ApiError } from "@/contexts/AuthContext";
import { type UserRole } from "@/lib/api/auth";
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

interface RegisterValues {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const { register } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useForm<RegisterValues>({
      initialValues: {
        name: "",
        email: "",
        role: "citizen",
        password: "",
        confirmPassword: "",
      },
      onSubmit: async (values) => {
        setApiError(null);
        setSuccessMsg(null);
        try {
          await register(
            values.name,
            values.email,
            values.password,
            values.role
          );
          setSuccessMsg("Đăng ký thành công! Đang chuyển hướng...");
        } catch (err) {
          if (err instanceof ApiError) {
            if (err.status === 409) {
              setApiError("Email này đã được đăng ký. Vui lòng dùng email khác.");
            } else if (err.status === 400) {
              setApiError("Thông tin không hợp lệ. Vui lòng kiểm tra lại.");
            } else if (err.status === 0) {
              setApiError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
            } else {
              setApiError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
          } else {
            setApiError("Đã có lỗi xảy ra. Vui lòng thử lại.");
          }
        }
      },
      validate: (values) => {
        const errors: Record<string, string> = {};
        if (!values.name) {
          errors.name = "Họ và tên là bắt buộc";
        }
        if (!values.email) {
          errors.email = "Email là bắt buộc";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
          errors.email = "Email không hợp lệ";
        }
        if (!values.password) {
          errors.password = "Mật khẩu là bắt buộc";
        } else if (values.password.length < 8) {
          errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        }
        if (values.confirmPassword !== values.password) {
          errors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }
        if (!values.role) {
          errors.role = "Vai trò là bắt buộc";
        }
        return errors;
      },
    });

  const roleOptions = [
    {
      value: "citizen" as UserRole,
      label: "Người Dân",
      icon: "👤",
      desc: "Báo cáo & nhận điểm",
    },
    {
      value: "enterprise" as UserRole,
      label: "Doanh Nghiệp",
      icon: "🏢",
      desc: "Quản lý & tái chế",
    },
  ];

  const handleNextStep = () => {
    let canProceed = false;

    if (currentStep === 1) {
      canProceed = !!values.role;
    } else if (currentStep === 2) {
      canProceed = !errors.name && !errors.email && !!values.name && !!values.email;
    } else if (currentStep === 3) {
      canProceed = !errors.password && !errors.confirmPassword && !!values.password && !!values.confirmPassword;
    }

    if (canProceed && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Đăng Ký Tài Khoản
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Bước {currentStep} / 3
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0AA468] transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      {/* Error Banner */}
      {apiError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 animate-in fade-in">
          <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
          <span className="text-sm text-red-600">{apiError}</span>
        </div>
      )}

      {/* Success Banner */}
      {successMsg && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3 animate-in fade-in">
          <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
          <span className="text-sm text-green-600">{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form className="space-y-6">
        {/* STEP 1: Role Selection */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <label className="block text-sm font-semibold text-gray-900 text-center">
              Bạn tham gia với vai trò gì?
            </label>
            <div className="grid grid-cols-2 gap-4">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleChange({
                      target: { name: "role", value: option.value },
                    } as any);
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all text-center hover:scale-105 transform ${
                    values.role === option.value
                      ? "border-[#0AA468] bg-green-50 shadow-md"
                      : "border-gray-100 hover:border-[#0AA468] hover:bg-gray-50"
                  }`}
                >
                  <p className="text-4xl mb-3">{option.icon}</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {option.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Personal Info */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Họ và Tên
              </label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Nguyễn Văn A"
                  value={values.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0AA468] transition-all text-base ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="your@email.com"
                  value={values.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0AA468] transition-all text-base ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Password */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0AA468] transition-all text-base ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Xác Nhận Mật Khẩu
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0AA468] transition-all text-base ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 mt-6 pt-4 border-t border-gray-100">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0AA468] focus:ring-[#0AA468] cursor-pointer"
                required
              />
              <span className="text-sm text-gray-500 leading-relaxed">
                Tôi đồng ý với{" "}
                <Link
                  href="#"
                  className="text-[#0AA468] hover:underline font-semibold"
                >
                  Điều khoản
                </Link>{" "}
                và{" "}
                <Link
                  href="#"
                  className="text-[#0AA468] hover:underline font-semibold"
                >
                  Chính sách
                </Link>
              </span>
            </label>
          </div>
        )}
      </form>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-base"
          >
            ← Quay Lại
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (currentStep < 3) {
              handleNextStep();
            } else {
              handleSubmit({ preventDefault: () => {} } as any);
            }
          }}
          disabled={isSubmitting}
          className="flex-1 py-3.5 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all transform hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 text-base"
        >
          {currentStep < 3 ? (
            <>
              Tiếp Tục
              <ArrowRight size={20} />
            </>
          ) : isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Đang xử lý...
            </>
          ) : (
            "Hoàn Thành"
          )}
        </button>
      </div>

      {/* Login Link */}
      <p className="text-center text-gray-500 text-sm mt-6">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="text-[#0AA468] hover:text-[#088F5A] font-bold transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;