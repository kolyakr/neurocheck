import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test users
  const hashedPassword = await bcrypt.hash("password", 12);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      passwordHash: hashedPassword,
      emailVerified: true,
      lastLogin: new Date(),
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@neurocheck.com" },
    update: {},
    create: {
      email: "demo@neurocheck.com",
      name: "Demo User",
      passwordHash: hashedPassword,
      emailVerified: true,
      lastLogin: new Date(),
    },
  });

  console.log("✅ Created users:", {
    testUser: testUser.email,
    demoUser: demoUser.email,
  });

  // Create user preferences
  await prisma.userPreferences.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      theme: "light",
      notificationsEnabled: true,
      emailNotifications: true,
      dataSharingConsent: false,
    },
  });

  await prisma.userPreferences.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      theme: "dark",
      notificationsEnabled: true,
      emailNotifications: false,
      dataSharingConsent: true,
    },
  });

  console.log("✅ Created user preferences");

  // Create sample diagnosis sessions for test user
  const sessions = await Promise.all([
    // Depression case
    prisma.diagnosisSession.create({
      data: {
        userId: testUser.id,
        sessionToken: "session-depression-001",
        status: "completed",
        age: 28,
        gender: "female",
        fatigueSeverityScaleScore: 7.5,
        depressionPhq9Score: 12,
        pemPresent: false,
        sleepQualityIndex: 6,
        brainFogLevel: 5,
        physicalPainScore: 4,
        stressLevel: 6,
        workStatus: "working",
        socialActivityLevel: "medium",
        exerciseFrequency: "sometimes",
        meditationOrMindfulness: true,
        hoursOfSleepPerNight: 7.5,
        notes: "Feeling tired and unmotivated lately",
        predictedDiagnosis: "depression",
        confidenceScore: 85.5,
        modelVersion: "v1.0.0",
        processingTimeMs: 1200,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    }),

    // ME/CFS case
    prisma.diagnosisSession.create({
      data: {
        userId: testUser.id,
        sessionToken: "session-mecfs-001",
        status: "completed",
        age: 28,
        gender: "female",
        fatigueSeverityScaleScore: 8.2,
        depressionPhq9Score: 8,
        pemPresent: true,
        pemDurationHours: 24,
        sleepQualityIndex: 4,
        brainFogLevel: 7,
        physicalPainScore: 6,
        stressLevel: 5,
        workStatus: "partially_working",
        socialActivityLevel: "low",
        exerciseFrequency: "rarely",
        meditationOrMindfulness: false,
        hoursOfSleepPerNight: 6,
        notes: "Severe fatigue after minimal activity",
        predictedDiagnosis: "mecfs",
        confidenceScore: 78.3,
        modelVersion: "v1.0.0",
        processingTimeMs: 1100,
        completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      },
    }),

    // Both conditions case
    prisma.diagnosisSession.create({
      data: {
        userId: testUser.id,
        sessionToken: "session-both-001",
        status: "completed",
        age: 28,
        gender: "female",
        fatigueSeverityScaleScore: 9.1,
        depressionPhq9Score: 15,
        pemPresent: true,
        pemDurationHours: 48,
        sleepQualityIndex: 3,
        brainFogLevel: 8,
        physicalPainScore: 7,
        stressLevel: 8,
        workStatus: "not_working",
        socialActivityLevel: "very_low",
        exerciseFrequency: "never",
        meditationOrMindfulness: false,
        hoursOfSleepPerNight: 5,
        notes: "Combination of severe fatigue and depression symptoms",
        predictedDiagnosis: "both",
        confidenceScore: 72.1,
        modelVersion: "v1.0.0",
        processingTimeMs: 1350,
        completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      },
    }),

    // Recent session
    prisma.diagnosisSession.create({
      data: {
        userId: testUser.id,
        sessionToken: "session-recent-001",
        status: "completed",
        age: 28,
        gender: "female",
        fatigueSeverityScaleScore: 6.8,
        depressionPhq9Score: 10,
        pemPresent: false,
        sleepQualityIndex: 7,
        brainFogLevel: 4,
        physicalPainScore: 3,
        stressLevel: 5,
        workStatus: "working",
        socialActivityLevel: "medium",
        exerciseFrequency: "often",
        meditationOrMindfulness: true,
        hoursOfSleepPerNight: 8,
        notes: "Feeling better after treatment",
        predictedDiagnosis: "depression",
        confidenceScore: 82.3,
        modelVersion: "v1.0.0",
        processingTimeMs: 980,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
  ]);

  console.log("✅ Created diagnosis sessions:", sessions.length);

  // Create sample chat messages
  await Promise.all([
    // Chat for depression session
    prisma.chatMessage.create({
      data: {
        diagnosisSessionId: sessions[0].id,
        userId: testUser.id,
        messageType: "user",
        content: "Can you explain why I got a depression diagnosis?",
      },
    }),
    prisma.chatMessage.create({
      data: {
        diagnosisSessionId: sessions[0].id,
        userId: testUser.id,
        messageType: "assistant",
        content:
          "Based on your symptoms, particularly your PHQ-9 depression score of 12 and the absence of post-exertional malaise, the model suggests depression. Your fatigue and sleep issues are common in depression.",
      },
    }),
    prisma.chatMessage.create({
      data: {
        diagnosisSessionId: sessions[0].id,
        userId: testUser.id,
        messageType: "user",
        content: "What should I do next?",
      },
    }),
    prisma.chatMessage.create({
      data: {
        diagnosisSessionId: sessions[0].id,
        userId: testUser.id,
        messageType: "assistant",
        content:
          "I recommend consulting with a mental health professional for proper evaluation. Consider maintaining a regular sleep schedule and engaging in light physical activity.",
      },
    }),

    // Chat for ME/CFS session
    prisma.chatMessage.create({
      data: {
        diagnosisSessionId: sessions[1].id,
        userId: testUser.id,
        messageType: "user",
        content: "Why did I get ME/CFS diagnosis?",
      },
    }),
    prisma.chatMessage.create({
      data: {
        diagnosisSessionId: sessions[1].id,
        userId: testUser.id,
        messageType: "assistant",
        content:
          "Your symptoms, especially post-exertional malaise (PEM) lasting 24 hours, severe fatigue (8.2/10), and cognitive difficulties suggest ME/CFS. PEM is a hallmark symptom of this condition.",
      },
    }),
  ]);

  console.log("✅ Created chat messages");

  // Create sample system logs
  await Promise.all([
    prisma.systemLog.create({
      data: {
        userId: testUser.id,
        sessionId: sessions[0].id,
        logLevel: "INFO",
        message: "Diagnosis session completed successfully",
        metadata: { diagnosis: "depression", confidence: 85.5 },
        ipAddress: "192.168.1.100",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }),
    prisma.systemLog.create({
      data: {
        userId: testUser.id,
        sessionId: sessions[1].id,
        logLevel: "INFO",
        message: "Diagnosis session completed successfully",
        metadata: { diagnosis: "mecfs", confidence: 78.3 },
        ipAddress: "192.168.1.100",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }),
    prisma.systemLog.create({
      data: {
        userId: testUser.id,
        logLevel: "INFO",
        message: "User preferences updated",
        metadata: { theme: "light", notifications: true },
      },
    }),
  ]);

  console.log("✅ Created system logs");

  // Create demo user sessions
  await prisma.diagnosisSession.create({
    data: {
      userId: demoUser.id,
      sessionToken: "demo-session-001",
      status: "completed",
      age: 35,
      gender: "male",
      fatigueSeverityScaleScore: 6.5,
      depressionPhq9Score: 9,
      pemPresent: false,
      sleepQualityIndex: 5,
      brainFogLevel: 6,
      physicalPainScore: 5,
      stressLevel: 7,
      workStatus: "working",
      socialActivityLevel: "high",
      exerciseFrequency: "daily",
      meditationOrMindfulness: true,
      hoursOfSleepPerNight: 7,
      notes: "Demo session for testing",
      predictedDiagnosis: "depression",
      confidenceScore: 76.8,
      modelVersion: "v1.0.0",
      processingTimeMs: 1050,
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  console.log("✅ Created demo user session");

  console.log("🎉 Database seeded successfully!");
  console.log("📊 Summary:");
  console.log(`   - Users: 2`);
  console.log(`   - Diagnosis Sessions: ${sessions.length + 1}`);
  console.log(`   - Chat Messages: 6`);
  console.log(`   - System Logs: 3`);
  console.log(`   - User Preferences: 2`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
