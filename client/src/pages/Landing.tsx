import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 26, color: "white" }}>{num}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function FeatureCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="card" style={{ padding: 28, textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>{emoji}</div>
      <h3 style={{ fontSize: 20, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "var(--ink-mute)", fontSize: 15, margin: 0 }}>{desc}</p>
    </div>
  );
}

function GradePreviewCard({ number, emoji, color, themes }: { number: string; emoji: string; color: string; themes: string[] }) {
  return (
    <div className="sticker-card card-hover" style={{ padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>{emoji}</div>
      <h3 style={{ fontSize: 22, marginBottom: 4 }}>{number} Ano</h3>
      <div style={{ fontSize: 13, color: "var(--ink-mute)", marginBottom: 12 }}>{themes.length} temas</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
        {themes.map((t) => (
          <span key={t} className="chip" style={{ fontSize: 11, background: color + "40", color: "var(--ink-soft)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      <Header variant="public" />

      {/* Hero */}
      <section style={{
        background: "var(--purple-600)",
        paddingBottom: 0,
        overflow: "hidden",
        position: "relative",
      }} className="hero-pattern">
        <div className="container" style={{ padding: "80px 28px 100px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 60, alignItems: "center" }}>
            <div className="fade-up">
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)",
                padding: "8px 16px", borderRadius: 999, color: "white",
                fontFamily: "Fredoka", fontWeight: 500, fontSize: 14,
                marginBottom: 24, border: "1.5px solid rgba(255,255,255,0.4)",
              }}>
                🇵🇹 Estudo do Meio · 1º ao 4º ano
              </div>

              <h1 style={{
                fontSize: "clamp(40px, 5.5vw, 68px)", fontWeight: 700, lineHeight: 1.02,
                color: "white", letterSpacing: "-0.02em", marginBottom: 20,
                textShadow: "0 4px 0 rgba(74,26,153,0.3)",
              }}>
                Aprender ciências<br />
                é uma{" "}
                <em style={{
                  fontStyle: "normal",
                  background: "var(--yellow)", color: "var(--purple-700)",
                  padding: "0 14px", borderRadius: 14, display: "inline-block",
                  transform: "rotate(-2deg)",
                  border: "3px solid var(--purple-700)",
                  boxShadow: "0 4px 0 var(--purple-700)",
                }}>
                  aventura!
                </em>
              </h1>

              <p style={{ fontSize: 20, color: "rgba(255,255,255,0.95)", marginBottom: 36, maxWidth: 520, lineHeight: 1.5, fontWeight: 500 }}>
                Junta-te ao CurioNauta e descobre o corpo humano, os animais, as plantas, o universo
                e muito mais — com jogos, quizzes e experiências divertidas.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/login?register=true">
                  <button className="btn btn-white btn-lg">Começar a aventura →</button>
                </Link>
                <Link href="/login">
                  <button className="btn btn-lg" style={{
                    background: "rgba(255,255,255,0.15)", color: "white",
                    borderColor: "rgba(255,255,255,0.6)", boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
                  }}>
                    Já tenho conta
                  </button>
                </Link>
              </div>

              <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
                <Stat num="500+" label="Lições" />
                <Stat num="4 anos" label="de conteúdo" />
                <Stat num="100%" label="português" />
              </div>
            </div>

            {/* Hero mascot */}
            <div style={{ position: "relative", minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="wobble" style={{ position: "relative", display: "inline-block" }}>
                <img
                  src="/mascot.jpg"
                  alt="CurioNauta mascot"
                  style={{
                    width: 380, height: "auto", borderRadius: 36,
                    border: "4px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    display: "block",
                  }}
                />
              </div>

              {/* Floating badges */}
              <div className="float" style={{
                position: "absolute", top: 20, right: 0,
                background: "var(--yellow)", borderRadius: 14, padding: "8px 14px",
                fontFamily: "Fredoka", fontWeight: 700, fontSize: 14,
                border: "2.5px solid var(--purple-700)", boxShadow: "0 4px 0 var(--purple-700)",
                transform: "rotate(8deg)",
              }}>
                ⭐ 3 estrelas!
              </div>

              <div className="float" style={{
                position: "absolute", bottom: 40, left: 0,
                background: "white", borderRadius: 14, padding: "8px 14px",
                fontFamily: "Fredoka", fontWeight: 700, fontSize: 14, color: "var(--purple-600)",
                border: "2.5px solid var(--purple-600)", boxShadow: "0 4px 0 var(--purple-700)",
                transform: "rotate(-5deg)", animationDelay: "1s",
              }}>
                🎉 Lição concluída!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="chip" style={{ marginBottom: 12 }}>✨ Por que o CurioNauta?</div>
            <h2 style={{ fontSize: 38, marginBottom: 12 }}>Uma forma diferente de aprender</h2>
            <p style={{ color: "var(--ink-mute)", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
              Desenhado para crianças dos 6 aos 10 anos, seguindo o currículo português.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            <FeatureCard
              emoji="🎯"
              title="Quizzes interativos"
              desc="Perguntas adaptadas a cada nível, com feedback imediato e explicações claras."
            />
            <FeatureCard
              emoji="🎮"
              title="Jogos de arrastar"
              desc="Atividades de drag-and-drop que tornam a aprendizagem divertida e memorável."
            />
            <FeatureCard
              emoji="📊"
              title="Acompanha o progresso"
              desc="Vê quanto tempo estudaste, quantas lições completaste e as tuas estrelas ganhas."
            />
            <FeatureCard
              emoji="🏆"
              title="Conquistas e medalhas"
              desc="Ganha recompensas ao completar temas e manter a tua sequência de estudo."
            />
            <FeatureCard
              emoji="👨‍👩‍👧"
              title="Multi-estudante"
              desc="Uma conta para toda a família — cada criança tem o seu perfil e progresso."
            />
            <FeatureCard
              emoji="🇵🇹"
              title="100% em português"
              desc="Todo o conteúdo em Português de Portugal, alinhado com o currículo nacional."
            />
          </div>
        </div>
      </section>

      {/* Grade showcase */}
      <section style={{ padding: "80px 0", background: "var(--purple-50)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="chip" style={{ marginBottom: 12 }}>📚 Conteúdo</div>
            <h2 style={{ fontSize: 38, marginBottom: 12 }}>4 anos de Estudo do Meio</h2>
            <p style={{ color: "var(--ink-mute)", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
              Do 1º ao 4º ano, centenas de lições cobrindo todo o programa.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            <GradePreviewCard number="1º" emoji="🌱" color="#09AA86" themes={["Nós e a família", "Respeito pelos outros", "Diferentes lugares", "Cuidar de nós", "Descobrir o mundo", "O ambiente"]} />
            {(["2º", "3º", "4º"] as const).map((n) => (
              <div key={n} className="sticker-card" style={{ padding: 24, textAlign: "center", opacity: 0.55, position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{n === "2º" ? "🌿" : n === "3º" ? "🌳" : "🚀"}</div>
                <h3 style={{ fontSize: 22, marginBottom: 4 }}>{n} Ano</h3>
                <span className="chip" style={{ fontSize: 12, background: "var(--line)", color: "var(--ink-mute)" }}>🔜 Em breve</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="container">
          <img src="/mascot.jpg" alt="CurioNauta" style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", marginBottom: 16, border: "4px solid var(--purple-100)", boxShadow: "0 8px 0 var(--purple-700)" }} />
          <h2 style={{ fontSize: 44, marginBottom: 16 }}>Pronto para começar?</h2>
          <p style={{ fontSize: 20, color: "var(--ink-mute)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Regista-te gratuitamente e começa a explorar o mundo das ciências hoje!
          </p>
          <Link href="/login?register=true">
            <button className="btn btn-primary btn-lg">
              Criar conta gratuita →
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
