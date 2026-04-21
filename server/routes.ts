import { Router, type Request, type Response } from "express";
import {
  getAllGrades,
  getGradeById,
  getThemesByGrade,
  getThemeById,
  getLessonsByTheme,
  getLessonById,
  getStudentsByUser,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getProgressByStudent,
  getLessonProgress,
  upsertLessonProgress,
  getStudentStats,
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword,
  createGrade,
  updateGrade,
  deleteGrade,
  createTheme,
  updateTheme,
  deleteTheme,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
  getAllThemes,
} from "./storage";

const router = Router();

// ── Auth ───────────────────────────────────────────────────────────────────────
router.post("/auth/register", async (req: Request, res: Response) => {
  const { email, password, firstName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e palavra-passe são obrigatórios" });
  }
  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Este email já está registado" });
    }
    const user = await createUser(email, password, firstName);
    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email, firstName: user.firstName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e palavra-passe são obrigatórios" });
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const valid = await verifyPassword(user, password);
    if (!valid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    req.session.userId = user.id;
    res.json({ user: { id: user.id, email: user.email, firstName: user.firstName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao iniciar sessão" });
  }
});

router.post("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/auth/me", (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  res.json({ userId: req.session.userId });
});

// ── Auth middleware ────────────────────────────────────────────────────────────
function requireAuth(req: Request, res: Response, next: () => void) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  next();
}

async function requireAdmin(req: Request, res: Response, next: () => void) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return res.status(403).json({ error: "Admin não configurado" });
  }
  const user = await getUserById(req.session.userId);
  if (!user || user.email !== adminEmail) {
    return res.status(403).json({ error: "Sem permissão de administrador" });
  }
  next();
}

// ── Grades ─────────────────────────────────────────────────────────────────────
router.get("/grades", async (_req: Request, res: Response) => {
  const data = await getAllGrades();
  res.json(data);
});

router.get("/grades/:id", async (req: Request, res: Response) => {
  const grade = await getGradeById(Number(req.params.id));
  if (!grade) return res.status(404).json({ error: "Não encontrado" });
  res.json(grade);
});

router.get("/grades/:id/themes", async (req: Request, res: Response) => {
  const data = await getThemesByGrade(Number(req.params.id));
  res.json(data);
});

// ── Themes ─────────────────────────────────────────────────────────────────────
router.get("/themes/:id", async (req: Request, res: Response) => {
  const theme = await getThemeById(Number(req.params.id));
  if (!theme) return res.status(404).json({ error: "Não encontrado" });
  res.json(theme);
});

router.get("/themes/:id/lessons", async (req: Request, res: Response) => {
  const data = await getLessonsByTheme(Number(req.params.id));
  res.json(data);
});

// ── Lessons ────────────────────────────────────────────────────────────────────
router.get("/lessons/:id", async (req: Request, res: Response) => {
  const lesson = await getLessonById(Number(req.params.id));
  if (!lesson) return res.status(404).json({ error: "Não encontrado" });
  res.json(lesson);
});

// ── Students ───────────────────────────────────────────────────────────────────
router.get("/students", requireAuth, async (req: Request, res: Response) => {
  const data = await getStudentsByUser(req.session.userId!);
  res.json(data);
});

router.post("/students", requireAuth, async (req: Request, res: Response) => {
  const { name, currentGradeId, avatarEmoji } = req.body;
  if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
  const student = await createStudent(req.session.userId!, {
    name,
    currentGradeId,
    avatarEmoji,
  });
  res.json(student);
});

router.patch("/students/:id", requireAuth, async (req: Request, res: Response) => {
  const student = await getStudentById(Number(req.params.id));
  if (!student || student.userId !== req.session.userId) {
    return res.status(403).json({ error: "Sem permissão" });
  }
  const updated = await updateStudent(Number(req.params.id), req.body);
  res.json(updated);
});

router.delete("/students/:id", requireAuth, async (req: Request, res: Response) => {
  const student = await getStudentById(Number(req.params.id));
  if (!student || student.userId !== req.session.userId) {
    return res.status(403).json({ error: "Sem permissão" });
  }
  await deleteStudent(Number(req.params.id));
  res.json({ ok: true });
});

// ── Progress ───────────────────────────────────────────────────────────────────
router.get("/students/:id/progress", requireAuth, async (req: Request, res: Response) => {
  const student = await getStudentById(Number(req.params.id));
  if (!student || student.userId !== req.session.userId) {
    return res.status(403).json({ error: "Sem permissão" });
  }
  const data = await getProgressByStudent(Number(req.params.id));
  res.json(data);
});

router.get("/students/:id/stats", requireAuth, async (req: Request, res: Response) => {
  const student = await getStudentById(Number(req.params.id));
  if (!student || student.userId !== req.session.userId) {
    return res.status(403).json({ error: "Sem permissão" });
  }
  const stats = await getStudentStats(Number(req.params.id));
  res.json(stats);
});

router.post("/progress", requireAuth, async (req: Request, res: Response) => {
  const { studentId, lessonId, status, timeSpent, correctAnswers, totalAnswers, starsEarned } =
    req.body;
  if (!studentId || !lessonId) {
    return res.status(400).json({ error: "studentId e lessonId são obrigatórios" });
  }
  const student = await getStudentById(studentId);
  if (!student || student.userId !== req.session.userId) {
    return res.status(403).json({ error: "Sem permissão" });
  }
  const progress = await upsertLessonProgress(req.session.userId!, studentId, lessonId, {
    status,
    timeSpent,
    correctAnswers,
    totalAnswers,
    starsEarned,
  });
  res.json(progress);
});

// ── Admin ──────────────────────────────────────────────────────────────────────
router.get("/admin/check", requireAdmin as any, (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// Admin: list all content
router.get("/admin/grades", requireAdmin as any, async (_req: Request, res: Response) => {
  const data = await getAllGrades();
  res.json(data);
});

router.get("/admin/themes", requireAdmin as any, async (_req: Request, res: Response) => {
  const data = await getAllThemes();
  res.json(data);
});

router.get("/admin/lessons", requireAdmin as any, async (_req: Request, res: Response) => {
  const data = await getAllLessons();
  res.json(data);
});

// Admin: Grades CRUD
router.post("/admin/grades", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const grade = await createGrade(req.body);
    res.json(grade);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar ano" });
  }
});

router.patch("/admin/grades/:id", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const grade = await updateGrade(Number(req.params.id), req.body);
    res.json(grade);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar ano" });
  }
});

router.delete("/admin/grades/:id", requireAdmin as any, async (req: Request, res: Response) => {
  await deleteGrade(Number(req.params.id));
  res.json({ ok: true });
});

// Admin: Themes CRUD
router.post("/admin/themes", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const theme = await createTheme(req.body);
    res.json(theme);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar tema" });
  }
});

router.patch("/admin/themes/:id", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const theme = await updateTheme(Number(req.params.id), req.body);
    res.json(theme);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar tema" });
  }
});

router.delete("/admin/themes/:id", requireAdmin as any, async (req: Request, res: Response) => {
  await deleteTheme(Number(req.params.id));
  res.json({ ok: true });
});

// Admin: Lessons CRUD
router.post("/admin/lessons", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const lesson = await createLesson(req.body);
    res.json(lesson);
  } catch (err) {
    res.status(400).json({ error: "Erro ao criar lição" });
  }
});

router.patch("/admin/lessons/:id", requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const lesson = await updateLesson(Number(req.params.id), req.body);
    res.json(lesson);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar lição" });
  }
});

router.delete("/admin/lessons/:id", requireAdmin as any, async (req: Request, res: Response) => {
  await deleteLesson(Number(req.params.id));
  res.json({ ok: true });
});

export default router;
