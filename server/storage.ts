import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  students,
  grades,
  themes,
  lessons,
  lessonProgress,
  type User,
  type InsertUser,
  type Student,
  type InsertStudent,
  type Grade,
  type Theme,
  type Lesson,
  type LessonProgress,
  type InsertLessonProgress,
} from "@shared/schema";
import bcrypt from "bcryptjs";

// ── Auth ───────────────────────────────────────────────────────────────────────
export async function createUser(email: string, password: string, firstName?: string): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ email, passwordHash, firstName })
    .returning();
  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  if (!user.passwordHash) return false;
  return bcrypt.compare(password, user.passwordHash);
}

// ── Students ───────────────────────────────────────────────────────────────────
export async function getStudentsByUser(userId: string): Promise<Student[]> {
  return db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .orderBy(asc(students.createdAt));
}

export async function getStudentById(id: number): Promise<Student | undefined> {
  const [student] = await db.select().from(students).where(eq(students.id, id));
  return student;
}

export async function createStudent(
  userId: string,
  data: { name: string; currentGradeId?: number; avatarEmoji?: string }
): Promise<Student> {
  const [student] = await db
    .insert(students)
    .values({ userId, ...data })
    .returning();
  return student;
}

export async function updateStudent(
  id: number,
  data: Partial<{ name: string; currentGradeId: number; avatarEmoji: string }>
): Promise<Student> {
  const [student] = await db
    .update(students)
    .set(data)
    .where(eq(students.id, id))
    .returning();
  return student;
}

export async function deleteStudent(id: number): Promise<void> {
  await db.delete(students).where(eq(students.id, id));
}

// ── Grades ─────────────────────────────────────────────────────────────────────
export async function getAllGrades(): Promise<Grade[]> {
  return db.select().from(grades).orderBy(asc(grades.number));
}

export async function getGradeById(id: number): Promise<Grade | undefined> {
  const [grade] = await db.select().from(grades).where(eq(grades.id, id));
  return grade;
}

// ── Themes ─────────────────────────────────────────────────────────────────────
export async function getThemesByGrade(gradeId: number): Promise<Theme[]> {
  return db
    .select()
    .from(themes)
    .where(eq(themes.gradeId, gradeId))
    .orderBy(asc(themes.order));
}

export async function getThemeById(id: number): Promise<Theme | undefined> {
  const [theme] = await db.select().from(themes).where(eq(themes.id, id));
  return theme;
}

// ── Lessons ────────────────────────────────────────────────────────────────────
export async function getLessonsByTheme(themeId: number): Promise<Lesson[]> {
  return db
    .select()
    .from(lessons)
    .where(eq(lessons.themeId, themeId))
    .orderBy(asc(lessons.order));
}

export async function getLessonById(id: number): Promise<Lesson | undefined> {
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
  return lesson;
}

// ── Progress ───────────────────────────────────────────────────────────────────
export async function getProgressByStudent(studentId: number): Promise<LessonProgress[]> {
  return db
    .select()
    .from(lessonProgress)
    .where(eq(lessonProgress.studentId, studentId));
}

export async function getLessonProgress(
  studentId: number,
  lessonId: number
): Promise<LessonProgress | undefined> {
  const [progress] = await db
    .select()
    .from(lessonProgress)
    .where(
      and(
        eq(lessonProgress.studentId, studentId),
        eq(lessonProgress.lessonId, lessonId)
      )
    );
  return progress;
}

export async function upsertLessonProgress(
  userId: string,
  studentId: number,
  lessonId: number,
  data: Partial<{
    status: string;
    timeSpent: number;
    correctAnswers: number;
    totalAnswers: number;
    starsEarned: number;
  }>
): Promise<LessonProgress> {
  const existing = await getLessonProgress(studentId, lessonId);

  if (existing) {
    // Don't downgrade from completed
    if (existing.status === "completed" && data.status && data.status !== "completed") {
      delete data.status;
    }
    const updateData: Record<string, unknown> = { ...data };
    if (data.status === "completed" && !existing.completedAt) {
      updateData.completedAt = new Date();
    }
    const [updated] = await db
      .update(lessonProgress)
      .set(updateData)
      .where(eq(lessonProgress.id, existing.id))
      .returning();
    return updated;
  }

  const insertData: InsertLessonProgress = {
    userId,
    studentId,
    lessonId,
    ...data,
    startedAt: new Date(),
    completedAt: data.status === "completed" ? new Date() : undefined,
  };

  const [created] = await db.insert(lessonProgress).values(insertData).returning();
  return created;
}

// ── Dashboard stats ────────────────────────────────────────────────────────────
export async function getStudentStats(studentId: number) {
  const allProgress = await getProgressByStudent(studentId);
  const completed = allProgress.filter((p) => p.status === "completed");
  const inProgress = allProgress.filter((p) => p.status === "in_progress");
  const totalTime = allProgress.reduce((sum, p) => sum + (p.timeSpent ?? 0), 0);

  return {
    totalLessons: allProgress.length,
    completedLessons: completed.length,
    inProgressLessons: inProgress.length,
    totalTimeSeconds: totalTime,
  };
}
