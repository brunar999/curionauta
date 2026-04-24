import "dotenv/config";
import { db } from "./db";
import { users, students, lessons, lessonProgress } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// ── Config ─────────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@curionauta.pt";
const ADMIN_PASSWORD = "1MQLz2AoA72d95Xe";

const DEMO_EMAIL = "demo@curionauta.pt";
const DEMO_PASSWORD = "IG1YyK53auFvmO0Y";

async function seedAccounts() {
  console.log("👤 Setting up accounts...\n");

  // ── Admin account ─────────────────────────────────────────────────────────
  const existingAdmin = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL));
  if (existingAdmin.length > 0) {
    console.log(`⚠️  Admin account already exists: ${ADMIN_EMAIL}`);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await db.insert(users).values({
      email: ADMIN_EMAIL,
      passwordHash: hash,
      firstName: "Admin",
    });
    console.log(`✅ Admin account created`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
  }

  // ── Demo account ──────────────────────────────────────────────────────────
  const existingDemo = await db.select().from(users).where(eq(users.email, DEMO_EMAIL));
  let demoUser = existingDemo[0];

  if (demoUser) {
    console.log(`\n⚠️  Demo account already exists: ${DEMO_EMAIL}`);
  } else {
    const hash = await bcrypt.hash(DEMO_PASSWORD, 12);
    const [created] = await db.insert(users).values({
      email: DEMO_EMAIL,
      passwordHash: hash,
      firstName: "Demo",
    }).returning();
    demoUser = created;
    console.log(`\n✅ Demo account created`);
    console.log(`   Email:    ${DEMO_EMAIL}`);
    console.log(`   Password: ${DEMO_PASSWORD}`);
  }

  // ── Demo student ──────────────────────────────────────────────────────────
  const existingStudents = await db.select().from(students).where(eq(students.userId, demoUser.id));

  if (existingStudents.length > 0) {
    console.log(`\n⚠️  Demo student already exists: ${existingStudents[0].name}`);
  } else {
    // Get first grade
    const allLessons = await db.select().from(lessons);
    const firstFourLessons = allLessons.slice(0, 4);

    const [ana] = await db.insert(students).values({
      userId: demoUser.id,
      name: "Ana",
      currentGradeId: 1,
      avatarEmoji: "👧",
      streakCount: 5,
      lastCompletedDate: new Date().toISOString().slice(0, 10),
    }).returning();

    console.log(`\n✅ Demo student "Ana" created`);

    // Add some lesson progress
    if (firstFourLessons.length > 0) {
      for (let i = 0; i < Math.min(3, firstFourLessons.length); i++) {
        const lesson = firstFourLessons[i];
        await db.insert(lessonProgress).values({
          userId: demoUser.id,
          studentId: ana.id,
          lessonId: lesson.id,
          status: "completed",
          startedAt: new Date(Date.now() - (3 - i) * 86400000),
          completedAt: new Date(Date.now() - (3 - i) * 86400000 + 600000),
          timeSpent: 480 + i * 60,
          correctAnswers: 8 + i,
          totalAnswers: 10,
          starsEarned: 3,
        });
      }

      // One in-progress
      if (firstFourLessons[3]) {
        await db.insert(lessonProgress).values({
          userId: demoUser.id,
          studentId: ana.id,
          lessonId: firstFourLessons[3].id,
          status: "in_progress",
          startedAt: new Date(),
          timeSpent: 120,
        });
      }

      console.log(`   Progress: 3 completed, 1 in progress, streak 🔥5`);
    }
  }

  console.log("\n────────────────────────────────────────");
  console.log("📋 Account summary");
  console.log("────────────────────────────────────────");
  console.log(`🔧 Admin    ${ADMIN_EMAIL}  /  ${ADMIN_PASSWORD}`);
  console.log(`👤 Demo     ${DEMO_EMAIL}   /  ${DEMO_PASSWORD}`);
  console.log("────────────────────────────────────────\n");

  process.exit(0);
}

seedAccounts().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
