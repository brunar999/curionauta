import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { apiFetch } from "@/lib/queryClient";
import { useUpdateProgress } from "@/hooks/useProgress";
import { useActiveStudent } from "@/context/StudentContext";
import MonthsQuiz from "@/components/lessons/MonthsQuiz";
import SeasonsQuiz from "@/components/lessons/SeasonsQuiz";
import AnimalsDragDrop from "@/components/lessons/AnimalsDragDrop";
import TTSButton from "@/components/TTSButton";
import type { Lesson, Theme, Grade } from "@shared/schema";

interface LessonPart {
  type: "content" | "component";
  title: string;
  content?: string;
  componentId?: string;
}

interface Props {
  lessonId: number;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function LessonContent({ html }: { html: string }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <TTSButton text={stripHtml(html)} />
      </div>
      <div
        className="lesson-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}

function InteractiveComponent({
  componentId,
  lessonId,
  onComplete,
}: {
  componentId: string;
  lessonId: number;
  onComplete: () => void;
}) {
  switch (componentId) {
    case "MonthsQuiz":
      return <MonthsQuiz lessonId={lessonId} onComplete={onComplete} />;
    case "SeasonsQuiz":
      return <SeasonsQuiz lessonId={lessonId} onComplete={onComplete} />;
    case "AnimalsDragDrop":
      return <AnimalsDragDrop lessonId={lessonId} onComplete={onComplete} />;
    default:
      return (
        <div style={{ textAlign: "center", padding: 40, color: "var(--ink-mute)" }}>
          Componente <strong>{componentId}</strong> não encontrado.
        </div>
      );
  }
}

export default function LessonPage({ lessonId }: Props) {
  const [, navigate] = useLocation();
  const [currentPart, setCurrentPart] = useState(0);
  const [completed, setCompleted] = useState(false);

  const { data: lesson } = useQuery<Lesson>({
    queryKey: ["lesson", lessonId],
    queryFn: () => apiFetch(`/api/lessons/${lessonId}`),
  });

  const { data: theme } = useQuery<Theme>({
    queryKey: ["theme", lesson?.themeId],
    queryFn: () => apiFetch(`/api/themes/${lesson?.themeId}`),
    enabled: !!lesson?.themeId,
  });

  const { data: grade } = useQuery<Grade>({
    queryKey: ["grade", theme?.gradeId],
    queryFn: () => apiFetch(`/api/grades/${theme?.gradeId}`),
    enabled: !!theme?.gradeId,
  });

  const { activeStudent } = useActiveStudent();
  const updateProgress = useUpdateProgress();

  // Mark as in_progress when lesson starts
  useEffect(() => {
    if (activeStudent && lessonId) {
      updateProgress.mutate({
        studentId: activeStudent.id,
        lessonId,
        status: "in_progress",
      });
    }
  }, [activeStudent?.id, lessonId]);

  if (!lesson) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "Fredoka", fontSize: 22, color: "var(--purple-600)" }}>A carregar lição… 🦦</div>
      </div>
    );
  }

  const parts: LessonPart[] = lesson.parts
    ? (lesson.parts as LessonPart[])
    : lesson.content
    ? [{ type: "content", title: lesson.title, content: lesson.content }]
    : [];

  const totalParts = parts.length;
  const progress = totalParts > 0 ? ((currentPart + 1) / totalParts) * 100 : 100;

  function handlePartComplete() {
    if (currentPart + 1 >= totalParts) {
      // Last part done
      handleLessonComplete();
    } else {
      setCurrentPart((prev) => prev + 1);
    }
  }

  function handleLessonComplete() {
    if (!activeStudent) return;
    setCompleted(true);
    updateProgress.mutate({
      studentId: activeStudent.id,
      lessonId,
      status: "completed",
      starsEarned: 3,
    });
  }

  // Completion screen
  if (completed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", flexDirection: "column" }}>
        {/* Minimal header */}
        <div style={{ background: "white", borderBottom: "2px solid var(--line)", padding: "14px 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 22, color: "var(--purple-700)" }}>
              CurioNauta 🦦
            </span>
          </div>
        </div>

        <div className="container" style={{ padding: "60px 28px", textAlign: "center", flex: 1 }}>
          <div className="pop-in" style={{ fontSize: 120, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 44, marginBottom: 12 }}>Lição concluída!</h1>
          <p style={{ fontSize: 18, color: "var(--ink-soft)", marginBottom: 36 }}>
            Que curionauta! Ganhaste estrelas e medalha.
          </p>

          <div className="sticker-card pop-in" style={{ padding: 32, maxWidth: 460, margin: "0 auto 28px", background: "white" }}>
            <div style={{ fontSize: 44, letterSpacing: 8, marginBottom: 12 }}>⭐⭐⭐</div>
            <div style={{ fontFamily: "Fredoka", fontSize: 20, marginBottom: 20 }}>3 de 3 estrelas</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { icon: "⭐", value: "+15", label: "Estrelas" },
                { icon: "📖", value: "+1", label: "Lição" },
                { icon: "🏆", value: "+1", label: "Conquista" },
              ].map((r) => (
                <div key={r.label} style={{
                  background: "var(--cream)", borderRadius: 14, padding: "12px 8px",
                  border: "2px solid var(--line)",
                }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontFamily: "Fredoka", fontSize: 18, fontWeight: 600 }}>{r.value}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            {theme && (
              <Link href={`/theme/${theme.id}`}>
                <button className="btn btn-ghost btn-sm">← Voltar ao tema</button>
              </Link>
            )}
            <Link href="/dashboard">
              <button className="btn btn-green btn-lg">Ir ao início →</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentPartData = parts[currentPart];
  const isLastPart = currentPart === totalParts - 1;
  const isContentPart = currentPartData?.type === "content";

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", flexDirection: "column" }}>
      {/* Lesson header */}
      <header style={{
        background: "white", borderBottom: "2px solid var(--line)",
        padding: "14px 0", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center" }}>
          <Link href={theme ? `/theme/${theme.id}` : "/dashboard"}>
            <button className="btn btn-ghost btn-sm">✕ Sair</button>
          </Link>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-mute)", marginBottom: 6, fontFamily: "Fredoka" }}>
              <span>{lesson.title}</span>
              {totalParts > 1 && <span>{currentPart + 1}/{totalParts}</span>}
            </div>
            <div className="progress" style={{ height: 10 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <TTSButton text={lesson.title} />
            <span className="chip" style={{ background: "var(--green-100)", color: "var(--green-600)", fontSize: 12 }}>
              ⏱ {lesson.duration} min
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container" style={{ padding: "36px 28px 60px", maxWidth: 880 }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: "var(--ink-mute)", marginBottom: 20, fontFamily: "Fredoka" }}>
          <Link href="/dashboard" style={{ color: "var(--purple-600)" }}>Início</Link>
          <span style={{ margin: "0 6px" }}>›</span>
          {grade && <><Link href={`/grade/${grade.id}`} style={{ color: "var(--purple-600)" }}>{grade.name}</Link><span style={{ margin: "0 6px" }}>›</span></>}
          {theme && <><Link href={`/theme/${theme.id}`} style={{ color: "var(--purple-600)" }}>{theme.shortTitle ?? theme.title}</Link><span style={{ margin: "0 6px" }}>›</span></>}
          <span>{lesson.title}</span>
        </nav>

        {/* Part navigation tabs (if multi-part) */}
        {totalParts > 1 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {parts.map((part, i) => (
              <button
                key={i}
                onClick={() => i <= currentPart && setCurrentPart(i)}
                style={{
                  padding: "8px 16px", borderRadius: 999, cursor: i <= currentPart ? "pointer" : "default",
                  fontFamily: "Fredoka", fontWeight: 600, fontSize: 14,
                  background: i === currentPart ? "var(--purple-600)" : i < currentPart ? "var(--green-100)" : "var(--line)",
                  color: i === currentPart ? "white" : i < currentPart ? "var(--green-600)" : "var(--ink-mute)",
                  border: "none",
                  opacity: i > currentPart ? 0.5 : 1,
                }}
              >
                {i < currentPart ? "✓ " : ""}{part.title}
              </button>
            ))}
          </div>
        )}

        {/* Current part content */}
        {currentPartData && (
          <div className="sticker-card" style={{ padding: "32px 40px", background: "white" }}>
            {currentPartData.type === "content" && currentPartData.content ? (
              <>
                <LessonContent html={currentPartData.content} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
                  <button
                    className={`btn ${isLastPart ? "btn-green" : "btn-primary"} btn-lg`}
                    onClick={isLastPart ? handleLessonComplete : handlePartComplete}
                  >
                    {isLastPart ? "Concluir lição →" : `Próximo: ${parts[currentPart + 1]?.title} →`}
                  </button>
                </div>
              </>
            ) : currentPartData.type === "component" && currentPartData.componentId ? (
              <InteractiveComponent
                componentId={currentPartData.componentId}
                lessonId={lessonId}
                onComplete={isLastPart ? handleLessonComplete : handlePartComplete}
              />
            ) : null}
          </div>
        )}

        {/* Single-part content-only lesson */}
        {totalParts === 0 && lesson.content && (
          <div className="sticker-card" style={{ padding: "32px 40px", background: "white" }}>
            <LessonContent html={lesson.content} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
              <button className="btn btn-green btn-lg" onClick={handleLessonComplete}>
                Concluir lição →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
