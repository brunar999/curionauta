import type { LessonProgress } from "@shared/schema";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earned: boolean;
  progress?: number;   // 0-100
  progressLabel?: string;
}

export function computeAchievements(
  progress: LessonProgress[],
  totalThemeLessons: Record<number, number> = {}
): Achievement[] {
  const completed = progress.filter((p) => p.status === "completed");
  const totalTime = progress.reduce((s, p) => s + (p.timeSpent ?? 0), 0);
  const perfectQuizzes = completed.filter(
    (p) => p.totalAnswers && p.totalAnswers > 0 && p.correctAnswers === p.totalAnswers
  );

  // Unique themes started (via lessonId — we don't have themeId here, so use lesson count as proxy)
  const completedCount = completed.length;
  const totalCount = progress.length;

  const list: Achievement[] = [
    {
      id: "first_step",
      emoji: "🌱",
      title: "Primeiro Passo",
      description: "Conclui a tua primeira lição",
      earned: completedCount >= 1,
      progress: Math.min(100, completedCount * 100),
      progressLabel: `${completedCount}/1`,
    },
    {
      id: "five_lessons",
      emoji: "🔥",
      title: "Em Chamas",
      description: "Conclui 5 lições",
      earned: completedCount >= 5,
      progress: Math.min(100, (completedCount / 5) * 100),
      progressLabel: `${completedCount}/5`,
    },
    {
      id: "ten_lessons",
      emoji: "📚",
      title: "Estudioso",
      description: "Conclui 10 lições",
      earned: completedCount >= 10,
      progress: Math.min(100, (completedCount / 10) * 100),
      progressLabel: `${completedCount}/10`,
    },
    {
      id: "twenty_lessons",
      emoji: "🎓",
      title: "Especialista",
      description: "Conclui 20 lições",
      earned: completedCount >= 20,
      progress: Math.min(100, (completedCount / 20) * 100),
      progressLabel: `${completedCount}/20`,
    },
    {
      id: "perfect_quiz",
      emoji: "🎯",
      title: "Quiz Perfeito",
      description: "Responde corretamente a todas as perguntas de um quiz",
      earned: perfectQuizzes.length >= 1,
      progress: Math.min(100, perfectQuizzes.length * 100),
      progressLabel: `${perfectQuizzes.length}/1`,
    },
    {
      id: "three_perfect",
      emoji: "⭐",
      title: "Estrela de Ouro",
      description: "Faz 3 quizzes perfeitos",
      earned: perfectQuizzes.length >= 3,
      progress: Math.min(100, (perfectQuizzes.length / 3) * 100),
      progressLabel: `${perfectQuizzes.length}/3`,
    },
    {
      id: "thirty_minutes",
      emoji: "⏱️",
      title: "Persistente",
      description: "Estuda durante 30 minutos no total",
      earned: totalTime >= 1800,
      progress: Math.min(100, (totalTime / 1800) * 100),
      progressLabel: `${Math.floor(totalTime / 60)}/30 min`,
    },
    {
      id: "two_hours",
      emoji: "🏅",
      title: "Dedicado",
      description: "Estuda durante 2 horas no total",
      earned: totalTime >= 7200,
      progress: Math.min(100, (totalTime / 7200) * 100),
      progressLabel: `${Math.floor(totalTime / 60)}/120 min`,
    },
    {
      id: "explorer",
      emoji: "🧭",
      title: "Explorador",
      description: "Inicia lições em 3 temas diferentes",
      earned: totalCount >= 3,
      progress: Math.min(100, (totalCount / 3) * 100),
      progressLabel: `${totalCount}/3`,
    },
    {
      id: "curious",
      emoji: "🔬",
      title: "Curioso",
      description: "Inicia lições em 5 temas diferentes",
      earned: totalCount >= 5,
      progress: Math.min(100, (totalCount / 5) * 100),
      progressLabel: `${totalCount}/5`,
    },
    {
      id: "curionauta",
      emoji: "🦦",
      title: "Verdadeiro CurioNauta",
      description: "Conclui 15 lições — és um verdadeiro explorador!",
      earned: completedCount >= 15,
      progress: Math.min(100, (completedCount / 15) * 100),
      progressLabel: `${completedCount}/15`,
    },
    {
      id: "champion",
      emoji: "🏆",
      title: "Campeão",
      description: "Ganha 5 quizzes perfeitos",
      earned: perfectQuizzes.length >= 5,
      progress: Math.min(100, (perfectQuizzes.length / 5) * 100),
      progressLabel: `${perfectQuizzes.length}/5`,
    },
  ];

  return list;
}
