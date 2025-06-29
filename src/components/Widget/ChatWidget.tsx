"use client";

import ButtonBase from "@/components/Button/ButtonBase";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@heroui/react";
import ButtonSolid from "@/components/Button/ButtonSolid";
import LightRagServices from "@/services/admin.services/LightRagServices";
import { MessageList, Message } from "@chatscope/chat-ui-kit-react";
import { marked } from "marked";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

interface ChatMessage {
  text: string;
  isUser: boolean;
  id: string;
}

interface ChatWidgetProps {
  onSendMessage?: (message: string) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Lưu Markdown thô
  const [messagesRender, setMessagesRender] = useState<ChatMessage[]>([]); // Lưu HTML để render
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null); // Theo dõi tin nhắn đang streaming
  const chatEndRef = useRef<HTMLDivElement>(null);
  const markdownBuffer = useRef<string[]>([]); // Buffer để tích lũy các chunk Markdown

  // Cấu hình marked để xử lý Markdown
  marked.setOptions({
    breaks: false, // Tắt breaks để tránh thêm <br> cho mỗi \n
    gfm: true, // Hỗ trợ GitHub Flavored Markdown
  });

  // Cuộn xuống dưới khi có tin nhắn mới
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesRender]);

  const generateMessageId = () => `msg-${Date.now()}-${Math.random()}`;

  // Hàm loại bỏ ký tự Markdown để hiển thị văn bản thô trong quá trình streaming
  const stripMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Loại bỏ **text** -> text
      .replace(/^\*\s*(.*)/gm, "$1") // Loại bỏ * list item -> list item
      .replace(/^#+\s*(.*)/gm, "$1") // Loại bỏ # Heading -> Heading
      .replace(/`([^`]+)`/g, "$1") // Loại bỏ `code` -> code
      .replace(/[\r\n]+/g, "\n") // Chuẩn hóa ngắt dòng
      .trim();
  };

  // Hàm vệ sinh chuỗi Markdown để đảm bảo định dạng chuẩn
  const cleanMarkdown = (text: string) => {
    return text
      .replace(/^\*\s{2,}(.*)/gm, "* $1") // Sửa *   item -> * item
      .replace(/[\r\n]+/g, "\n") // Chuẩn hóa ngắt dòng
      .trim();
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessageId = generateMessageId();
      const assistantMessageId = generateMessageId();

      const newUserMessage: ChatMessage = {
        text: inputValue,
        isUser: true,
        id: userMessageId,
      };
      const newAssistantMessage: ChatMessage = {
        text: "",
        isUser: false,
        id: assistantMessageId,
      };

      // Thêm tin nhắn người dùng và tin nhắn trợ lý rỗng
      setMessages((prev) => [...prev, newUserMessage, newAssistantMessage]);
      setMessagesRender((prev) => [...prev, newUserMessage, newAssistantMessage]);
      setStreamingMessageId(assistantMessageId); // Đánh dấu tin nhắn đang streaming

      const currentInput = inputValue;
      setInputValue("");
      setIsLoading(true);
      markdownBuffer.current = []; // Reset buffer cho tin nhắn mới

      if (onSendMessage) {
        onSendMessage(currentInput);
      }

      // Chuẩn bị lịch sử hội thoại từ messages (Markdown thô)
      const conversation_history = messages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }));

      try {
        let accumulatedText = "";
        await LightRagServices.queryRagStreamming(
          currentInput,
          conversation_history,
          (chunk: string) => {
            // Tích lũy các chunk vào buffer
            markdownBuffer.current.push(chunk);
            accumulatedText = markdownBuffer.current.join("");
            // Cập nhật messages với Markdown thô và messagesRender với văn bản thô
            const strippedText = stripMarkdown(accumulatedText);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, text: accumulatedText }
                  : msg
              )
            );
            setMessagesRender((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, text: strippedText }
                  : msg
              )
            );
          }
        );
      } catch (error) {
        const errorMessage = "Đã xảy ra lỗi khi gửi tin nhắn.";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, text: errorMessage }
              : msg
          )
        );
        setMessagesRender((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, text: errorMessage }
              : msg
          )
        );
        console.error("Error sending message:", error);
      } finally {
        // Khi streaming hoàn tất, lưu Markdown thô vào messages và HTML vào messagesRender
        const finalText = cleanMarkdown(markdownBuffer.current.join(""));
        const finalHtml = marked(finalText, { async: false });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, text: finalText }
              : msg
          )
        );
        setMessagesRender((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, text: finalHtml }
              : msg
          )
        );
        markdownBuffer.current = []; // Xóa buffer
        setStreamingMessageId(null); // Xóa trạng thái streaming
        setIsLoading(false);
      }
    }
  };

  // Xử lý nhấn Enter để gửi tin nhắn
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-6 right-6 bg-secondary-200 text-white p-4 rounded-full cursor-pointer hover:bg-primary-400 transition-colors duration-200 shadow-lg z-50"
        onClick={() => setIsMinimized(false)}
      >
        <Image
          src="/images/logo_bcoffee.svg"
          alt="Chat Icon"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[500px] h-[520px] bg-white shadow-2xl rounded-xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary-500 text-white text-base-regular rounded-t-xl">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_bcoffee.svg"
            alt="BCOFFEE Logo"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="pl-3 text-base-semibold">Trợ lý ảo BCOFFEE</span>
        </div>
        <ButtonBase
          iconLeft={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          }
          onClick={() => setIsMinimized(true)}
          className="text-white hover:text-gray-200 transition-colors duration-150"
        />
      </div>

      {/* Tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <MessageList>
          {/* Hiển thị tin nhắn chào mừng nếu messagesRender rỗng */}
          {messagesRender.length === 0 && (
            <Message
              key="welcome"
              model={{
                message: "BCOFFEE trợ lý ảo đã sẵn sàng",
                sentTime: "just now",
                sender: "Assistant",
                direction: "incoming",
                position: "single",
              }}
            >
              <div className="prose prose-sm max-w-none">
                <span>BCOFFEE trợ lý ảo đã sẵn sàng</span>
              </div>
            </Message>
          )}
          {messagesRender.map((msg) => (
            <Message
              key={msg.id}
              model={{
                message: msg.text,
                sentTime: "just now",
                sender: msg.isUser ? "User" : "Assistant",
                direction: msg.isUser ? "outgoing" : "incoming",
                position: "single",
              }}
            >
              <div className="prose prose-sm max-w-none">
                {msg.isUser || msg.id === streamingMessageId ? (
                  <span>{msg.text}</span>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                )}
                {!msg.isUser &&
                  isLoading &&
                  msg.id === streamingMessageId && (
                    <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></span>
                  )}
              </div>
            </Message>
          ))}
        </MessageList>

        {/* Hiệu ứng loading */}
        {isLoading && !messagesRender[messagesRender.length - 1]?.text && (
          <div className="flex space-x-2 justify-center my-3">
            <div className="h-3 w-3 bg-primary-500 rounded-full animate-pulse"></div>
            <div className="h-3 w-3 bg-primary-500 rounded-full animate-pulse delay-100"></div>
            <div className="h-3 w-3 bg-primary-500 rounded-full animate-pulse delay-200"></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Khu vực nhập liệu */}
      <div className="flex p-3 border-t border-gray-200 bg-white rounded-b-xl gap-3">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="flex-1 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base-regular"
          disabled={isLoading}
        />
        <ButtonSolid
          iconLeft={
            <img src="/images/SendOutlined.svg" alt="Gửi" className="w-5 h-5" />
          }
          onClick={handleSendMessage}
          className="p-3 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors duration-150 disabled:opacity-50"
          isDisabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatWidget;