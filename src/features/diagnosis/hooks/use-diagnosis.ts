import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface DiagnosisSession {
  id: string;
  createdAt: string;
  completedAt?: string;
  predictedDiagnosis?: "depression" | "mecfs" | "both";
  confidenceScore?: number;
  fatigueSeverityScaleScore?: number;
  depressionPhq9Score?: number;
  pemPresent?: boolean;
  sleepQualityIndex?: number;
  brainFogLevel?: number;
  physicalPainScore?: number;
  stressLevel?: number;
  notes?: string;
  status: string;
}

export interface CreateDiagnosisRequest {
  age?: number;
  gender?: string;
  fatigue_severity_scale_score?: number;
  depression_phq9_score?: number;
  pem_present?: string;
  pem_duration_hours?: number;
  sleep_quality_index?: number;
  brain_fog_level?: number;
  physical_pain_score?: number;
  stress_level?: number;
  work_status?: string;
  social_activity_level?: string;
  exercise_frequency?: string;
  meditation_or_mindfulness?: string;
  hours_of_sleep_per_night?: number;
  notes?: string;
}

export interface CreateDiagnosisResponse {
  sessionId: string;
  predictedDiagnosis: "depression" | "mecfs" | "both";
  confidenceScore: number;
}

// Get all diagnosis sessions for the current user
export function useDiagnosisSessions() {
  return useQuery({
    queryKey: ["diagnosis-sessions"],
    queryFn: async (): Promise<DiagnosisSession[]> => {
      const response = await fetch("/api/diagnosis");
      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis sessions");
      }
      const data = await response.json();
      return data.sessions || [];
    },
  });
}

// Get a single diagnosis session
export function useDiagnosisSession(id: string) {
  return useQuery({
    queryKey: ["diagnosis-session", id],
    queryFn: async (): Promise<DiagnosisSession> => {
      const response = await fetch(`/api/diagnosis/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis session");
      }
      const data = await response.json();
      return data.session;
    },
    enabled: !!id,
  });
}

// Create a new diagnosis session
export function useCreateDiagnosis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateDiagnosisRequest
    ): Promise<CreateDiagnosisResponse> => {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to create diagnosis session"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch diagnosis sessions
      queryClient.invalidateQueries({ queryKey: ["diagnosis-sessions"] });
    },
  });
}
