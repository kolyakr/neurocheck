import { HistoryEntry, PatternAnalysis } from "../types";

// Generate mock data for the last 3 months
const generateMockData = (): HistoryEntry[] => {
  const entries: HistoryEntry[] = [];
  const today = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 7); // Every week

    const diagnoses: ("depression" | "mecfs" | "both")[] = [
      "depression",
      "mecfs",
      "both",
    ];
    const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];

    // Generate realistic symptom scores with some variation
    const baseFatigue = 6 + Math.random() * 3;
    const baseDepression = 8 + Math.random() * 4;
    const baseSleep = 4 + Math.random() * 3;
    const baseBrainFog = 5 + Math.random() * 3;
    const basePain = 4 + Math.random() * 4;
    const baseStress = 5 + Math.random() * 3;

    entries.push({
      id: `entry-${i}`,
      date: date.toISOString().split("T")[0],
      diagnosis,
      confidence: 70 + Math.random() * 25,
      symptoms: {
        fatigue_severity_scale_score: Math.round(baseFatigue * 10) / 10,
        depression_phq9_score: Math.round(baseDepression),
        pem_present: Math.random() > 0.5,
        sleep_quality_index: Math.round(baseSleep),
        brain_fog_level: Math.round(baseBrainFog),
        physical_pain_score: Math.round(basePain),
        stress_level: Math.round(baseStress),
      },
      notes:
        i % 3 === 0
          ? `Entry notes for ${date.toLocaleDateString()}`
          : undefined,
    });
  }

  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const mockHistoryData = generateMockData();

export const mockPatternAnalysis: PatternAnalysis = {
  trend: "stable",
  mostCommonDiagnosis: "depression",
  averageConfidence: 82.5,
  symptomTrends: {
    fatigue: "stable",
    depression: "decreasing",
    sleep: "improving",
    pain: "stable",
  },
  recommendations: [
    "Continue current treatment plan - symptoms are stabilizing",
    "Focus on sleep hygiene improvements as sleep quality is trending upward",
    "Monitor depression scores - showing positive trend",
    "Consider stress management techniques for better overall well-being",
  ],
};
