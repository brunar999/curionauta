import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  date,
  varchar,
  unique,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Users ──────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Grades (1º–4º ano) ─────────────────────────────────────────────────────────
export const grades = pgTable("grades", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  number: integer("number").notNull().unique(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 10 }),
  color: varchar("color", { length: 20 }),
  hidden: boolean("hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGradeSchema = createInsertSchema(grades);
export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;

// ── Students (multiple per user account) ──────────────────────────────────────
export const students = pgTable(
  "students",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    currentGradeId: integer("current_grade_id").references(() => grades.id),
    avatarEmoji: varchar("avatar_emoji", { length: 10 }).default("🧒"),
    streakCount: integer("streak_count").default(0),
    lastCompletedDate: date("last_completed_date"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("idx_students_user").on(t.userId)]
);

export const insertStudentSchema = createInsertSchema(students);
export const clientInsertStudentSchema = insertStudentSchema.omit({ userId: true });
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type ClientInsertStudent = z.infer<typeof clientInsertStudentSchema>;

// ── Themes (science topics per grade) ─────────────────────────────────────────
export const themes = pgTable("themes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  gradeId: integer("grade_id")
    .notNull()
    .references(() => grades.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  shortTitle: varchar("short_title", { length: 100 }),
  description: text("description"),
  icon: varchar("icon", { length: 10 }),
  bgColor: varchar("bg_color", { length: 20 }),
  accentColor: varchar("accent_color", { length: 20 }),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertThemeSchema = createInsertSchema(themes);
export type Theme = typeof themes.$inferSelect;
export type InsertTheme = z.infer<typeof insertThemeSchema>;

// ── Lessons ────────────────────────────────────────────────────────────────────
export const lessons = pgTable("lessons", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  themeId: integer("theme_id")
    .notNull()
    .references(() => themes.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  parts: jsonb("parts"),
  order: integer("order").notNull().default(0),
  duration: integer("duration").default(10),
  type: varchar("type", { length: 30 }).default("content"), // content | quiz | drag-drop | mixed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLessonSchema = createInsertSchema(lessons);
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

// ── Lesson progress ────────────────────────────────────────────────────────────
export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    studentId: integer("student_id").references(() => students.id, {
      onDelete: "cascade",
    }),
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 20 }).notNull().default("not_started"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    timeSpent: integer("time_spent").default(0),
    correctAnswers: integer("correct_answers").default(0),
    totalAnswers: integer("total_answers").default(0),
    starsEarned: integer("stars_earned").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("idx_progress_user").on(t.userId),
    index("idx_progress_student").on(t.studentId),
    index("idx_progress_lesson").on(t.lessonId),
    unique("unique_student_lesson").on(t.studentId, t.lessonId),
  ]
);

export const insertLessonProgressSchema = createInsertSchema(lessonProgress);
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;

// ── Relations ──────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  currentGrade: one(grades, {
    fields: [students.currentGradeId],
    references: [grades.id],
  }),
  lessonProgress: many(lessonProgress),
}));

export const gradesRelations = relations(grades, ({ many }) => ({
  themes: many(themes),
  students: many(students),
}));

export const themesRelations = relations(themes, ({ one, many }) => ({
  grade: one(grades, { fields: [themes.gradeId], references: [grades.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  theme: one(themes, { fields: [lessons.themeId], references: [themes.id] }),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, { fields: [lessonProgress.userId], references: [users.id] }),
  student: one(students, {
    fields: [lessonProgress.studentId],
    references: [students.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}));
