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
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

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

      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to create diagnosis session");
      }

      router.push(`/results?sessionId=${data.sessionId}`);
    } catch (e: any) {
      setError(
        e?.message ?? "Please complete required fields with valid values."
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis questionnaire</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Question {step + 1} of {QUESTIONS.length}
        </div>
        <div className="space-y-2">
          <div className="font-medium">{q.label}</div>
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
            />
          )}
          {q.type === "select" && (
            <Select
              value={(answers[q.key] as string | undefined) ?? ""}
              onValueChange={(v) => setValue(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {q.options?.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
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
            />
          )}
          <div className="flex items-center gap-3 pt-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 px-2">
                  Explain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{q.label}</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">
                  {q.explain ??
                    "This input contributes to the model's prediction."}
                </div>
              </DialogContent>
            </Dialog>
            {error && <span className="text-destructive text-sm">{error}</span>}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            Back
          </Button>
          {!isLast ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button onClick={submit} className="bg-blue-600 hover:bg-blue-700">
              Get prediction
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
