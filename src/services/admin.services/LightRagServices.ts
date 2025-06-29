import axiosRag from "@/lib/axiosRag";
import { queryRagStreaming } from "@/types/light-rag.type";

class LightRagServices {
  async queryRagStreamming(
    query: string,
    conversation_history: queryRagStreaming["conversation_history"] = [],
    onChunkReceived: (chunk: string) => void
  ): Promise<void> {
    try {
      const payload: queryRagStreaming = {
        mode: process.env.NEXT_PUBLIC_RAG_MODE || "global",
        response_type: "Multiple Paragraphs",
        top_k: Number(process.env.NEXT_PUBLIC_LIGHT_RAG_TOP_K) || 10,
        max_token_for_text_unit: process.env
          .NEXT_PUBLIC_LIGHT_RAG_MAX_TOKEN_FOR_TEXT_UNIT
          ? Number(process.env.NEXT_PUBLIC_LIGHT_RAG_MAX_TOKEN_FOR_TEXT_UNIT)
          : 4000,
        max_token_for_global_context: process.env
          .NEXT_PUBLIC_LIGHT_RAG_MAX_TOKEN_FOR_GLOBAL_CONTEXT
          ? Number(
              process.env.NEXT_PUBLIC_LIGHT_RAG_MAX_TOKEN_FOR_GLOBAL_CONTEXT
            )
          : 4000,
        max_token_for_local_context: process.env
          .NEXT_PUBLIC_LIGHT_RAG_MAX_TOKEN_FOR_LOCAL_CONTEXT
          ? Number(
              process.env.NEXT_PUBLIC_LIGHT_RAG_MAX_TOKEN_FOR_LOCAL_CONTEXT
            )
          : 1000,
        only_need_context:
          process.env.NEXT_PUBLIC_LIGHT_RAG_ONLY_NEED_CONTEXT === "true" ||
          false,
        only_need_prompt:
          process.env.NEXT_PUBLIC_LIGHT_RAG_ONLY_NEED_PROMPT === "true" ||
          false,
        stream: process.env.NEXT_PUBLIC_LIGHT_RAG_STREAM === "true" || true,
        history_turns:
          Number(process.env.NEXT_PUBLIC_LIGHT_RAG_HISTORY_TURNS) || 3, // Default to 3 if not set
        hl_keywords: [],
        ll_keywords: [],
        user_prompt: process.env.NEXT_PUBLIC_LIGHT_RAG_USER_PROMPT || "",
        query,
        conversation_history,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LIGHT_RAG_URL}/query/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode và thêm vào buffer
        buffer += decoder.decode(value, { stream: true });
        // Xử lý tất cả các JSON object hoàn chỉnh trong buffer
        while (true) {
          // Tìm vị trí kết thúc JSON object đầu tiên
          const endIndex = buffer.indexOf("}");
          if (endIndex === -1) break; // Không tìm thấy object hoàn chỉnh
          
          try {
            // Cắt từ đầu buffer đến ký tự '}' + 1
            const jsonStr = buffer.substring(0, endIndex + 1);
            const parsed = JSON.parse(jsonStr);
            if (parsed.response) {
              onChunkReceived(parsed.response);
            }
            
            // Cắt bỏ phần đã xử lý khỏi buffer
            buffer = buffer.substring(endIndex + 1);
          } catch (error) {
            // Nếu parse lỗi, thoát vòng lặp và chờ thêm dữ liệu
            console.warn("JSON parse error, waiting for more data:", error);
            break;
          }
        }
      }
      
      // Xử lý phần còn lại sau khi stream kết thúc
      if (buffer.trim() !== "") {
        try {
          const parsed = JSON.parse(buffer);
          if (parsed.response) {
            onChunkReceived(parsed.response);
          }
        } catch (error) {
          console.error("Error parsing final chunk:", error, buffer);
        }
      }
    } catch (error) {
      console.error("Error in queryRagStreamming:", error);
      throw error;
    }
  }
}

export default new LightRagServices();