interface conversation_history_item {
  role: string;
  content: string;
}

export type queryRagStreaming = {
  mode: string;
  response_type: string;
  top_k: number;
  max_token_for_text_unit: number;
  max_token_for_global_context: number;
  max_token_for_local_context: number;
  only_need_context: boolean;
  only_need_prompt: boolean;
  stream: boolean;
  history_turns: number;
  hl_keywords: [];
  ll_keywords: [];
  user_prompt: string;
  query: string;
  conversation_history: conversation_history_item[];
}