"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, Copy } from "lucide-react";

type ResetStep = "email" | "otp" | "password" | "success";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // STEP 1: Email submission
  const handleEmailSubmit = async () => {
    setError("");
    if (!email) return setError("Vui lòng nhập email");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Email không hợp lệ");

    setLoading(true);
    try {
      // Gọi API: POST /auth/forgot-password
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   body: JSON.stringify({ email })
      // });
      // if (!response.ok) throw new Error('Failed');

      setStep("otp");
      setTimer(30);

      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) clearInterval(interval);
          return Math.max(0, t - 1);
        });
      }, 1000);
    } catch (err) {
      setError("Không thể gửi OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: OTP verification
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    setError("");
    const otpValue = otp.join("");
    if (otpValue.length !== 6)
      return setError("Vui lòng nhập đủ 6 chữ số");

    setLoading(true);
    try {
      // Gọi API: POST /auth/verify-otp
      // const response = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, otp: otpValue })
      // });
      // if (!response.ok) throw new Error('Invalid OTP');

      setStep("password");
    } catch (err) {
      setError("OTP không hợp lệ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: New password
  const handlePasswordSubmit = async () => {
    setError("");

    if (!password) return setError("Vui lòng nhập mật khẩu mới");
    if (password.length < 8)
      return setError("Mật khẩu phải ≥ 8 ký tự");
    if (password !== confirmPassword)
      return setError("Mật khẩu xác nhận không khớp");

    setLoading(true);
    try {
      // Gọi API: POST /auth/reset-password
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, newPassword: password })
      // });
      // if (!response.ok) throw new Error('Failed');

      setStep("success");
    } catch (err) {
      setError("Không thể cập nhật mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back button */}
        {step !== "success" && (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Quay lại đăng nhập
          </Link>
        )}

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          {/* STEP 1: Email */}
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quên Mật Khẩu?
                </h2>
                <p className="text-gray-600">
                  Nhập email của bạn để nhận mã OTP xác nhận
                </p>
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="flex gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <AlertCircle
                      size={18}
                      className="text-red-600 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-red-600">{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleEmailSubmit()
                      }
                      placeholder="example@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all"
                >
                  {loading ? "Đang gửi..." : "Gửi OTP"}
                </button>
              </div>
            </>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📮</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nhập Mã OTP
                </h2>
                <p className="text-gray-600">
                  Mã OTP đã được gửi đến
                  <br />
                  <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="flex gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <AlertCircle
                      size={18}
                      className="text-red-600 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-red-600">{error}</span>
                  </div>
                )}

                {/* OTP Inputs */}
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && idx > 0) {
                          document
                            .getElementById(`otp-${idx - 1}`)
                            ?.focus();
                        }
                      }}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:outline-none focus:border-[#0AA468] transition-all"
                    />
                  ))}
                </div>

                {/* Resend button */}
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-gray-600 text-sm">
                      Gửi lại OTP sau <span className="font-semibold">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={() => {
                        setOtp(["", "", "", "", "", ""]);
                        handleEmailSubmit();
                      }}
                      className="text-[#0AA468] hover:underline text-sm font-medium"
                    >
                      Gửi lại OTP
                    </button>
                  )}
                </div>

                <button
                  onClick={handleOtpSubmit}
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full py-2.5 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all"
                >
                  {loading ? "Đang xác nhận..." : "Xác Nhận OTP"}
                </button>
              </div>
            </>
          )}

          {/* STEP 3: New Password */}
          {step === "password" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tạo Mật Khẩu Mới
                </h2>
                <p className="text-gray-600">Vui lòng tạo một mật khẩu mạnh</p>
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="flex gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <AlertCircle
                      size={18}
                      className="text-red-600 mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-red-600">{error}</span>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật Khẩu Mới
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  <div className="mt-2 h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        password.length >= 12
                          ? "bg-green-500"
                          : password.length >= 8
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((password.length / 12) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {password.length < 8
                      ? `Tối thiểu 8 ký tự (${password.length}/8)`
                      : password.length < 12
                      ? "Mật khẩu bình thường"
                      : "Mật khẩu mạnh ✓"}
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác Nhận Mật Khẩu
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AA468]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p
                      className={`text-xs mt-1 ${
                        password === confirmPassword
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {password === confirmPassword ? "✓ Khớp" : "✗ Không khớp"}
                    </p>
                  )}
                </div>

                <button
                  onClick={handlePasswordSubmit}
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0AA468] hover:bg-[#088F5A] disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all"
                >
                  {loading ? "Đang cập nhật..." : "Cập Nhật Mật Khẩu"}
                </button>
              </div>
            </>
          )}

          {/* STEP 4: Success */}
          {step === "success" && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Cập Nhật Thành Công!
                </h2>
                <p className="text-gray-600 mb-8">
                  Mật khẩu của bạn đã được thay đổi
                </p>

                <Link
                  href="/login"
                  className="w-full block py-2.5 bg-[#0AA468] hover:bg-[#088F5A] text-white rounded-lg font-semibold transition-all"
                >
                  Quay Lại Đăng Nhập
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Cần giúp đỡ?{" "}
          <Link
            href="#"
            className="text-[#0AA468] hover:underline font-medium"
          >
            Liên hệ support
          </Link>
        </p>
      </div>
    </div>
  );
}