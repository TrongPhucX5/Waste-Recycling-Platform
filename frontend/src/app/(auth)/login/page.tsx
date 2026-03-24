"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input, Button } from "@/components/ui";
import { useForm } from "@/hooks/useForm";
import { useAuth, ApiError } from "@/contexts/AuthContext";
import { Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, ArrowRight } from "lucide-react";

interface LoginValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useForm<LoginValues>({
      initialValues: { email: "", password: "" },
      onSubmit: async (values) => {
        setApiError(null);
        setSuccessMsg(null);
        try {
          await login(values.email, values.password);
          setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");
        } catch (err) {
          if (err instanceof ApiError) {
            if (err.status === 401 || err.status === 404) {
              setApiError("Email hoặc mật khẩu không đúng.");
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
        if (!values.email) {
          errors.email = "Email là bắt buộc";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
          errors.email = "Email không hợp lệ";
        }
        if (!values.password) {
          errors.password = "Mật khẩu là bắt buộc";
        }
        return errors;
      },
    });

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Đăng Nhập
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Quản lý báo cáo rác thải của bạn dễ dàng
        </p>
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
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email Input */}
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

        {/* Password Input */}
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
              autoComplete="current-password"
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

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0AA468] focus:ring-[#0AA468]" />
            <span className="text-sm text-gray-600">Nhớ mật khẩu</span>
          </label>
          <Link
            href="/reset-password"
            className="text-sm text-[#0AA468] hover:text-[#088F5A] font-semibold transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3.5 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all transform hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 text-base"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Đang xử lý...
            </>
          ) : (
            <>
              Đăng Nhập
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-gray-400 text-sm font-medium">Hoặc</span>
        </div>
      </div>

      {/* Social Login */}
      <button className="w-full py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 text-gray-700 font-medium mb-6">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Đăng nhập với Google
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-gray-600 text-sm">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-[#0AA468] hover:text-[#088F5A] font-bold transition-colors"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;