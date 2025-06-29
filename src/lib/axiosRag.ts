"use client"

import axios from "axios"

const axiosRag = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RAG_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default axiosRag;