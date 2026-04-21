import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useActiveStudent } from "@/context/StudentContext";
import { useStudentStats, useStudentProgress } from "@/hooks/useProgress";
import { apiFetch } from "@/lib/queryClient";
import { formatTime } from "@/lib/utils";
import { computeAchievements } from "@/lib/achievements";
import type { Student, Grade } from "@shared/schema";

// ── Student picker modal ───────────────────────────────────────────────────────
function StudentPickerModal({
  students,
  onSelect,
  onCreateNew,
}: {
  students: Student[];
  onSelect: (s: Student) => void;
  onCreateNew: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,20,50,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    }}>
      <div className="sticker-card" style={{ padding: 36, maxWidth: 420, width: "100%", background: "white" }}>
        <h2 style={{ fontSize: 28, marginBottom: 8, textAlign: "center" }}>Quem está a estudar? 📚</h2>
        <p style={{ color: "var(--ink-mute)", textAlign: "center", marginBottom: 28, fontSize: 15 }}>
          Escolhe o teu perfil para continuar
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {students.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="card card-hover"
              style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%" }}
            >
              <div style={{ fontSize: 36 }}>{s.avatarEmoji ?? "🧒"}</div>
              <div>
                <div style={{ fontFamily: "Fredoka", fontSize: 20, fontWeight: 600 }}>{s.name}</div>
              </div>
              <span style={{ marginLeft: "auto", color: "var(--purple-600)" }}>→</span>
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onCreateNew} style={{ width: "100%", justifyContent: "center" }}>
          + Adicionar estudante
        </button>
      </div>
    </div>
  );
}

// ── Create student modal ───────────────────────────────────────────────────────
function CreateStudentModal({ onClose, onCreated }: { onClose: () => void; onCreated: (s: Student) => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [gradeId, setGradeId] = useState<number | undefined>();
  const [avatarEmoji, setAvatarEmoji] = useState("🧒");

  const { data: grades } = useQuery<Grade[]>({
    queryKey: ["grades"],
    queryFn: () => apiFetch("/api/grades"),
  });

  const mutation = useMutation({
    mutationFn: (data: { name: string; currentGradeId?: number; avatarEmoji: string }) =>
      apiFetch<Student>("/api/students", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (student) => {
      qc.invalidateQueries({ queryKey: ["students"] });
      onCreated(student);
    },
  });

  const AVATARS = ["🧒", "👦", "👧", "🧑", "🦊", "🐼", "🐨", "🦁", "🐸", "🦋", "⭐", "🌟"];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,20,50,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    }}>
      <div className="sticker-card" style={{ padding: 36, maxWidth: 440, width: "100%", background: "white" }}>
        <h2 style={{ fontSize: 26, marginBottom: 24 }}>Novo estudante 🎉</h2>

        <div style={{ marginBottom: 18 }}>
          <label className="form-label">Nome</label>
          <input className="form-input" type="text" placeholder="Ex: Maria" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label className="form-label">Ano escolar</label>
          <select
            className="form-input"
            value={gradeId ?? ""}
            onChange={(e) => setGradeId(e.target.value ? Number(e.target.value) : undefined)}
            style={{ paddingLeft: 12 }}
          >
            <option value="">Selecionar…</option>
            {grades?.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label className="form-label">Avatar</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatarEmoji(emoji)}
                style={{
                  fontSize: 28, padding: 8, borderRadius: 12, cursor: "pointer",
                  background: avatarEmoji === emoji ? "var(--purple-100)" : "white",
                  border: `2px solid ${avatarEmoji === emoji ? "var(--purple-600)" : "var(--line)"}`,
                  transition: "all 0.12s",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancelar</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => mutation.mutate({ name, currentGradeId: gradeId, avatarEmoji })}
            disabled={!name || mutation.isPending}
            style={{ flex: 2, justifyContent: "center" }}
          >
            {mutation.isPending ? "A criar…" : "Criar perfil →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, color, label, value }: { icon: string; color: string; label: string; value: string }) {
  return (
    <div className="card" style={{ padding: "18px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 22, color }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--ink-mute)", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [, navigate] = useLocation();
  const { activeStudent, setActiveStudent } = useActiveStudent();
  const [showPicker, setShowPicker] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const { data: students, isLoading: loadingStudents } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: () => apiFetch("/api/students"),
  });

  const { data: grades } = useQuery<Grade[]>({
    queryKey: ["grades"],
    queryFn: () => apiFetch("/api/grades"),
  });

  const { data: stats } = useStudentStats(activeStudent?.id);
  const { data: progress } = useStudentProgress(activeStudent?.id);

  // Auto-show picker if no active student
  const needsPicker = !loadingStudents && students && students.length > 0 && !activeStudent;
  const needsCreate = !loadingStudents && students && students.length === 0 && !activeStudent;

  function handleSelectStudent(s: Student) {
    setActiveStudent(s);
    setShowPicker(false);
  }

  function handleStudentCreated(s: Student) {
    setActiveStudent(s);
    setShowCreate(false);
  }

  const inProgressLessons = progress?.filter((p) => p.status === "in_progress") ?? [];

  return (
    <div>
      <Header />

      {/* Picker modals */}
      {(needsPicker || showPicker) && students && !showCreate && (
        <StudentPickerModal
          students={students}
          onSelect={handleSelectStudent}
          onCreateNew={() => { setShowPicker(false); setShowCreate(true); }}
        />
      )}
      {(needsCreate || showCreate) && (
        <CreateStudentModal
          onClose={() => setShowCreate(false)}
          onCreated={handleStudentCreated}
        />
      )}

      <div className="container" style={{ padding: "32px 28px 60px" }}>
        {activeStudent ? (
          <>
            {/* Hero welcome banner */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginBottom: 28 }}>
              <div className="sticker-card hero-pattern" style={{
                padding: 32, color: "white", background: "var(--purple-600)",
                border: "3px solid var(--purple-700)",
              }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <div className="chip" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>
                    📚 Bem-vindo de volta
                  </div>
                  {(activeStudent.streakCount ?? 0) > 1 && (
                    <div className="chip" style={{ background: "rgba(255,193,74,0.35)", color: "white", fontWeight: 700 }}>
                      🔥 {activeStudent.streakCount} dias seguidos
                    </div>
                  )}
                </div>
                <h1 style={{ color: "white", fontSize: 32, marginBottom: 8 }}>
                  Olá, {activeStudent.name}! 👋
                </h1>
                <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 380, marginBottom: 20 }}>
                  {inProgressLessons.length > 0
                    ? `Tens ${inProgressLessons.length} lição${inProgressLessons.length > 1 ? "ões" : ""} em progresso. Continua!`
                    : "Escolhe uma lição e começa a explorar o mundo das ciências!"}
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <Link href="/licoes">
                    <button className="btn btn-white">📚 Ver lições</button>
                  </Link>
                  <button
                    className="btn btn-sm"
                    style={{ background: "rgba(255,255,255,0.15)", color: "white", borderColor: "rgba(255,255,255,0.5)" }}
                    onClick={() => { setActiveStudent(null); setShowPicker(true); }}
                  >
                    Trocar aluno
                  </button>
                </div>
              </div>

              <div className="sticker-card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 17, marginBottom: 12 }}>🎯 Objetivo da semana</h3>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 42, borderRadius: 10,
                      background: i < (stats?.completedLessons ?? 0) ? "var(--green-500)" : "var(--line)",
                      display: "grid", placeItems: "center",
                      border: "2.5px solid " + (i < (stats?.completedLessons ?? 0) ? "#0F6B55" : "transparent"),
                    }}>
                      {i < (stats?.completedLessons ?? 0) && (
                        <span style={{ color: "white", fontSize: 18 }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-mute)" }}>
                  {stats?.completedLessons ?? 0} lições concluídas no total
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
              <StatCard icon="📚" color="var(--green-500)" label="Lições" value={`${stats?.completedLessons ?? 0}`} />
              <StatCard icon="⏱️" color="var(--purple-600)" label="Tempo total" value={formatTime(stats?.totalTimeSeconds ?? 0)} />
              <StatCard icon="🔄" color="var(--yellow)" label="Em progresso" value={`${stats?.inProgressLessons ?? 0}`} />
              <StatCard icon="📊" color="var(--coral)" label="Lições iniciadas" value={`${stats?.totalLessons ?? 0}`} />
            </div>

            {/* Continue learning */}
            {inProgressLessons.length > 0 && (
              <section style={{ marginBottom: 36 }}>
                <h2 style={{ fontSize: 26, marginBottom: 16 }}>Continuar a aprender</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {inProgressLessons.slice(0, 2).map((p) => (
                    <button
                      key={p.id}
                      className="card card-hover"
                      style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, textAlign: "left", width: "100%" }}
                      onClick={() => navigate(`/lesson/${p.lessonId}`)}
                    >
                      <div style={{ fontSize: 36 }}>📖</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "Fredoka", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Lição {p.lessonId}</div>
                        <div className="progress" style={{ height: 8 }}>
                          <div className="progress-fill" style={{ width: "40%" }} />
                        </div>
                      </div>
                      <button className="btn btn-sm btn-primary">Continuar →</button>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements strip */}
            {(() => {
              const achievements = computeAchievements(progress ?? []);
              const earned = achievements.filter((a) => a.earned);
              const next = achievements.filter((a) => !a.earned).slice(0, 3);
              return (
                <section style={{ marginBottom: 36 }}>
                  <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 16 }}>
                    <h2 style={{ fontSize: 26 }}>🏆 Conquistas</h2>
                    <Link href="/conquistas" style={{ color: "var(--purple-600)", fontFamily: "Fredoka", fontWeight: 600 }}>
                      Ver todas →
                    </Link>
                  </div>

                  {earned.length > 0 && (
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                      {earned.map((a) => (
                        <div key={a.id} title={a.title} style={{
                          width: 56, height: 56, borderRadius: 16,
                          background: "var(--yellow)", border: "3px solid var(--purple-700)",
                          boxShadow: "0 4px 0 var(--purple-700)",
                          display: "grid", placeItems: "center", fontSize: 28,
                        }}>
                          {a.emoji}
                        </div>
                      ))}
                    </div>
                  )}

                  {next.length > 0 && (
                    <div>
                      <div style={{ fontSize: 13, color: "var(--ink-mute)", fontFamily: "Fredoka", fontWeight: 600, marginBottom: 10 }}>
                        A seguir a desbloquear:
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                        {next.map((a) => (
                          <div key={a.id} className="card" style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", opacity: 0.75 }}>
                            <div style={{ fontSize: 30, filter: "grayscale(1)" }}>{a.emoji}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: "Fredoka", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
                              <div className="progress" style={{ height: 6 }}>
                                <div className="progress-fill" style={{ width: `${a.progress ?? 0}%` }} />
                              </div>
                              <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 3 }}>{a.progressLabel}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {earned.length === 0 && (
                    <div className="card" style={{ padding: "20px 24px", display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ fontSize: 40 }}>🌱</div>
                      <div>
                        <div style={{ fontFamily: "Fredoka", fontSize: 17, fontWeight: 600 }}>Começa a tua coleção!</div>
                        <div style={{ fontSize: 14, color: "var(--ink-mute)" }}>Conclui a tua primeira lição para ganhares a conquista "Primeiro Passo".</div>
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Grades grid */}
            <section>
              <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 26 }}>Explorar conteúdos</h2>
                <Link href="/licoes" style={{ color: "var(--purple-600)", fontFamily: "Fredoka", fontWeight: 600 }}>
                  Ver todos →
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {grades?.map((g) => (
                  <Link key={g.id} href={`/grade/${g.id}`}>
                    <div
                      className="sticker-card card-hover"
                      style={{ padding: 24, background: g.color ?? "var(--paper)" }}
                    >
                      <div style={{ fontSize: 44, marginBottom: 10 }}>{g.icon}</div>
                      <h3 style={{ fontSize: 20, marginBottom: 4 }}>{g.name}</h3>
                      <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: 0 }}>{g.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>🦦</div>
            <h2 style={{ fontSize: 32, marginBottom: 12 }}>Bem-vindo ao CurioNauta!</h2>
            <p style={{ color: "var(--ink-mute)", fontSize: 18, marginBottom: 28 }}>
              Cria um perfil de estudante para começar
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => setShowCreate(true)}>
              Criar perfil →
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
