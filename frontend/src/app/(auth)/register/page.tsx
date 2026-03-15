"use client";

import React from "react";
import Link from "next/link";
import { Input, Button, Card, Select } from "@/components/ui";
import { useForm } from "@/hooks/useForm";
import { User, Mail, Lock, ChevronDown, Briefcase } from "lucide-react";

interface RegisterValues {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterPage = () => {
  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useForm<RegisterValues>({
      initialValues: {
        name: "",
        email: "",
        role: "citizen",
        password: "",
        confirmPassword: "",
      },
      onSubmit: async (values: RegisterValues) => {
        // Implement register logic
        console.log("Register submitted:", values);
        // Simulate API
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      validate: (values: RegisterValues) => {
        const errors: { [key: string]: string } = {};
        if (!values.name) {
          errors.name = "Full name is required";
        }
        if (!values.email) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
          errors.email = "Email is invalid";
        }
        if (!values.password) {
          errors.password = "Password is required";
        } else if (values.password.length < 8) {
          errors.password = "Password must be at least 8 characters";
        }
        if (values.confirmPassword !== values.password) {
          errors.confirmPassword = "Passwords do not match";
        }
        if (!values.role) {
          errors.role = "Role is required";
        }
        return errors;
      },
    });

  return (
    <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full relative z-20 overflow-hidden">
      <div className="text-center mb-6">
        <h2 className="text-sm text-[#0AA468] font-bold tracking-[0.2em] uppercase mb-2">
          WASTE PLATFORM
        </h2>
        <div className="w-8 h-1 bg-[#0AA468] mx-auto rounded-full"></div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="full-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Họ và tên"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          startIcon={<User size={18} className="text-gray-400" />}
          className="border-none rounded-none bg-[#EBF2FA] focus:ring-0 px-0 py-3 placeholder:text-gray-500 text-sm text-gray-700"
        />

        <Input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Địa chỉ Email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          startIcon={<Mail size={18} className="text-gray-400" />}
          className="border-none rounded-none bg-[#EBF2FA] focus:ring-0 px-0 py-3 placeholder:text-gray-500 text-sm text-gray-700"
        />

        {/* Custom styling for Select to match the theme */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none text-gray-400">
            <Briefcase size={18} />
          </div>
          <select
            id="role"
            name="role"
            required
            aria-label="Register as"
            value={values.role}
            onChange={handleChange}
            className={`
                w-full py-3 pl-10 border-none rounded-none bg-[#EBF2FA]
                focus:outline-none focus:ring-0
                transition-colors text-sm text-gray-700
                ${errors.role ? "border-red-500" : ""}
            `}
          >
            <option value="citizen">Người Dân (Cá Nhân)</option>
            <option value="collector">Người Thu Gom</option>
            <option value="enterprise">Doanh Nghiệp (Kinh Doanh)</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Mật khẩu"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          startIcon={<Lock size={18} className="text-gray-400" />}
          className="border-none rounded-none bg-[#EBF2FA] focus:ring-0 px-0 py-3 placeholder:text-gray-500 text-sm text-gray-700"
        />

        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Xác nhận mật khẩu"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          startIcon={<Lock size={18} className="text-gray-400" />}
          className="border-none rounded-none bg-[#EBF2FA] focus:ring-0 px-0 py-3 placeholder:text-gray-500 text-sm text-gray-700"
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full justify-center py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold tracking-[0.05em] rounded-sm shadow-md hover:shadow-lg transition-all transform uppercase text-xs"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Đăng Ký
          </Button>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-center relative">
        <span className="text-xs text-gray-400 font-medium z-10">Hoặc</span>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-2 text-[#0AA468]">
        <Link
          href="/login"
          className="text-xs font-bold uppercase tracking-widest hover:text-[#088F5A] transition-colors"
        >
            Đăng Nhập
        </Link>
         <Link href="/login" className="text-green-400 animate-bounce mt-1 hover:text-[#088F5A] transition-colors cursor-pointer">
          <ChevronDown size={24} />
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
