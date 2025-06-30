"use client";

import { classNames } from "@/components";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { AppContext } from "@/contexts";
import { AuthType } from "@/types/auth.type";
import Image from "next/image";

const LoginPage = () => {
  const { data: session } = useSession();
  const { setAuth } = useContext(AppContext) as AuthType;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      email: username,
      password: password,
    });
    console.log("🚀 ~ onSubmit ~ result:", result);
    if (result?.ok === false) {
      toast.error("Invalid username or password");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ session:", session);
    if (session) {
      setAuth(session.user);
      if (session.user.role === "NHÂN VIÊN") {
        router.replace("/employee/drinks");
        toast.success("Chào mừng trở lại, Nhân viên!");
      } else if (session.user.role === "QUẢN LÝ") {
        router.replace("/manager/drinks");
        toast.success("Chào mừng trở lại, Quản lý!");
      } else if (session.user.role === "QUẢN TRỊ VIÊN") {
        router.replace("/admin/drinks");
        toast.success("Chào mừng trở lại, Quản trị viên!");
      }
    }
  }, [session]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Water Surface Background */}
      <div className="absolute inset-0">
        {/* Crystal clear water gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50"></div>
        
        {/* Subtle water ripple texture */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 70% 60%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 50% 80%, rgba(14, 165, 233, 0.08) 0%, transparent 50%)`
          }}
        ></div>

        {/* Large Central Logo - Submerged Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Main logo with depth and water distortion */}
            <div className="relative z-10">
              <Image
                src="/images/logo_bcoffee.svg"
                alt="BCoffee Logo"
                width={400}
                height={400}
                className="opacity-20 filter blur-[1px] brightness-110 contrast-90"
                style={{
                  transform: 'perspective(1000px) rotateX(10deg) scale(1.1)',
                  filter: 'blur(0.8px) brightness(1.1) contrast(0.9) saturate(0.8)'
                }}
              />
            </div>
            
            {/* Water ripple effects around logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Inner ripple */}
              <div 
                className="absolute w-96 h-96 rounded-full border border-blue-200/40 animate-pulse"
                style={{ animationDuration: '3s' }}
              ></div>
              {/* Middle ripple */}
              <div 
                className="absolute w-[28rem] h-[28rem] rounded-full border border-blue-200/25 animate-pulse"
                style={{ animationDuration: '4s', animationDelay: '1s' }}
              ></div>
              {/* Outer ripple */}
              <div 
                className="absolute w-[32rem] h-[32rem] rounded-full border border-blue-200/15 animate-pulse"
                style={{ animationDuration: '5s', animationDelay: '2s' }}
              ></div>
            </div>

            {/* Water surface reflection */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 30%, transparent 70%)',
                filter: 'blur(2px)',
                transform: 'translate(-50%, -50%) perspective(500px) rotateX(-20deg) scale(1.2)'
              }}
            ></div>
          </div>
        </div>

        {/* Floating water particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: 20, top: 30, delay: 0.5, duration: 3.2 },
            { left: 75, top: 15, delay: 1.2, duration: 4.1 },
            { left: 45, top: 65, delay: 2.1, duration: 3.8 },
            { left: 85, top: 80, delay: 0.8, duration: 4.5 },
            { left: 25, top: 50, delay: 1.8, duration: 3.5 },
            { left: 65, top: 25, delay: 2.5, duration: 4.2 },
            { left: 15, top: 75, delay: 0.3, duration: 3.9 },
            { left: 55, top: 40, delay: 1.5, duration: 3.7 },
            { left: 35, top: 85, delay: 2.2, duration: 4.0 },
            { left: 80, top: 60, delay: 0.9, duration: 3.3 },
            { left: 10, top: 20, delay: 1.7, duration: 4.3 },
            { left: 90, top: 45, delay: 2.8, duration: 3.6 }
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-300/40 rounded-full animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>

        {/* Water surface shimmer */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, 
              transparent 30%, 
              rgba(255,255,255,0.5) 50%, 
              transparent 70%)`,
            animation: 'shimmer 4s ease-in-out infinite'
          }}
        ></div>
      </div>

      {/* Custom CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          50% { transform: translateX(100vw) translateY(100vh) rotate(45deg); }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Login Card */}
          <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mb-4 p-2 border border-white/50">
                <Image
                  src="/images/logo_bcoffee.svg"
                  alt="BCoffee Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Chào mừng trở lại
              </h1>
            </div>

            {/* Login Form */}
            <div className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 pl-11 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white/90 transition-all duration-300"
                    placeholder="Nhập tên đăng nhập"
                    required
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 pr-11 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-white/90 transition-all duration-300"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                disabled={isLoading}
                onClick={onSubmit}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600/80 text-sm">
              © 2024 BCoffee. Được thiết kế với ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;