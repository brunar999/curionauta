import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useActiveStudent } from "@/context/StudentContext";
import { apiFetch } from "@/lib/queryClient";

interface HeaderProps {
  variant?: "public" | "app";
}

export default function Header({ variant }: HeaderProps) {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { mutate: logout } = useLogout();
  const { activeStudent } = useActiveStudent();

  const { data: adminCheck } = useQuery({
    queryKey: ["admin-check"],
    queryFn: () => apiFetch("/api/admin/check"),
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = !!adminCheck;

  const isPublic = variant === "public" || !isAuthenticated;

  function handleLogout() {
    logout(undefined, {
      onSuccess: () => navigate("/"),
    });
  }

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        {/* Brand */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="brand">
          <img src="/logo.png" alt="CurioNauta" style={{ height: 60, width: "auto" }} />
        </Link>

        {/* Nav links */}
        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={`nav-link ${location === "/dashboard" ? "active" : ""}`}
              >
                🏠 Início
              </Link>
              <Link
                href="/licoes"
                className={`nav-link ${location.startsWith("/licoes") || location.startsWith("/grade") || location.startsWith("/theme") || location.startsWith("/lesson") ? "active" : ""}`}
              >
                📚 Lições
              </Link>
              {activeStudent && (
                <Link
                  href="/metricas"
                  className={`nav-link ${location === "/metricas" ? "active" : ""}`}
                >
                  📊 Métricas
                </Link>
              )}
              {activeStudent && (
                <Link
                  href="/conquistas"
                  className={`nav-link ${location === "/conquistas" ? "active" : ""}`}
                >
                  🏆 Conquistas
                </Link>
              )}
              <Link
                href="/parent"
                className={`nav-link ${location === "/parent" ? "active" : ""}`}
              >
                👨‍👩‍👧 Pais
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`nav-link ${location === "/admin" ? "active" : ""}`}
                >
                  🔧 Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <span className="nav-link" style={{ cursor: "default" }}>🇵🇹 1º ao 4º ano</span>
            </>
          )}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAuthenticated ? (
            <>
              {activeStudent && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "var(--purple-50)", borderRadius: 999,
                  padding: "8px 16px", border: "2px solid var(--purple-100)",
                }}>
                  <span style={{ fontSize: 20 }}>{activeStudent.avatarEmoji ?? "🧒"}</span>
                  <span style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: 15, color: "var(--purple-700)" }}>
                    {activeStudent.name}
                  </span>
                  {(activeStudent.streakCount ?? 0) > 1 && (
                    <span style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 13, color: "var(--yellow)", background: "var(--purple-700)", borderRadius: 999, padding: "2px 8px" }}>
                      🔥 {activeStudent.streakCount}
                    </span>
                  )}
                </div>
              )}
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">Entrar</Link>
              <Link href="/login?register=true">
                <button className="btn btn-primary btn-sm">Começar grátis</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
