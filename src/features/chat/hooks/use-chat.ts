import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ChatMessage {
  id: string;
  diagnosisSessionId: string;
  userId: string;
  messageType: "user" | "assistant" | "system";
  content: string;
  metadata?: any;
  createdAt: string;
}

export interface CreateMessageRequest {
  sessionId: string;
  content: string;
  messageType?: "user" | "assistant" | "system";
}

// Get chat messages for a session
export function useChatMessages(sessionId: string) {
  return useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: async (): Promise<ChatMessage[]> => {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat messages");
      }
      const data = await response.json();
      return data.messages || [];
    },
    enabled: !!sessionId,
  });
}

// Create a new chat message
export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMessageRequest): Promise<ChatMessage> => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create message");
      }

      const result = await response.json();
      return result.message;
    },
    onSuccess: (data) => {
      // Invalidate and refetch chat messages for this session
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", data.diagnosisSessionId],
      });
    },
  });
}
