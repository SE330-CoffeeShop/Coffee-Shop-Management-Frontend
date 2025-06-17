"use client";

import axios, { AxiosInstance } from "axios";
import { getSession, signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

const getAuthToken = async () => {
  const session = await getSession();
  return session?.user?.accessToken || null;
};

// Interceptor request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    console.log("🚀 ~ token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.data?.statusCode === 401 && typeof window !== "undefined") {
      console.log("Token hết hạn, chuyển hướng đến đăng nhập");
      await signOut({ redirect: false }); // Clear session without immediate redirect
      window.location.href = "/auth/signIn"; // Redirect to login
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;