"use client";

import React from "react";
import Link from "next/link";
import { Input, Button } from "@/components/ui";
import { useForm } from "@/hooks/useForm";
import { User, Lock, ChevronDown } from "lucide-react";

interface LoginValues {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useForm<LoginValues>({
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit: async (values: LoginValues) => {
        // Implement login logic here
        console.log("Login submitted:", values);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      validate: (values: LoginValues) => {
        const errors: { [key: string]: string } = {};
        if (!values.email) {
          errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
          errors.email = "Email is invalid";
        }
        if (!values.password) {
          errors.password = "Password is required";
        }
        return errors;
      },
    });

  return (
    <div className="bg-white p-10 rounded-xl shadow-2xl w-full relative z-20 overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-sm text-[#0AA468] font-bold tracking-[0.2em] uppercase mb-4">
          WASTE PLATFORM
        </h2>
        <div className="w-10 h-1 bg-[#0AA468] mx-auto rounded-full opacity-60"></div>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          handleSubmit(e as React.FormEvent<HTMLFormElement>);
        }}
      >
        <Input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          startIcon={<User size={18} className="text-gray-400" />}
          className="border-none rounded-none bg-[#EBF2FA] focus:ring-0 px-0 py-3 placeholder:text-gray-500 text-sm text-gray-700"
        />

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          startIcon={<Lock size={18} className="text-gray-400" />}
          className="border-none rounded-none bg-[#EBF2FA] focus:ring-0 px-0 py-3 placeholder:text-gray-500 text-sm text-gray-700"
        />

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full justify-center py-3 bg-[#0AA468] hover:bg-[#088F5A] text-white font-bold tracking-[0.05em] rounded-sm shadow-md hover:shadow-lg transition-all transform uppercase text-xs"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Đăng Nhập
          </Button>
        </div>
      </form>

      <div className="mt-8 flex items-center justify-center relative">
         <span className="text-xs text-gray-400 font-medium z-10">Hoặc</span>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-2 text-[#0AA468]">
        <Link 
          href="/register" 
          className="text-xs font-bold uppercase tracking-widest hover:text-[#088F5A] transition-colors"
        >
          Đăng Ký
        </Link>
        <Link href="/register" className="animate-bounce hover:opacity-80 transition-opacity">
          <ChevronDown size={24} className="stroke-[3]" />
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
