import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/queryClient";
import { useStudentProgress } from "@/hooks/useProgress";
import { useActiveStudent } from "@/context/StudentContext";
import type { Grade, Theme, LessonProgress } from "@shared/schema";

interface Props {
  gradeId: number;
}

function ThemeCard({
  theme,
  progress,
  totalLessons,
}: {
  theme: Theme;
  progress: LessonProgress[];
  totalLessons: number;
}) {
  const completed = progress.filter((p) => p.status === "completed").length;
  const pct = totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

  return (
    <Link href={`/theme/${theme.id}`}>
      <div
        className="card card-hover"
        style={{ padding: 24, background: theme.bgColor ?? "var(--paper)", height: "100%" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
          <div style={{ fontSize: 44 }}>{theme.icon}</div>
          {completed === totalLessons && totalLessons > 0 && (
            <span style={{ fontSize: 20 }}>✅</span>
          )}
        </div>
        <div style={{
          fontFamily: "Fredoka", fontSize: 11, textTransform: "uppercase",
          letterSpacing: "0.08em", color: theme.accentColor ?? "var(--purple-600)",
          fontWeight: 500, marginBottom: 4,
        }}>
          Tema {theme.order}
        </div>
        <h3 style={{ fontSize: 18, marginBottom: 4 }}>{theme.title}</h3>
        <p style={{ fontSize: 13, color: "var(--ink-mute)", marginBottom: 14, minHeight: 36 }}>
          {theme.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="progress" style={{ flex: 1, height: 8 }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: theme.accentColor ?? undefined }} />
          </div>
          <span style={{ fontFamily: "Fredoka", fontSize: 13, fontWeight: 600, color: "var(--ink-mute)", whiteSpace: "nowrap" }}>
            {completed}/{totalLessons}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function GradePage({ gradeId }: Props) {
  const { data: grade } = useQuery<Grade>({
    queryKey: ["grade", gradeId],
    queryFn: () => apiFetch(`/api/grades/${gradeId}`),
  });

  const { data: themes } = useQuery<Theme[]>({
    queryKey: ["themes", gradeId],
    queryFn: () => apiFetch(`/api/grades/${gradeId}/themes`),
  });

  const { activeStudent } = useActiveStudent();
  const { data: allProgress } = useStudentProgress(activeStudent?.id);

  function getThemeProgress(themeId: number, lessons: number[]): LessonProgress[] {
    if (!allProgress) return [];
    return allProgress.filter((p) => lessons.includes(p.lessonId));
  }

  const gradeIcons = ["🌱", "🌿", "🌳", "🚀"];
  const gradeIdx = (grade?.number ?? 1) - 1;

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: "32px 28px 60px" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 14, color: "var(--ink-mute)", marginBottom: 20, fontFamily: "Fredoka" }}>
          <Link href="/dashboard" style={{ color: "var(--purple-600)" }}>Início</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href="/licoes" style={{ color: "var(--purple-600)" }}>Lições</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span>{grade?.name}</span>
        </nav>

        {/* Grade header */}
        <div className="sticker-card hero-pattern" style={{
          padding: "32px 36px", marginBottom: 36,
          background: "linear-gradient(135deg, var(--purple-600), var(--purple-500))",
          color: "white",
        }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ fontSize: 80 }}>{gradeIcons[gradeIdx] ?? "📚"}</div>
            <div>
              <div className="chip" style={{ background: "rgba(255,255,255,0.25)", color: "white", marginBottom: 8 }}>
                Estudo do Meio
              </div>
              <h1 style={{ fontSize: 36, color: "white", marginBottom: 6 }}>{grade?.name}</h1>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: 16 }}>
                {themes?.length ?? 0} temas · Ciências para crianças dos {6 + gradeIdx} anos
              </p>
            </div>
          </div>
        </div>

        {/* Themes grid */}
        <h2 style={{ fontSize: 26, marginBottom: 20 }}>Temas disponíveis</h2>
        {!themes ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--ink-mute)" }}>A carregar…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {themes.map((t) => (
              <ThemeCard
                key={t.id}
                theme={t}
                progress={getThemeProgress(t.id, [])}
                totalLessons={0}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
