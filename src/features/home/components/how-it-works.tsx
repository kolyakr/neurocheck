import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const steps = [
  {
    title: "1. Enter symptoms",
    text: "Provide key health indicators and patterns.",
  },
  {
    title: "2. ML prediction",
    text: "FastAPI model returns diagnosis and confidence.",
  },
  {
    title: "3. Explain & save",
    text: "Chat to explain results and save to history.",
  },
];

export default function HowItWorks() {
  return (
    <section className="grid gap-6 sm:grid-cols-3">
      {steps.map((s) => (
        <Card key={s.title}>
          <CardHeader>
            <CardTitle>{s.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">{s.text}</CardContent>
        </Card>
      ))}
    </section>
  );
}
