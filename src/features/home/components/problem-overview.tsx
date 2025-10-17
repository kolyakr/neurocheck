import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function ProblemOverview() {
  return (
    <section className="grid gap-6 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Depression</CardTitle>
          <CardDescription>
            Mood disorder affecting how you feel and think.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc text-sm text-muted-foreground pl-5 space-y-1">
            <li>Persistent sadness, anhedonia</li>
            <li>Fatigue, sleep changes</li>
            <li>Impaired concentration</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ME/CFS</CardTitle>
          <CardDescription>
            Complex illness with profound fatigue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc text-sm text-muted-foreground pl-5 space-y-1">
            <li>Post‑exertional malaise</li>
            <li>Unrefreshing sleep</li>
            <li>Cognitive impairment</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Both</CardTitle>
          <CardDescription>
            Co‑occurrence complicates assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc text-sm text-muted-foreground pl-5 space-y-1">
            <li>Overlapping symptoms</li>
            <li>Higher diagnostic ambiguity</li>
            <li>Requires careful evaluation</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
