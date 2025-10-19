"use client";
import { useMemo } from "react";
import { HistoryEntry, PatternAnalysis } from "../types";
import { useDiagnosisSessions } from "@/features/diagnosis/hooks/use-diagnosis";
import { HistorySkeleton } from "@/shared/components/ui/skeletons";
import { LoadingSpinner } from "@/shared/components/ui/loading-spinner";
import { AlertCircle } from "lucide-react";
import HistoryStats from "./history-stats";
import PatternAnalysisCard from "./pattern-analysis";
import SymptomChart from "./symptom-chart";
import DiagnosisTimeline from "./diagnosis-timeline";

export default function HistoryOverview() {
  const { data: sessions, isLoading, error } = useDiagnosisSessions();

  const data = useMemo((): HistoryEntry[] => {
    if (!sessions) return [];

    return sessions.map((s) => ({
      id: s.id,
      date: s.completedAt ?? s.createdAt,
      diagnosis: s.predictedDiagnosis ?? "depression",
      confidence: Math.round(s.confidenceScore ?? 0),
      symptoms: {
        fatigue_severity_scale_score: s.fatigueSeverityScaleScore ?? 0,
        depression_phq9_score: s.depressionPhq9Score ?? 0,
        pem_present: Boolean(s.pemPresent),
        sleep_quality_index: s.sleepQualityIndex ?? 0,
        brain_fog_level: s.brainFogLevel ?? 0,
        physical_pain_score: s.physicalPainScore ?? 0,
        stress_level: s.stressLevel ?? 0,
      },
      notes: s.notes ?? undefined,
    }));
  }, [sessions]);

  const analysis = useMemo((): PatternAnalysis | null => {
    if (!data.length) return null;

    // Simple client-side pattern analysis
    const counts: Record<string, number> = {};
    let totalConfidence = 0;
    let fatigueTrend = 0;
    let depressionTrend = 0;
    let sleepTrend = 0;
    let painTrend = 0;

    data.forEach((m, idx) => {
      counts[m.diagnosis] = (counts[m.diagnosis] ?? 0) + 1;
      totalConfidence += m.confidence;
      if (idx > 0) {
        const prev = data[idx - 1];
        fatigueTrend +=
          m.symptoms.fatigue_severity_scale_score -
          prev.symptoms.fatigue_severity_scale_score;
        depressionTrend +=
          m.symptoms.depression_phq9_score -
          prev.symptoms.depression_phq9_score;
        sleepTrend +=
          m.symptoms.sleep_quality_index - prev.symptoms.sleep_quality_index;
        painTrend +=
          m.symptoms.physical_pain_score - prev.symptoms.physical_pain_score;
      }
    });

    const mostCommonDiagnosis =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "depression";
    const averageConfidence = data.length ? totalConfidence / data.length : 0;
    const trend =
      averageConfidence >= 75
        ? "improving"
        : averageConfidence >= 60
        ? "stable"
        : "declining";
    const symptomTrends = {
      fatigue:
        fatigueTrend < 0
          ? "decreasing"
          : fatigueTrend > 0
          ? "increasing"
          : "stable",
      depression:
        depressionTrend < 0
          ? "decreasing"
          : depressionTrend > 0
          ? "increasing"
          : "stable",
      sleep:
        sleepTrend > 0 ? "improving" : sleepTrend < 0 ? "worsening" : "stable",
      pain:
        painTrend > 0 ? "increasing" : painTrend < 0 ? "decreasing" : "stable",
    } as PatternAnalysis["symptomTrends"];

    return {
      trend,
      mostCommonDiagnosis,
      averageConfidence,
      symptomTrends,
      recommendations: [
        "Maintain consistent sleep and activity pacing",
        "Follow up with your clinician for tailored guidance",
        "Track symptoms regularly to observe trends",
      ],
    };
  }, [data]);

  if (isLoading) {
    return <HistorySkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Error loading history</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <h3 className="text-lg font-semibold mb-2">
              No diagnosis history yet
            </h3>
            <p className="text-sm">
              Complete your first diagnosis to see your history here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <HistoryStats data={data} />

      {/* Pattern Analysis */}
      {analysis && <PatternAnalysisCard analysis={analysis} />}

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
