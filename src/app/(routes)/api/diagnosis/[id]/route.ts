import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth";
import { prisma } from "@/shared/lib/prisma";

// GET /api/diagnosis/[id] - get single session for current user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const dx = await prisma.diagnosisSession.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!dx) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ session: dx });
}
