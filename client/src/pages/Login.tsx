import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useLogin, useRegister, useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [location, navigate] = useLocation();
  const isRegister = new URLSearchParams(location.split("?")[1]).get("register") === "true";
  const [mode, setMode] = useState<"login" | "register">(isRegister ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");

  const { isAuthenticated } = useAuth();
  const login = useLogin();
  const register = useRegister();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        await register.mutateAsync({ email, password, firstName });
      } else {
        await login.mutateAsync({ email, password });
      }
      navigate("/dashboard");
    } catch (err: unknown) {
      setError((err as Error).message || "Ocorreu um erro");
    }
  }

  const isPending = login.isPending || register.isPending;

  return (
    <div style={{
      minHeight: "100vh", background: "var(--cream)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/">
            <img src="/logo.png" alt="CurioNauta" style={{ height: 220, width: "auto", cursor: "pointer", margin: "-40px 0" }} />
          </Link>
        </div>

        {/* Card */}
        <div className="sticker-card" style={{ padding: "36px 32px" }}>
          <h1 style={{ fontSize: 28, marginBottom: 6, textAlign: "center" }}>
            {mode === "login" ? "Bem-vindo de volta! 👋" : "Criar conta 🎉"}
          </h1>
          <p style={{ color: "var(--ink-mute)", textAlign: "center", marginBottom: 28, fontSize: 15 }}>
            {mode === "login"
              ? "Entra na tua conta para continuar a aprender"
              : "Regista-te gratuitamente e começa já"}
          </p>

          {error && (
            <div style={{
              background: "#FFE2DE", border: "2px solid var(--coral)", borderRadius: 12,
              padding: "12px 16px", marginBottom: 20, color: "#A13A2E", fontSize: 14, fontWeight: 600,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <div>
                <label className="form-label">O teu nome</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ex: Ana Silva"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Palavra-passe</label>
              <input
                className="form-input"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
              style={{ width: "100%", marginTop: 4, justifyContent: "center" }}
            >
              {isPending
                ? "A carregar…"
                : mode === "login"
                  ? "Entrar →"
                  : "Criar conta →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--ink-mute)" }}>
            {mode === "login" ? (
              <>
                Não tens conta?{" "}
                <button
                  onClick={() => { setMode("register"); setError(""); }}
                  style={{ color: "var(--purple-600)", fontWeight: 700, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit" }}
                >
                  Regista-te grátis
                </button>
              </>
            ) : (
              <>
                Já tens conta?{" "}
                <button
                  onClick={() => { setMode("login"); setError(""); }}
                  style={{ color: "var(--purple-600)", fontWeight: 700, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit" }}
                >
                  Iniciar sessão
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{ color: "var(--ink-mute)", fontSize: 14 }}>
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
