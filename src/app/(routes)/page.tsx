import { HomeHero, ProblemOverview, HowItWorks } from "@/features/home";

export default function Home() {
  return (
    <div className="space-y-12">
      <HomeHero />
      <div className="container mx-auto">
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              What we classify
            </h2>
            <ProblemOverview />
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <HowItWorks />
          </section>
        </div>
      </div>
    </div>
  );
}
