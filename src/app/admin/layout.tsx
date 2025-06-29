"use client";

import { ChatWidget, ContactWidget, Header } from "@/components";
import ASidebar from "@/components/Sidebar/Admin/ASidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Hàm xử lý gửi tin nhắn
  const handleSendMessage = (message: string) => {
    // TODO: Thêm logic gửi tin nhắn đến backend (API/WebSocket)
    console.log("Tin nhắn từ admin:", message);
  };

  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="flex w-full flex-grow">
        <ASidebar />
        <div className="flex-grow bg-highlight overflow-y-auto">
          <div className="min-h-full w-full">
            {children}
            <ChatWidget onSendMessage={handleSendMessage} />
            {/* <ContactWidget /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
