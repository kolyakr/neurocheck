"use client";
import { HistoryEntry, PatternAnalysis } from "../types";
import { mockHistoryData, mockPatternAnalysis } from "../services/mock-data";
import HistoryStats from "./history-stats";
import PatternAnalysisCard from "./pattern-analysis";
import SymptomChart from "./symptom-chart";
import DiagnosisTimeline from "./diagnosis-timeline";

export default function HistoryOverview() {
  const data = mockHistoryData;
  const analysis = mockPatternAnalysis;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <HistoryStats data={data} />

      {/* Pattern Analysis */}
      <PatternAnalysisCard analysis={analysis} />

      {/* Symptom Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <SymptomChart
          data={data}
          symptom="fatigue_severity_scale_score"
          title="Fatigue Severity"
          color="#3b82f6"
          yAxisDomain={[0, 10]}
        />
        <SymptomChart
          data={data}
          symptom="depression_phq9_score"
          title="Depression Score (PHQ-9)"
          color="#8b5cf6"
          yAxisDomain={[0, 27]}
        />
        <SymptomChart
          data={data}
          symptom="sleep_quality_index"
          title="Sleep Quality"
          color="#10b981"
          yAxisDomain={[1, 10]}
        />
        <SymptomChart
          data={data}
          symptom="physical_pain_score"
          title="Physical Pain"
          color="#f59e0b"
          yAxisDomain={[1, 10]}
        />
      </div>

      {/* Diagnosis Timeline */}
      <DiagnosisTimeline data={data} />
    </div>
  );
}
