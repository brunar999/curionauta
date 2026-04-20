import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/queryClient";
import { useStudentProgress } from "@/hooks/useProgress";
import { useActiveStudent } from "@/context/StudentContext";
import type { Theme, Lesson, Grade, LessonProgress } from "@shared/schema";

interface Props {
  themeId: number;
}

function LessonRow({
  lesson,
  index,
  progress,
  accentColor,
}: {
  lesson: Lesson;
  index: number;
  progress: LessonProgress | undefined;
  accentColor: string;
}) {
  const status = progress?.status ?? (index === 0 ? "current" : "locked");
  const isClickable = status !== "locked";

  const statusColor =
    status === "completed" ? "var(--green-500)"
    : status === "current" ? accentColor
    : status === "in_progress" ? "var(--yellow)"
    : "var(--line)";

  const typeLabel =
    lesson.type === "quiz" ? "🎯 Quiz"
    : lesson.type === "drag-drop" ? "✋ Jogo"
    : lesson.type === "mixed" ? "🎮 Interativo"
    : "📖 Lição";

  const typeChipClass =
    lesson.type === "quiz" ? "chip-coral"
    : lesson.type === "drag-drop" || lesson.type === "mixed" ? "chip-yellow"
    : "chip";

  return (
    <Link href={isClickable ? `/lesson/${lesson.id}` : "#"}>
      <div
        className={isClickable ? "card-hover" : ""}
        style={{
          position: "relative", background: "white", borderRadius: 22, padding: "18px 22px",
          display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center",
          border: `3px solid ${status === "current" ? accentColor : "var(--purple-700)"}`,
          boxShadow: `0 5px 0 ${status === "current" ? accentColor : "var(--purple-700)"}`,
          opacity: status === "locked" ? 0.55 : 1,
          cursor: isClickable ? "pointer" : "default",
          marginBottom: 14,
        }}
      >
        {/* Number/status circle */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: statusColor, display: "grid", placeItems: "center",
          color: "white", fontFamily: "Fredoka", fontSize: 20, fontWeight: 600,
          border: "3px solid var(--purple-700)",
          flexShrink: 0,
        }}>
          {status === "completed" ? "✓" : status === "locked" ? "🔒" : lesson.order}
        </div>

        {/* Content */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span className={`chip ${typeChipClass}`} style={{ fontSize: 11, padding: "3px 9px" }}>{typeLabel}</span>
            <span className="chip chip-green" style={{ fontSize: 11, padding: "3px 9px" }}>⏱ {lesson.duration} min</span>
            {status === "current" && (
              <span className="chip chip-coral" style={{ fontSize: 11, padding: "3px 9px" }}>▶ A seguir</span>
            )}
            {status === "in_progress" && (
              <span className="chip chip-yellow" style={{ fontSize: 11, padding: "3px 9px" }}>⏳ Em progresso</span>
            )}
          </div>
          <h3 style={{ fontSize: 18, color: "var(--ink)" }}>{lesson.title}</h3>
          {status === "in_progress" && (
            <div className="progress" style={{ marginTop: 8, height: 6 }}>
              <div className="progress-fill" style={{ width: "40%" }} />
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ flexShrink: 0 }}>
          {status === "completed" && (
            <div style={{ fontSize: 18, color: "var(--yellow)" }}>⭐⭐⭐</div>
          )}
          {status === "current" && (
            <span className="btn btn-sm btn-primary">Começar →</span>
          )}
          {status === "in_progress" && (
            <span className="btn btn-sm btn-primary">Continuar →</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ThemePage({ themeId }: Props) {
  const { data: theme } = useQuery<Theme>({
    queryKey: ["theme", themeId],
    queryFn: () => apiFetch(`/api/themes/${themeId}`),
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["lessons", themeId],
    queryFn: () => apiFetch(`/api/themes/${themeId}/lessons`),
  });

  const { data: grade } = useQuery<Grade>({
    queryKey: ["grade", theme?.gradeId],
    queryFn: () => apiFetch(`/api/grades/${theme?.gradeId}`),
    enabled: !!theme?.gradeId,
  });

  const { activeStudent } = useActiveStudent();
  const { data: allProgress } = useStudentProgress(activeStudent?.id);

  function getLessonProgress(lessonId: number): LessonProgress | undefined {
    return allProgress?.find((p) => p.lessonId === lessonId);
  }

  const completedCount = lessons?.filter((l) => getLessonProgress(l.id)?.status === "completed").length ?? 0;
  const totalCount = lessons?.length ?? 0;
  const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: "32px 28px 60px" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 14, color: "var(--ink-mute)", marginBottom: 20, fontFamily: "Fredoka" }}>
          <Link href="/dashboard" style={{ color: "var(--purple-600)" }}>Início</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          {grade && (
            <>
              <Link href={`/grade/${grade.id}`} style={{ color: "var(--purple-600)" }}>{grade.name}</Link>
              <span style={{ margin: "0 8px" }}>›</span>
            </>
          )}
          <span>{theme?.shortTitle ?? theme?.title}</span>
        </nav>

        {/* Theme header */}
        {theme && (
          <div style={{
            background: theme.bgColor ?? "var(--paper)",
            borderRadius: 28, padding: "32px 36px", marginBottom: 36,
            border: "3px solid var(--purple-700)", boxShadow: "0 8px 0 var(--purple-700)",
            display: "flex", gap: 24, alignItems: "center",
          }}>
            <div style={{ fontSize: 80 }}>{theme.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "Fredoka", fontSize: 12, color: theme.accentColor ?? "var(--purple-600)",
                textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, marginBottom: 4,
              }}>
                Tema {theme.order}
              </div>
              <h1 style={{ fontSize: 34, marginBottom: 6 }}>{theme.title}</h1>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", maxWidth: 520, marginBottom: 14, margin: "0 0 14px" }}>
                {theme.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="progress" style={{ flex: 1, maxWidth: 280, height: 12 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: theme.accentColor ?? undefined }} />
                </div>
                <strong style={{ fontFamily: "Fredoka", color: "var(--ink)", fontSize: 16 }}>
                  {completedCount}/{totalCount} lições
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Lessons */}
        <h2 style={{ fontSize: 24, marginBottom: 20 }}>Percurso de lições</h2>

        {!lessons ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--ink-mute)" }}>A carregar…</div>
        ) : (
          <div style={{ position: "relative", paddingLeft: 36 }}>
            {/* Vertical connector line */}
            <div style={{
              position: "absolute", left: 22, top: 26, bottom: 26, width: 6,
              background: "repeating-linear-gradient(to bottom, var(--purple-400) 0, var(--purple-400) 10px, transparent 10px, transparent 20px)",
              borderRadius: 3,
            }} />
            {lessons.map((lesson, i) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={i}
                progress={getLessonProgress(lesson.id)}
                accentColor={theme?.accentColor ?? "var(--purple-600)"}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
