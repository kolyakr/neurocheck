"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoadingSpinner } from "@/shared/components/ui/loading-spinner";
import { Progress } from "@/shared/components/ui/progress";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useCreateDiagnosis } from "../hooks/use-diagnosis";
import { useSession } from "next-auth/react";
import {
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

type Answers = {
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
};

const QUESTIONS: {
  key: keyof Answers;
  label: string;
  type: "number" | "select" | "text";
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  explain?: string;
}[] = [
  {
    key: "age",
    label: "Age",
    type: "number",
    min: 0,
    max: 120,
    explain: "Patient age in years.",
  },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    explain:
      "Self-identified gender; used if the model accounts for demographic effects.",
  },
  {
    key: "fatigue_severity_scale_score",
    label: "Fatigue Severity Scale (0–10)",
    type: "number",
    min: 0,
    max: 10,
    step: 1,
    explain:
      "FSS measures perceived impact of fatigue; higher means more severe fatigue.",
  },
  {
    key: "depression_phq9_score",
    label: "PHQ-9 Depression Score (0–27)",
    type: "number",
    min: 0,
    max: 27,
    step: 1,
    explain: "PHQ‑9 is a standard depression screening score.",
  },
  {
    key: "pem_present",
    label: "Post‑Exertional Malaise present?",
    type: "select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    explain: "PEM is worsening of symptoms after effort; a hallmark of ME/CFS.",
  },
  {
    key: "pem_duration_hours",
    label: "PEM duration (hours)",
    type: "number",
    min: 0,
    max: 240,
    step: 1,
    explain: "Approximate duration of PEM episodes in hours.",
  },
  {
    key: "sleep_quality_index",
    label: "Sleep quality (1–10)",
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    explain: "Subjective sleep quality; higher is better.",
  },
  {
    key: "brain_fog_level",
    label: "Brain fog level (1–10)",
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    explain: "Cognitive clouding; higher is more severe brain fog.",
  },
  {
    key: "physical_pain_score",
    label: "Physical pain (1–10)",
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    explain: "Overall physical pain intensity.",
  },
  {
    key: "stress_level",
    label: "Stress level (1–10)",
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    explain: "Current perceived stress level.",
  },
  {
    key: "work_status",
    label: "Work status",
    type: "select",
    options: [
      { value: "working", label: "Working" },
      { value: "partially_working", label: "Partially working" },
      { value: "not_working", label: "Not working" },
    ],
    explain:
      "Employment status can correlate with symptom severity and function.",
  },
  {
    key: "social_activity_level",
    label: "Social activity",
    type: "select",
    options: [
      { value: "very_low", label: "Very low" },
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "very_high", label: "Very high" },
    ],
    explain: "Typical level of social interactions.",
  },
  {
    key: "exercise_frequency",
    label: "Exercise frequency",
    type: "select",
    options: [
      { value: "never", label: "Never" },
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "daily", label: "Daily" },
    ],
    explain: "Usual exercise or physical activity frequency.",
  },
  {
    key: "meditation_or_mindfulness",
    label: "Practice mindfulness/meditation?",
    type: "select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    explain: "Regular relaxation practices may influence symptoms.",
  },
  {
    key: "hours_of_sleep_per_night",
    label: "Hours of sleep per night",
    type: "number",
    min: 0,
    max: 24,
    step: 0.5,
    explain: "Average nightly sleep duration.",
  },
  {
    key: "notes",
    label: "Additional notes (optional)",
    type: "text",
    placeholder: "Anything else relevant...",
    explain: "Optional context you want to add.",
  },
];

const schema = z.object({
  age: z.number().min(0).max(120),
  gender: z.enum(["male", "female", "other"]),
  fatigue_severity_scale_score: z.number().min(0).max(10),
  depression_phq9_score: z.number().min(0).max(27),
  pem_present: z.enum(["yes", "no"]),
  pem_duration_hours: z.number().min(0).max(240),
  sleep_quality_index: z.number().min(1).max(10),
  brain_fog_level: z.number().min(1).max(10),
  physical_pain_score: z.number().min(1).max(10),
  stress_level: z.number().min(1).max(10),
  work_status: z.enum(["working", "partially_working", "not_working"]),
  social_activity_level: z.enum([
    "very_low",
    "low",
    "medium",
    "high",
    "very_high",
  ]),
  exercise_frequency: z.enum([
    "never",
    "rarely",
    "sometimes",
    "often",
    "daily",
  ]),
  meditation_or_mindfulness: z.enum(["yes", "no"]),
  hours_of_sleep_per_night: z.number().min(0).max(24),
  notes: z.string().optional(),
});

export default function DiagnosisQAForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const createDiagnosis = useCreateDiagnosis();

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const isOptional = q.key === "notes";

  const stepSchema = useMemo(() => {
    const shape: any = {};
    const full = (schema as any).shape as Record<string, any>;
    shape[q.key as string] = isOptional
      ? (full[q.key as string] as any).optional?.() ?? full[q.key as string]
      : full[q.key as string];
    return z.object(shape);
  }, [q.key, isOptional]);

  function setValue(value: string) {
    if (q.type === "number") {
      const num = value === "" ? undefined : Number(value);
      setAnswers((a) => ({ ...a, [q.key]: num }));
    } else {
      setAnswers((a) => ({ ...a, [q.key]: value }));
    }
    setError(null);
  }

  function next() {
    try {
      const currentValue = answers[q.key as string as keyof Answers] as unknown;
      stepSchema.parse({ [q.key]: currentValue });
      if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
      setError(null);
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? "Please provide a valid value.");
    }
  }
  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }
  async function submit() {
    try {
      const parsed = schema.parse(answers);

      if (session?.user) {
        // User is logged in, use authenticated API
        const result = await createDiagnosis.mutateAsync(parsed);
        router.push(`/results?sessionId=${result.sessionId}`);
      } else {
        // User is not logged in, use public API
        const response = await fetch("/api/diagnosis/public", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to create diagnosis session");
        }

        // For anonymous users, pass the prediction data directly in URL
        const params = new URLSearchParams({
          sessionId: data.sessionId,
          diagnosis: data.predictedDiagnosis,
          confidence: data.confidenceScore.toString(),
          anonymous: "true",
        });
        router.push(`/results?${params.toString()}`);
      }
    } catch (e: any) {
      setError(
        e?.message ?? "Please complete required fields with valid values."
      );
    }
  }

  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Diagnosis Questionnaire</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Question {step + 1} of {QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}% complete</span>
            <span>{QUESTIONS.length - step - 1} questions remaining</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{q.label}</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      {q.label}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground">
                    {q.explain ??
                      "This input contributes to the model's prediction."}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {q.type === "number" && (
              <Input
                type="number"
                inputMode="decimal"
                min={q.min}
                max={q.max}
                step={q.step ?? 1}
                value={(answers[q.key] as number | undefined) ?? ""}
                onChange={(e) => setValue(e.target.value)}
                placeholder={q.placeholder}
                className="h-12 text-base"
              />
            )}
            {q.type === "select" && (
              <Select
                value={(answers[q.key] as string | undefined) ?? ""}
                onValueChange={(v) => setValue(v)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {q.options?.map((o) => (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      className="text-base"
                    >
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {q.type === "text" && (
              <Textarea
                value={(answers[q.key] as string | undefined) ?? ""}
                onChange={(e) => setValue(e.target.value)}
                placeholder={q.placeholder}
                className="min-h-[100px] text-base"
              />
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {!isLast ? (
            <Button onClick={next} className="flex items-center gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={createDiagnosis.isPending}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {createDiagnosis.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Get Prediction
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
