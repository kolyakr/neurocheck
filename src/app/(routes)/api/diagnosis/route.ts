import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth";
import { prisma } from "@/shared/lib/prisma";

// GET /api/diagnosis - list sessions for current user (requires auth)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.diagnosisSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      completedAt: true,
      predictedDiagnosis: true,
      confidenceScore: true,
      fatigueSeverityScaleScore: true,
      depressionPhq9Score: true,
      pemPresent: true,
      sleepQualityIndex: true,
      brainFogLevel: true,
      physicalPainScore: true,
      stressLevel: true,
      notes: true,
      status: true,
    },
  });

  return NextResponse.json({ sessions });
}

// POST /api/diagnosis - create session with hardcoded prediction
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Simple heuristic hardcode (temporary): pick one of three with confidence
  // If PEM present and duration >= 24 -> mecfs
  // Else if PHQ-9 >= 10 -> depression
  // Else -> both (low confidence)
  const pemPresent = body.pem_present === "yes" || body.pem_present === true;
  const pemDuration = Number(body.pem_duration_hours ?? 0);
  const phq9 = Number(body.depression_phq9_score ?? 0);

  let predictedDiagnosis: "depression" | "mecfs" | "both" = "depression";
  let confidenceScore = 75;
  if (pemPresent && pemDuration >= 24) {
    predictedDiagnosis = "mecfs";
    confidenceScore = 78;
  } else if (phq9 >= 10) {
    predictedDiagnosis = "depression";
    confidenceScore = 85;
  } else {
    predictedDiagnosis = "both";
    confidenceScore = 72;
  }

  const created = await prisma.diagnosisSession.create({
    data: {
      userId: session.user.id,
      sessionToken: `session-${Date.now()}`,
      status: "completed",
      age: body.age ?? null,
      gender: body.gender ?? null,
      fatigueSeverityScaleScore: body.fatigue_severity_scale_score ?? null,
      depressionPhq9Score: body.depression_phq9_score ?? null,
      pemPresent: pemPresent,
      pemDurationHours: body.pem_duration_hours ?? null,
      sleepQualityIndex: body.sleep_quality_index ?? null,
      brainFogLevel: body.brain_fog_level ?? null,
      physicalPainScore: body.physical_pain_score ?? null,
      stressLevel: body.stress_level ?? null,
      workStatus: body.work_status ?? null,
      socialActivityLevel: body.social_activity_level ?? null,
      exerciseFrequency: body.exercise_frequency ?? null,
      meditationOrMindfulness:
        body.meditation_or_mindfulness === "yes" ||
        body.meditation_or_mindfulness === true
          ? true
          : body.meditation_or_mindfulness === "no"
          ? false
          : null,
      hoursOfSleepPerNight: body.hours_of_sleep_per_night ?? null,
      notes: body.notes ?? null,
      predictedDiagnosis,
      confidenceScore,
      modelVersion: "hardcoded-v0",
      processingTimeMs: 500,
      completedAt: new Date(),
    },
    select: { id: true, predictedDiagnosis: true, confidenceScore: true },
  });

  return NextResponse.json(
    {
      sessionId: created.id,
      predictedDiagnosis: created.predictedDiagnosis,
      confidenceScore: created.confidenceScore,
    },
    { status: 201 }
  );
}
