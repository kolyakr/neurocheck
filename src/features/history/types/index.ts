export interface HistoryEntry {
  id: string;
  date: string;
  diagnosis: "depression" | "mecfs" | "both";
  confidence: number;
  symptoms: {
    fatigue_severity_scale_score: number;
    depression_phq9_score: number;
    pem_present: boolean;
    sleep_quality_index: number;
    brain_fog_level: number;
    physical_pain_score: number;
    stress_level: number;
  };
  notes?: string;
}

export interface PatternAnalysis {
  trend: "improving" | "stable" | "declining";
  mostCommonDiagnosis: string;
  averageConfidence: number;
  symptomTrends: {
    fatigue: "increasing" | "stable" | "decreasing";
    depression: "increasing" | "stable" | "decreasing";
    sleep: "improving" | "stable" | "worsening";
    pain: "increasing" | "stable" | "decreasing";
  };
  recommendations: string[];
}
