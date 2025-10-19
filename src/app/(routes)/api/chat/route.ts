import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth";
import { prisma } from "@/shared/lib/prisma";

// GET /api/chat?sessionId=xxx - list chat messages for a session (user scoped)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 }
    );
  }
  const owns = await prisma.diagnosisSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
    select: { id: true },
  });
  if (!owns) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await prisma.chatMessage.findMany({
    where: { diagnosisSessionId: sessionId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ messages });
}

// POST /api/chat - create message for a session
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { sessionId, content, messageType = "user" } = body ?? {};
  if (!sessionId || !content) {
    return NextResponse.json(
      { error: "sessionId and content are required" },
      { status: 400 }
    );
  }
  const owns = await prisma.diagnosisSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
    select: { id: true },
  });
  if (!owns) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const created = await prisma.chatMessage.create({
    data: {
      diagnosisSessionId: sessionId,
      userId: session.user.id,
      messageType,
      content,
    },
  });
  return NextResponse.json({ message: created }, { status: 201 });
}
