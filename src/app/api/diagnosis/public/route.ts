import { NextRequest, NextResponse } from "next/server";

// POST /api/diagnosis/public - predict diagnosis without saving to database (no auth required)
export async function POST(request: NextRequest) {
  try {
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

    // For anonymous users, just return the prediction without saving to database
    return NextResponse.json(
      {
        sessionId: `anonymous-${Date.now()}`, // Generate a temporary session ID
        predictedDiagnosis,
        confidenceScore,
        isAnonymous: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Public diagnosis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
