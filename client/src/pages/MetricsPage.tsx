import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useActiveStudent } from "@/context/StudentContext";
import { useStudentStats, useStudentProgress } from "@/hooks/useProgress";
import { apiFetch } from "@/lib/queryClient";
import { formatTime } from "@/lib/utils";
import type { Lesson } from "@shared/schema";

export default function MetricsPage() {
  const { activeStudent } = useActiveStudent();
  const { data: stats } = useStudentStats(activeStudent?.id);
  const { data: progress } = useStudentProgress(activeStudent?.id);

  const completed = progress?.filter((p) => p.status === "completed") ?? [];
  const inProgress = progress?.filter((p) => p.status === "in_progress") ?? [];

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: "32px 28px 60px" }}>
        <nav style={{ fontSize: 14, color: "var(--ink-mute)", marginBottom: 20, fontFamily: "Fredoka" }}>
          <Link href="/dashboard" style={{ color: "var(--purple-600)" }}>Início</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span>Métricas</span>
        </nav>

        <div className="chip chip-green" style={{ marginBottom: 12 }}>📊 Progresso</div>
        <h1 style={{ fontSize: 38, marginBottom: 8 }}>Métricas de {activeStudent?.name}</h1>
        <p style={{ color: "var(--ink-mute)", marginBottom: 36, fontSize: 16 }}>
          O teu histórico de aprendizagem detalhado.
        </p>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { icon: "✅", color: "var(--green-500)", label: "Concluídas", value: `${stats?.completedLessons ?? 0}` },
            { icon: "🔄", color: "var(--yellow)", label: "Em progresso", value: `${stats?.inProgressLessons ?? 0}` },
            { icon: "⏱️", color: "var(--purple-600)", label: "Tempo total", value: formatTime(stats?.totalTimeSeconds ?? 0) },
            { icon: "📚", color: "var(--coral)", label: "Lições iniciadas", value: `${stats?.totalLessons ?? 0}` },
          ].map((s) => (
            <div key={s.label} className="sticker-card" style={{ padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "Fredoka", fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--ink-mute)", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Completed lessons */}
        {completed.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>✅ Lições concluídas</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {completed.map((p) => (
                <div key={p.id} className="card" style={{ padding: "16px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ fontSize: 28 }}>✅</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Fredoka", fontSize: 16, fontWeight: 600 }}>Lição {p.lessonId}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-mute)" }}>
                      Tempo: {formatTime(p.timeSpent ?? 0)}
                      {p.totalAnswers && p.totalAnswers > 0 && (
                        <span style={{ marginLeft: 12 }}>
                          <span style={{ color: "var(--green-500)", fontWeight: 700 }}>✓ {p.correctAnswers}</span>
                          {" / "}
                          <span style={{ color: "var(--coral)", fontWeight: 700 }}>✗ {(p.totalAnswers ?? 0) - (p.correctAnswers ?? 0)}</span>
                          {" respostas"}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/lesson/${p.lessonId}`}>
                    <button className="btn btn-ghost btn-sm">Rever →</button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* In progress */}
        {inProgress.length > 0 && (
          <section>
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>🔄 Em progresso</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {inProgress.map((p) => (
                <div key={p.id} className="card" style={{ padding: "16px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ fontSize: 28 }}>🔄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Fredoka", fontSize: 16, fontWeight: 600 }}>Lição {p.lessonId}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-mute)" }}>
                      Tempo: {formatTime(p.timeSpent ?? 0)}
                    </div>
                  </div>
                  <Link href={`/lesson/${p.lessonId}`}>
                    <button className="btn btn-primary btn-sm">Continuar →</button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {!progress?.length && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--ink-mute)" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📊</div>
            <h3 style={{ fontSize: 22, marginBottom: 8, color: "var(--ink)" }}>Ainda sem dados</h3>
            <p>Começa a estudar para ver as tuas métricas aqui!</p>
            <Link href="/licoes">
              <button className="btn btn-primary" style={{ marginTop: 20 }}>Ver lições →</button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
