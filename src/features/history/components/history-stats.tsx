"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { HistoryEntry } from "../types";

interface HistoryStatsProps {
  data: HistoryEntry[];
}

export default function HistoryStats({ data }: HistoryStatsProps) {
  const totalEntries = data.length;
  const avgConfidence =
    data.reduce((sum, entry) => sum + entry.confidence, 0) / totalEntries;

  const diagnosisCounts = data.reduce((acc, entry) => {
    acc[entry.diagnosis] = (acc[entry.diagnosis] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostRecentEntry = data[0];
  const oldestEntry = data[data.length - 1];
  const daysTracked = Math.ceil(
    (new Date(mostRecentEntry.date).getTime() -
      new Date(oldestEntry.date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const avgSymptoms = {
    fatigue:
      data.reduce(
        (sum, entry) => sum + entry.symptoms.fatigue_severity_scale_score,
        0
      ) / totalEntries,
    depression:
      data.reduce(
        (sum, entry) => sum + entry.symptoms.depression_phq9_score,
        0
      ) / totalEntries,
    sleep:
      data.reduce((sum, entry) => sum + entry.symptoms.sleep_quality_index, 0) /
      totalEntries,
    pain:
      data.reduce((sum, entry) => sum + entry.symptoms.physical_pain_score, 0) /
      totalEntries,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEntries}</div>
          <p className="text-xs text-muted-foreground">
            Over {daysTracked} days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(avgConfidence)}%</div>
          <p className="text-xs text-muted-foreground">
            Model prediction accuracy
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Most Common</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {
              Object.entries(diagnosisCounts).reduce((a, b) =>
                a[1] > b[1] ? a : b
              )[0]
            }
          </div>
          <p className="text-xs text-muted-foreground">Diagnosis type</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Fatigue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avgSymptoms.fatigue.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">Out of 10 scale</p>
        </CardContent>
      </Card>
    </div>
  );
}
