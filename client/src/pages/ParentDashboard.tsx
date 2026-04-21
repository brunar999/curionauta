import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { apiFetch } from "@/lib/queryClient";
import { useActiveStudent } from "@/context/StudentContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatTime } from "@/lib/utils";
import type { Student, Grade } from "@shared/schema";

interface StudentStats {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  totalTimeSeconds: number;
}

function StudentCard({ student, grades }: { student: Student; grades: Grade[] }) {
  const [, navigate] = useLocation();
  const { setActiveStudent } = useActiveStudent();

  const { data: stats } = useQuery<StudentStats>({
    queryKey: ["stats", student.id],
    queryFn: () => apiFetch(`/api/students/${student.id}/stats`),
  });

  const grade = grades.find((g) => g.id === student.currentGradeId);
  const streak = student.streakCount ?? 0;

  function handleView() {
    setActiveStudent(student);
    navigate("/metricas");
  }

  return (
    <div className="sticker-card" style={{ padding: 24, background: "white" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ fontSize: 44 }}>{student.avatarEmoji ?? "🧒"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 22 }}>{student.name}</div>
          {grade && (
            <div style={{ fontSize: 13, color: "var(--ink-mute)", marginTop: 2 }}>
              {grade.icon} {grade.name}
            </div>
          )}
        </div>
        {streak > 1 && (
          <div style={{
            background: "var(--yellow)", border: "2px solid var(--purple-700)",
            borderRadius: 999, padding: "4px 12px",
            fontFamily: "Fredoka", fontWeight: 700, fontSize: 14,
          }}>
            🔥 {streak} dias
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
        {[
          { icon: "✅", value: stats?.completedLessons ?? 0, label: "Concluídas" },
          { icon: "🔄", value: stats?.inProgressLessons ?? 0, label: "Em progresso" },
          { icon: "⏱️", value: formatTime(stats?.totalTimeSeconds ?? 0), label: "Tempo" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center", background: "var(--cream)", borderRadius: 12, padding: "10px 6px" }}>
            <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 18, color: "var(--purple-700)" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {stats && stats.completedLessons + stats.inProgressLessons > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-mute)", marginBottom: 4, fontFamily: "Fredoka" }}>
            <span>Progresso geral</span>
            <span>{stats.completedLessons}/{stats.completedLessons + stats.inProgressLessons}</span>
          </div>
          <div className="progress" style={{ height: 8 }}>
            <div className="progress-fill" style={{
              width: `${stats.totalLessons > 0 ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0}%`
            }} />
          </div>
        </div>
      )}

      <button className="btn btn-primary btn-sm" onClick={handleView} style={{ width: "100%", justifyContent: "center" }}>
        Ver métricas detalhadas →
      </button>
    </div>
  );
}

export default function ParentDashboard() {
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: () => apiFetch("/api/students"),
  });

  const { data: grades } = useQuery<Grade[]>({
    queryKey: ["grades"],
    queryFn: () => apiFetch("/api/grades"),
  });

  return (
    <div>
      <Header />

      <div className="container" style={{ padding: "32px 28px 60px" }}>
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontSize: 34, margin: 0 }}>Painel dos Pais</h1>
              <span className="chip" style={{ background: "var(--purple-100)", color: "var(--purple-700)", fontWeight: 700 }}>
                👨‍👩‍👧 Modo Pais
              </span>
            </div>
            <p style={{ color: "var(--ink-mute)", fontSize: 15, margin: 0 }}>
              Acompanha o progresso de todos os estudantes da tua conta.
            </p>
          </div>
          <Link href="/dashboard" style={{ marginLeft: "auto" }}>
            <button className="btn btn-ghost btn-sm">← Voltar ao início</button>
          </Link>
        </div>

        {/* Summary row */}
        {students && students.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
            {[
              { icon: "👧", label: "Estudantes", value: students.length },
              { icon: "📚", label: "Total de perfis", value: students.length },
              { icon: "🔥", label: "Streaks ativos", value: students.filter((s) => (s.streakCount ?? 0) > 1).length },
            ].map((item) => (
              <div key={item.label} className="card" style={{ padding: "18px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 28, color: "var(--purple-700)" }}>{item.value}</div>
                <div style={{ fontSize: 13, color: "var(--ink-mute)", fontWeight: 600 }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Student cards */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--ink-mute)", fontFamily: "Fredoka", fontSize: 20 }}>
            A carregar… 🦦
          </div>
        ) : students && students.length > 0 ? (
          <>
            <h2 style={{ fontSize: 24, marginBottom: 20 }}>Estudantes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {students.map((s) => (
                <StudentCard key={s.id} student={s} grades={grades ?? []} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>👨‍👩‍👧</div>
            <h2 style={{ fontSize: 28, marginBottom: 12 }}>Sem estudantes ainda</h2>
            <p style={{ color: "var(--ink-mute)", marginBottom: 24 }}>
              Cria um perfil de estudante para começar a acompanhar o progresso.
            </p>
            <Link href="/dashboard">
              <button className="btn btn-primary">Ir ao painel →</button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
