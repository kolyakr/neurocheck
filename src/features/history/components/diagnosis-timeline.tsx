"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { HistoryEntry } from "../types";

interface DiagnosisTimelineProps {
  data: HistoryEntry[];
}

const diagnosisColors = {
  depression: "bg-blue-100 text-blue-800 border-blue-200",
  mecfs: "bg-indigo-100 text-indigo-800 border-indigo-200",
  both: "bg-purple-100 text-purple-800 border-purple-200",
};

const diagnosisLabels = {
  depression: "Depression",
  mecfs: "ME/CFS",
  both: "Both",
};

export default function DiagnosisTimeline({ data }: DiagnosisTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((entry, index) => (
            <div key={entry.id} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    diagnosisColors[entry.diagnosis].split(" ")[0]
                  }`}
                />
                {index < data.length - 1 && (
                  <div className="w-px h-8 bg-gray-200 mt-2" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        diagnosisColors[entry.diagnosis]
                      }`}
                    >
                      {diagnosisLabels[entry.diagnosis]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(entry.confidence)}% confidence
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                {entry.notes && (
                  <p className="text-sm text-muted-foreground mt-1 ml-6">
                    {entry.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
