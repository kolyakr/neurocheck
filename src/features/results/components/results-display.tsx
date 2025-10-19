"use client";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { LoadingSpinner } from "@/shared/components/ui/loading-spinner";
import { ResultsSkeleton } from "@/shared/components/ui/skeletons";
import { useDiagnosisSession } from "@/features/diagnosis/hooks/use-diagnosis";
import { useSession } from "next-auth/react";
import { AlertCircle, ExternalLink } from "lucide-react";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const { data: session } = useSession();

  // Check if this is an anonymous session
  const isAnonymousSession = searchParams.get("anonymous") === "true";
  const anonymousDiagnosis = searchParams.get("diagnosis") as Diagnosis | null;
  const anonymousConfidence = Number(searchParams.get("confidence"));

  const {
    data: sessionData,
    isLoading,
    error,
  } = useDiagnosisSession(sessionId || "");

  const data = useMemo(() => {
    // Handle anonymous session data from URL params
    if (isAnonymousSession && anonymousDiagnosis) {
      const base = DIAGNOSIS_DATA[anonymousDiagnosis];
      return {
        ...base,
        confidence: Math.round(anonymousConfidence || base.confidence),
      };
    }

    // Handle authenticated session data from database
    if (sessionData?.predictedDiagnosis) {
      const key = sessionData.predictedDiagnosis as Diagnosis;
      const base = DIAGNOSIS_DATA[key];
      return {
        ...base,
        confidence: Math.round(sessionData.confidenceScore ?? base.confidence),
      };
    }
    return DIAGNOSIS_DATA["depression"];
  }, [
    sessionData,
    isAnonymousSession,
    anonymousDiagnosis,
    anonymousConfidence,
  ]);

  // For anonymous sessions, show results immediately without loading
  if (isAnonymousSession) {
    if (!anonymousDiagnosis) {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Invalid session</h3>
                  <p className="text-sm text-muted-foreground">
                    Please complete the diagnosis again.
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => router.push("/diagnosis")}>
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Show results for anonymous session
    return (
      <div className="space-y-6">
        {/* Anonymous session notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a temporary result. Sign up to save
            your diagnosis history and track your progress over time.
          </p>
        </div>

        {/* Main results display */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Diagnosis Results</CardTitle>
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
              <p className="text-sm text-muted-foreground">
                {data.explanation}
              </p>
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
              <Button
                variant="outline"
                onClick={() => router.push("/auth/sign-up")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Sign up to save results
              </Button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Want to save your results?</strong> Sign up for a free
                account to track your diagnosis history and monitor your
                progress over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <ResultsSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Error loading results</h3>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main results display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Diagnosis Results</CardTitle>
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
            {session?.user ? (
              <Button variant="outline" onClick={() => router.push("/history")}>
                Save to history
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/auth/sign-up")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Sign up to save results
              </Button>
            )}
          </div>

          {!session?.user && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Want to save your results?</strong> Sign up for a free
                account to track your diagnosis history and monitor your
                progress over time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
