"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type Diagnosis = "depression" | "mecfs" | "both";

const DIAGNOSIS_DATA: Record<
  Diagnosis,
  {
    title: string;
    color: string;
    confidence: number;
    explanation: string;
    meaning: string;
    recommendations: string[];
  }
> = {
  depression: {
    title: "Depression",
    color: "bg-blue-600",
    confidence: 85,
    explanation:
      "Based on your symptoms, particularly persistent sadness, low mood, and changes in sleep patterns, the model suggests a diagnosis of Depression.",
    meaning:
      "Depression is a mood disorder that affects how you feel, think, and handle daily activities. It's characterized by persistent feelings of sadness, hopelessness, and loss of interest in activities you once enjoyed.",
    recommendations: [
      "Consider consulting with a mental health professional for proper evaluation",
      "Maintain a regular sleep schedule and healthy lifestyle habits",
      "Engage in regular physical activity, even light exercise can help",
      "Stay connected with friends and family for social support",
      "Consider therapy or counseling as part of treatment",
    ],
  },
  mecfs: {
    title: "ME/CFS",
    color: "bg-indigo-600",
    confidence: 78,
    explanation:
      "Your symptoms, especially post-exertional malaise, severe fatigue, and cognitive difficulties, align with Myalgic Encephalomyelitis/Chronic Fatigue Syndrome.",
    meaning:
      "ME/CFS is a complex, chronic illness characterized by extreme fatigue that doesn't improve with rest and worsens with physical or mental activity. It affects multiple body systems and can significantly impact daily functioning.",
    recommendations: [
      "Consult with a healthcare provider experienced in ME/CFS",
      "Practice pacing activities to avoid post-exertional malaise",
      "Maintain a consistent sleep schedule and rest when needed",
      "Consider working with a physical therapist familiar with ME/CFS",
      "Join support groups for people with ME/CFS",
    ],
  },
  both: {
    title: "Both Depression and ME/CFS",
    color: "bg-purple-600",
    confidence: 72,
    explanation:
      "Your symptoms suggest the co-occurrence of both Depression and ME/CFS, which can complicate diagnosis and treatment as symptoms often overlap.",
    meaning:
      "Having both conditions means you're experiencing symptoms from both depression and ME/CFS simultaneously. This is not uncommon, as the chronic nature of ME/CFS can lead to secondary depression, while depression can worsen ME/CFS symptoms.",
    recommendations: [
      "Seek evaluation from both mental health and ME/CFS specialists",
      "Work with a healthcare team that understands both conditions",
      "Address depression first as it may improve overall functioning",
      "Use pacing strategies to manage ME/CFS symptoms",
      "Consider therapy that addresses both physical and emotional aspects",
    ],
  },
};

export default function ResultsDisplay() {
  const [selectedDiagnosis, setSelectedDiagnosis] =
    useState<Diagnosis>("depression");
  const router = useRouter();

  const data = DIAGNOSIS_DATA[selectedDiagnosis];

  return (
    <div className="space-y-6">
      {/* Testing selector - to be removed when connected to FastAPI */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results (Temporary)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Select diagnosis to view:
            </label>
            <Select
              value={selectedDiagnosis}
              onValueChange={(value: Diagnosis) => setSelectedDiagnosis(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="depression">Depression</SelectItem>
                <SelectItem value="mecfs">ME/CFS</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main results display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Diagnosis Results</CardTitle>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-white font-semibold ${data.color}`}
            >
              <span>{data.title}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confidence score */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Confidence Score</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${data.color}`}
                style={{ width: `${data.confidence}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {data.confidence}% confidence
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Explanation</div>
            <p className="text-sm text-muted-foreground">{data.explanation}</p>
          </div>

          {/* What this means */}
          <div className="space-y-2">
            <div className="text-sm font-medium">What this means</div>
            <p className="text-sm text-muted-foreground">{data.meaning}</p>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Recommendations</div>
            <ul className="space-y-1">
              {data.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => router.push("/chat")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Explain more
            </Button>
            <Button variant="outline" onClick={() => router.push("/history")}>
              Save to history
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
