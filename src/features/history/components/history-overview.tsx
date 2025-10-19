"use client";
import { useEffect, useMemo, useState } from "react";
import { HistoryEntry, PatternAnalysis } from "../types";
// import { mockHistoryData, mockPatternAnalysis } from "../services/mock-data";
import HistoryStats from "./history-stats";
import PatternAnalysisCard from "./pattern-analysis";
import SymptomChart from "./symptom-chart";
import DiagnosisTimeline from "./diagnosis-timeline";

export default function HistoryOverview() {
  const [data, setData] = useState<HistoryEntry[]>([]);
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/diagnosis")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error ?? "Failed to fetch history");
        const sessions = (j.sessions ?? []) as any[];
        const mapped: HistoryEntry[] = sessions.map((s) => ({
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
        setData(mapped);

        // Simple client-side pattern analysis
        const counts: Record<string, number> = {};
        let totalConfidence = 0;
        let fatigueTrend = 0;
        let depressionTrend = 0;
        let sleepTrend = 0;
        let painTrend = 0;
        mapped.forEach((m, idx) => {
          counts[m.diagnosis] = (counts[m.diagnosis] ?? 0) + 1;
          totalConfidence += m.confidence;
          if (idx > 0) {
            const prev = mapped[idx - 1];
            fatigueTrend +=
              m.symptoms.fatigue_severity_scale_score -
              prev.symptoms.fatigue_severity_scale_score;
            depressionTrend +=
              m.symptoms.depression_phq9_score -
              prev.symptoms.depression_phq9_score;
            sleepTrend +=
              m.symptoms.sleep_quality_index -
              prev.symptoms.sleep_quality_index;
            painTrend +=
              m.symptoms.physical_pain_score -
              prev.symptoms.physical_pain_score;
          }
        });
        const mostCommonDiagnosis =
          Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
          "depression";
        const averageConfidence = mapped.length
          ? totalConfidence / mapped.length
          : 0;
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
            sleepTrend > 0
              ? "improving"
              : sleepTrend < 0
              ? "worsening"
              : "stable",
          pain:
            painTrend > 0
              ? "increasing"
              : painTrend < 0
              ? "decreasing"
              : "stable",
        } as PatternAnalysis["symptomTrends"];
        setAnalysis({
          trend,
          mostCommonDiagnosis,
          averageConfidence,
          symptomTrends,
          recommendations: [
            "Maintain consistent sleep and activity pacing",
            "Follow up with your clinician for tailored guidance",
            "Track symptoms regularly to observe trends",
          ],
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-sm text-muted-foreground">Loading history...</div>
      )}
      {error && <div className="text-sm text-destructive">{error}</div>}
      {/* Stats Overview */}
      {data.length > 0 && <HistoryStats data={data} />}

      {/* Pattern Analysis */}
      {analysis && <PatternAnalysisCard analysis={analysis} />}

      {/* Symptom Charts */}
      {data.length > 0 && (
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
      )}

      {/* Diagnosis Timeline */}
      {data.length > 0 && <DiagnosisTimeline data={data} />}
    </div>
  );
}
