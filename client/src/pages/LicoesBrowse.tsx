import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/queryClient";
import type { Grade } from "@shared/schema";

export default function LicoesBrowse() {
  const { data: grades, isLoading } = useQuery<Grade[]>({
    queryKey: ["grades"],
    queryFn: () => apiFetch("/api/grades"),
  });

  const gradeIcons = ["🌱", "🌿", "🌳", "🚀"];
  const gradeBgs = ["#DCF5EB", "#EBE1FB", "#DEEEFF", "#FFE2DE"];

  return (
    <div>
      <Header />
      <div className="container" style={{ padding: "32px 28px 60px" }}>
        <nav style={{ fontSize: 14, color: "var(--ink-mute)", marginBottom: 20, fontFamily: "Fredoka" }}>
          <Link href="/dashboard" style={{ color: "var(--purple-600)" }}>Início</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span>Lições</span>
        </nav>

        <div className="chip chip-green" style={{ marginBottom: 12 }}>📚 Todo o conteúdo</div>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>Lições</h1>
        <p style={{ color: "var(--ink-mute)", marginBottom: 36, fontSize: 17 }}>
          Escolhe um ano escolar para explorar os temas disponíveis.
        </p>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--ink-mute)" }}>A carregar…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {grades?.map((g, i) => (
              <Link key={g.id} href={`/grade/${g.id}`}>
                <div
                  className="sticker-card card-hover"
                  style={{ padding: 32, background: gradeBgs[i] ?? "var(--paper)" }}
                >
                  <div style={{ fontSize: 56, marginBottom: 12 }}>{gradeIcons[i] ?? "📚"}</div>
                  <h2 style={{ fontSize: 28, marginBottom: 6 }}>{g.name}</h2>
                  <p style={{ color: "var(--ink-soft)", margin: "0 0 16px", fontSize: 15 }}>
                    {g.description}
                  </p>
                  <button className="btn btn-primary btn-sm">
                    Explorar →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
