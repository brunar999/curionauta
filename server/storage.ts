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
  type InsertGrade,
  type Theme,
  type InsertTheme,
  type Lesson,
  type InsertLesson,
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
  data: Partial<{ name: string; currentGradeId: number; avatarEmoji: string; streakCount: number; lastCompletedDate: string }>
): Promise<Student> {
  const [student] = await db
    .update(students)
    .set(data)
    .where(eq(students.id, id))
    .returning();
  return student;
}

export async function updateStreak(studentId: number): Promise<void> {
  const student = await getStudentById(studentId);
  if (!student) return;

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const last = student.lastCompletedDate;

  if (last === today) {
    // Already updated today, no-op
    return;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = last === yesterday ? (student.streakCount ?? 0) + 1 : 1;

  await db
    .update(students)
    .set({ streakCount: newStreak, lastCompletedDate: today })
    .where(eq(students.id, studentId));
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
    const becomingCompleted = data.status === "completed" && existing.status !== "completed";
    if (becomingCompleted) {
      updateData.completedAt = new Date();
    }
    const [updated] = await db
      .update(lessonProgress)
      .set(updateData)
      .where(eq(lessonProgress.id, existing.id))
      .returning();
    if (becomingCompleted && studentId) await updateStreak(studentId);
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
  if (data.status === "completed" && studentId) await updateStreak(studentId);
  return created;
}

// ── Admin: Grades ──────────────────────────────────────────────────────────────
export async function createGrade(data: Omit<InsertGrade, "id" | "createdAt">): Promise<Grade> {
  const [grade] = await db.insert(grades).values(data).returning();
  return grade;
}

export async function updateGrade(id: number, data: Partial<Omit<InsertGrade, "id" | "createdAt">>): Promise<Grade> {
  const [grade] = await db.update(grades).set(data).where(eq(grades.id, id)).returning();
  return grade;
}

export async function deleteGrade(id: number): Promise<void> {
  await db.delete(grades).where(eq(grades.id, id));
}

// ── Admin: Themes ──────────────────────────────────────────────────────────────
export async function createTheme(data: Omit<InsertTheme, "id" | "createdAt">): Promise<Theme> {
  const [theme] = await db.insert(themes).values(data).returning();
  return theme;
}

export async function updateTheme(id: number, data: Partial<Omit<InsertTheme, "id" | "createdAt">>): Promise<Theme> {
  const [theme] = await db.update(themes).set(data).where(eq(themes.id, id)).returning();
  return theme;
}

export async function deleteTheme(id: number): Promise<void> {
  await db.delete(themes).where(eq(themes.id, id));
}

// ── Admin: Lessons ─────────────────────────────────────────────────────────────
export async function createLesson(data: Omit<InsertLesson, "id" | "createdAt" | "updatedAt">): Promise<Lesson> {
  const [lesson] = await db.insert(lessons).values(data).returning();
  return lesson;
}

export async function updateLesson(id: number, data: Partial<Omit<InsertLesson, "id" | "createdAt">>): Promise<Lesson> {
  const [lesson] = await db.update(lessons).set({ ...data, updatedAt: new Date() }).where(eq(lessons.id, id)).returning();
  return lesson;
}

export async function deleteLesson(id: number): Promise<void> {
  await db.delete(lessons).where(eq(lessons.id, id));
}

export async function getAllLessons(): Promise<Lesson[]> {
  return db.select().from(lessons).orderBy(asc(lessons.themeId), asc(lessons.order));
}

export async function getAllThemes(): Promise<Theme[]> {
  return db.select().from(themes).orderBy(asc(themes.gradeId), asc(themes.order));
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
