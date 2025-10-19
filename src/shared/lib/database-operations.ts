import { prisma } from "./prisma";
import {
  DiagnosisType,
  Gender,
  WorkStatus,
  SocialActivityLevel,
  ExerciseFrequency,
  MessageType,
  LogLevel,
} from "@prisma/client";

export class DatabaseOperations {
  // User operations
  static async createUser(email: string, name: string, passwordHash: string) {
    return prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        preferences: true,
      },
    });
  }

  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        preferences: true,
        diagnosisSessions: {
          orderBy: { startedAt: "desc" },
          take: 5,
        },
      },
    });
  }

  // Diagnosis session operations
  static async createDiagnosisSession(userId: string, sessionToken: string) {
    return prisma.diagnosisSession.create({
      data: {
        userId,
        sessionToken,
        status: "in_progress",
      },
    });
  }

  static async updateDiagnosisSession(
    sessionId: string,
    data: {
      age?: number;
      gender?: Gender;
      fatigueSeverityScaleScore?: number;
      depressionPhq9Score?: number;
      pemPresent?: boolean;
      pemDurationHours?: number;
      sleepQualityIndex?: number;
      brainFogLevel?: number;
      physicalPainScore?: number;
      stressLevel?: number;
      workStatus?: WorkStatus;
      socialActivityLevel?: SocialActivityLevel;
      exerciseFrequency?: ExerciseFrequency;
      meditationOrMindfulness?: boolean;
      hoursOfSleepPerNight?: number;
      notes?: string;
    }
  ) {
    return prisma.diagnosisSession.update({
      where: { id: sessionId },
      data,
    });
  }

  static async completeDiagnosisSession(
    sessionId: string,
    predictedDiagnosis: DiagnosisType,
    confidenceScore: number,
    modelVersion: string = "v1.0.0",
    processingTimeMs?: number
  ) {
    return prisma.diagnosisSession.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        predictedDiagnosis,
        confidenceScore,
        modelVersion,
        processingTimeMs,
        completedAt: new Date(),
      },
    });
  }

  static async getDiagnosisSession(sessionId: string) {
    return prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        chatMessages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  // History operations
  static async getUserDiagnosisHistory(userId: string, limit = 10) {
    return prisma.diagnosisSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: limit,
      select: {
        id: true,
        startedAt: true,
        completedAt: true,
        predictedDiagnosis: true,
        confidenceScore: true,
        age: true,
        gender: true,
        fatigueSeverityScaleScore: true,
        depressionPhq9Score: true,
        pemPresent: true,
        sleepQualityIndex: true,
        brainFogLevel: true,
        physicalPainScore: true,
        stressLevel: true,
        workStatus: true,
        socialActivityLevel: true,
        exerciseFrequency: true,
        meditationOrMindfulness: true,
        hoursOfSleepPerNight: true,
        notes: true,
      },
    });
  }

  static async getDiagnosisStats(userId: string) {
    const sessions = await prisma.diagnosisSession.findMany({
      where: {
        userId,
        status: "completed",
        predictedDiagnosis: { not: null },
      },
      select: {
        predictedDiagnosis: true,
        confidenceScore: true,
        startedAt: true,
        fatigueSeverityScaleScore: true,
        depressionPhq9Score: true,
        sleepQualityIndex: true,
        physicalPainScore: true,
      },
    });

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        mostCommonDiagnosis: null,
        averageConfidence: 0,
        symptomTrends: {},
      };
    }

    // Calculate most common diagnosis
    const diagnosisCounts = sessions.reduce((acc, session) => {
      const diagnosis = session.predictedDiagnosis || "unknown";
      acc[diagnosis] = (acc[diagnosis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonDiagnosis =
      Object.entries(diagnosisCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      null;

    // Calculate average confidence
    const averageConfidence =
      sessions.reduce(
        (sum, session) => sum + (session.confidenceScore || 0),
        0
      ) / sessions.length;

    // Calculate symptom trends (simplified)
    const recentSessions = sessions.slice(0, 3);
    const olderSessions = sessions.slice(-3);

    const symptomTrends = {
      fatigue: this.calculateTrend(
        recentSessions,
        olderSessions,
        "fatigueSeverityScaleScore"
      ),
      depression: this.calculateTrend(
        recentSessions,
        olderSessions,
        "depressionPhq9Score"
      ),
      sleep: this.calculateTrend(
        recentSessions,
        olderSessions,
        "sleepQualityIndex"
      ),
      pain: this.calculateTrend(
        recentSessions,
        olderSessions,
        "physicalPainScore"
      ),
    };

    return {
      totalSessions: sessions.length,
      mostCommonDiagnosis,
      averageConfidence: Math.round(averageConfidence * 10) / 10,
      symptomTrends,
    };
  }

  private static calculateTrend(
    recent: any[],
    older: any[],
    field: string
  ): "improving" | "stable" | "declining" {
    if (recent.length === 0 || older.length === 0) return "stable";

    const recentAvg =
      recent.reduce((sum, s) => sum + (s[field] || 0), 0) / recent.length;
    const olderAvg =
      older.reduce((sum, s) => sum + (s[field] || 0), 0) / older.length;

    const diff = recentAvg - olderAvg;
    if (Math.abs(diff) < 0.5) return "stable";
    return diff > 0 ? "declining" : "improving";
  }

  // Chat operations
  static async createChatMessage(
    sessionId: string,
    userId: string,
    messageType: MessageType,
    content: string,
    metadata?: any
  ) {
    return prisma.chatMessage.create({
      data: {
        diagnosisSessionId: sessionId,
        userId,
        messageType,
        content,
        metadata,
      },
    });
  }

  static async getChatHistory(sessionId: string) {
    return prisma.chatMessage.findMany({
      where: { diagnosisSessionId: sessionId },
      orderBy: { createdAt: "asc" },
    });
  }

  // User preferences operations
  static async updateUserPreferences(
    userId: string,
    data: {
      theme?: "light" | "dark" | "system";
      notificationsEnabled?: boolean;
      emailNotifications?: boolean;
      dataSharingConsent?: boolean;
    }
  ) {
    return prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }

  // System logs operations
  static async createSystemLog(
    logLevel: LogLevel,
    message: string,
    metadata?: any,
    userId?: string,
    sessionId?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    return prisma.systemLog.create({
      data: {
        userId,
        sessionId,
        logLevel,
        message,
        metadata,
        ipAddress,
        userAgent,
      },
    });
  }

  // Cleanup operations
  static async cleanupAbandonedSessions() {
    const result = await prisma.diagnosisSession.deleteMany({
      where: {
        status: "in_progress",
        startedAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        },
      },
    });
    return result.count;
  }

  static async cleanupOldLogs(daysToKeep = 90) {
    const result = await prisma.systemLog.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000),
        },
      },
    });
    return result.count;
  }
}
