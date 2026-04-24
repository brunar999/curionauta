import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useActiveStudent } from "@/context/StudentContext";
import { useStudentProgress } from "@/hooks/useProgress";
import { computeAchievements } from "@/lib/achievements";

function AchievementCard({
  emoji,
  title,
  description,
  earned,
  progress,
  progressLabel,
}: {
  emoji: string;
  title: string;
  description: string;
  earned: boolean;
  progress?: number;
  progressLabel?: string;
}) {
  return (
    <div
      style={{
        background: earned ? "white" : "var(--paper)",
        borderRadius: 22,
        border: `3px solid ${earned ? "var(--purple-700)" : "var(--line)"}`,
        boxShadow: earned ? "0 6px 0 var(--purple-700)" : "none",
        padding: "22px 20px",
        opacity: earned ? 1 : 0.6,
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {earned && (
        <div style={{
          position: "absolute", top: 10, right: 12,
          background: "var(--green-500)", color: "white",
          borderRadius: 999, fontSize: 11, fontWeight: 700,
          fontFamily: "Fredoka", padding: "3px 10px",
          border: "2px solid #0F6B55",
        }}>
          ✓ Conquistado
        </div>
      )}

      <div style={{ fontSize: 48, marginBottom: 10, filter: earned ? "none" : "grayscale(1)" }}>
        {emoji}
      </div>
      <h3 style={{ fontSize: 18, marginBottom: 4, color: earned ? "var(--ink)" : "var(--ink-mute)" }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: "var(--ink-mute)", margin: "0 0 12px" }}>
        {description}
      </p>

      {!earned && progress !== undefined && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-mute)", marginBottom: 4, fontFamily: "Fredoka" }}>
            <span>Progresso</span>
            <span>{progressLabel}</span>
          </div>
          <div className="progress" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AchievementsPage() {
  const { activeStudent } = useActiveStudent();
  const { data: progress } = useStudentProgress(activeStudent?.id);

  const achievements = computeAchievements(progress ?? []);
  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: "32px 28px 60px" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 14, color: "var(--ink-mute)", marginBottom: 20, fontFamily: "Fredoka" }}>
          <Link href="/dashboard" style={{ color: "var(--purple-600)" }}>Início</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span>Conquistas</span>
        </nav>

        {/* Header */}
        <div className="sticker-card hero-pattern" style={{
          padding: "32px 36px", marginBottom: 36,
          background: "linear-gradient(135deg, var(--yellow), #FFB020)",
          border: "3px solid var(--purple-700)",
        }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ fontSize: 72 }}>🏆</div>
            <div>
              <h1 style={{ fontSize: 36, marginBottom: 6, color: "var(--purple-700)" }}>
                Conquistas de {activeStudent?.name}
              </h1>
              <p style={{ margin: 0, fontSize: 16, color: "var(--purple-700)", opacity: 0.85 }}>
                {earned.length} de {achievements.length} conquistas desbloqueadas
              </p>
              {/* Overall progress bar */}
              <div style={{ marginTop: 14, maxWidth: 320 }}>
                <div className="progress" style={{ height: 12, background: "rgba(74,26,153,0.2)" }}>
                  <div style={{
                    height: "100%", borderRadius: 999,
                    background: "var(--purple-700)",
                    width: `${(earned.length / achievements.length) * 100}%`,
                    transition: "width 0.6s cubic-bezier(.2,.8,.2,1)",
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earned */}
        {earned.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, marginBottom: 18 }}>
              ✅ Conquistadas ({earned.length})
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {earned.map((a) => (
                <AchievementCard key={a.id} {...a} />
              ))}
            </div>
          </section>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <section>
            <h2 style={{ fontSize: 24, marginBottom: 18 }}>
              🔒 Por desbloquear ({locked.length})
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {locked.map((a) => (
                <AchievementCard key={a.id} {...a} />
              ))}
            </div>
          </section>
        )}

        {!activeStudent && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🏆</div>
            <h3 style={{ fontSize: 22, marginBottom: 8 }}>Seleciona um estudante</h3>
            <p style={{ color: "var(--ink-mute)" }}>Para ver as conquistas, escolhe um perfil de estudante.</p>
            <Link href="/dashboard">
              <button className="btn btn-primary" style={{ marginTop: 20 }}>Ir ao início →</button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
