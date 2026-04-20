import { useLocation, Link } from "wouter";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useActiveStudent } from "@/context/StudentContext";

interface HeaderProps {
  variant?: "public" | "app";
}

export default function Header({ variant }: HeaderProps) {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { mutate: logout } = useLogout();
  const { activeStudent } = useActiveStudent();

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
          <span style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 28, color: "var(--purple-700)", letterSpacing: "-0.02em" }}>
            Curio<span style={{ color: "var(--green-500)" }}>Nauta</span>
            <span style={{ fontSize: 22, marginLeft: 4 }}>🦦</span>
          </span>
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
