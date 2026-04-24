import "dotenv/config";
import { db } from "./db";
import { themes, lessons } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedLessons() {
  console.log("🌱 Adding new lessons to O Corpo Humano...");

  const [theme] = await db
    .select()
    .from(themes)
    .where(eq(themes.title, "O Corpo Humano"))
    .limit(1);

  if (!theme) {
    console.error("❌ Theme 'O Corpo Humano' not found. Run db:seed first.");
    process.exit(1);
  }

  console.log(`✅ Found theme: ${theme.title} (id: ${theme.id})`);

  await db.insert(lessons).values([
    {
      themeId: theme.id,
      title: "As Etapas da Vida Humana",
      type: "mixed",
      duration: 15,
      order: 3,
      parts: [
        {
          type: "content",
          title: "As etapas da vida",
          content: `<h2>As Etapas da Vida Humana</h2>
<p>As pessoas passam por várias fases ao longo da vida. Em cada fase, crescemos, mudamos e aprendemos coisas novas. Vamos descobrir quais são essas fases!</p>

<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:24px 0">
  <div style="background:#FFF3D1;border-radius:16px;padding:20px">
    <div style="font-size:40px;margin-bottom:8px">👶</div>
    <h3 style="margin:0 0 8px;color:var(--purple-700)">1. Infância</h3>
    <p style="margin:0;font-size:14px;color:var(--ink-soft)">É o início da vida. O bebé aprende a gatinhar, falar e dar os primeiros passos. Vamos à escola e aprendemos a ler, escrever e contar. É uma fase cheia de descobertas e alegria!</p>
  </div>
  <div style="background:#DCF5EB;border-radius:16px;padding:20px">
    <div style="font-size:40px;margin-bottom:8px">🧑‍🎓</div>
    <h3 style="margin:0 0 8px;color:var(--green-600)">2. Adolescência</h3>
    <p style="margin:0;font-size:14px;color:var(--ink-soft)">O corpo muda muito: ficamos mais altos e fortes. Começamos a pensar como adultos. É uma fase de crescimento e mudanças emocionais.</p>
  </div>
  <div style="background:#DEEEFF;border-radius:16px;padding:20px">
    <div style="font-size:40px;margin-bottom:8px">🧑</div>
    <h3 style="margin:0 0 8px;color:#1A5FA3">3. Idade Adulta</h3>
    <p style="margin:0;font-size:14px;color:var(--ink-soft)">O corpo atinge o tamanho final. Os adultos trabalham, cuidam da casa e ajudam os mais novos. É uma fase de responsabilidade e maturidade.</p>
  </div>
  <div style="background:#FFE2DE;border-radius:16px;padding:20px">
    <div style="font-size:40px;margin-bottom:8px">👵</div>
    <h3 style="margin:0 0 8px;color:var(--coral)">4. Velhice</h3>
    <p style="margin:0;font-size:14px;color:var(--ink-soft)">O corpo fica mais lento e aparecem cabelos brancos e rugas. As pessoas idosas têm muita experiência e sabedoria. Gostam de contar histórias e relembrar o passado.</p>
  </div>
</div>

<h3>A ordem das fases</h3>
<p>As fases da vida seguem sempre esta ordem:</p>
<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:16px 0;font-family:Fredoka;font-size:16px;font-weight:600">
  <span style="background:var(--purple-100);color:var(--purple-700);padding:8px 16px;border-radius:999px">👶 Infância</span>
  <span style="color:var(--ink-mute)">→</span>
  <span style="background:var(--green-100);color:var(--green-600);padding:8px 16px;border-radius:999px">🧑‍🎓 Adolescência</span>
  <span style="color:var(--ink-mute)">→</span>
  <span style="background:#DEEEFF;color:#1A5FA3;padding:8px 16px;border-radius:999px">🧑 Idade Adulta</span>
  <span style="color:var(--ink-mute)">→</span>
  <span style="background:#FFE2DE;color:var(--coral);padding:8px 16px;border-radius:999px">👵 Velhice</span>
</div>`,
        },
        {
          type: "component",
          title: "Quiz — As etapas da vida",
          componentId: "GenericQuiz",
          questions: [
            { q: "Em que fase da vida aprendemos a andar e a falar?", options: ["Adolescência", "Infância", "Velhice"], answer: 1 },
            { q: "Em que fase da vida começamos a ir à escola?", options: ["Infância", "Idade Adulta", "Velhice"], answer: 0 },
            { q: "Quem costuma ter cabelos brancos e rugas?", options: ["Infância", "Velhice", "Adolescência"], answer: 1 },
            { q: "Em que fase o corpo cresce mais depressa?", options: ["Adolescência", "Idade Adulta", "Velhice"], answer: 0 },
            { q: "Qual é a fase que vem antes da Idade Adulta?", options: ["Infância", "Adolescência", "Velhice"], answer: 1 },
            { q: "Quem é responsável por trabalhar e cuidar dos filhos?", options: ["Infância", "Idade Adulta", "Velhice"], answer: 1 },
            { q: "Quem costuma contar histórias sobre o passado?", options: ["Adolescência", "Idade Adulta", "Velhice"], answer: 2 },
            { q: "Em que fase se trocam os dentes de leite?", options: ["Infância", "Idade Adulta", "Velhice"], answer: 0 },
            { q: "Qual destas fases vem primeiro na vida?", options: ["Idade Adulta", "Adolescência", "Infância"], answer: 2 },
            { q: "Quem começa a pensar no futuro e no que quer ser?", options: ["Adolescência", "Infância", "Velhice"], answer: 0 },
            { q: "Quem tem mais experiência de vida?", options: ["Adolescência", "Velhice", "Idade Adulta"], answer: 1 },
            { q: "Em que fase temos mais tempo para brincar?", options: ["Infância", "Idade Adulta", "Velhice"], answer: 0 },
            { q: "A _______ é o início da vida.", options: ["Idade Adulta", "Adolescência", "Infância"], answer: 2 },
            { q: "Qual é a terceira fase da vida?", options: ["Infância", "Adolescência", "Idade Adulta"], answer: 2 },
            { q: "Quem já pode ter filhos e trabalhar?", options: ["Adolescência", "Idade Adulta", "Infância"], answer: 1 },
          ],
        },
      ],
    },
    {
      themeId: theme.id,
      title: "As Transformações do Corpo",
      type: "mixed",
      duration: 15,
      order: 4,
      parts: [
        {
          type: "content",
          title: "O corpo muda ao longo da vida",
          content: `<h2>As Transformações do Corpo</h2>
<p>O nosso corpo não fica sempre igual — muda ao longo de toda a vida! Vamos descobrir como o corpo se transforma em cada fase.</p>

<h3>Como o corpo muda em cada fase</h3>
<div style="display:flex;flex-direction:column;gap:12px;margin:20px 0">
  <div style="display:flex;gap:16px;align-items:flex-start;background:var(--purple-50);border-radius:14px;padding:16px">
    <span style="font-size:36px">👶</span>
    <div><strong style="font-family:Fredoka;font-size:17px;color:var(--purple-700)">Infância</strong><br><span style="font-size:14px;color:var(--ink-soft)">O corpo cresce rapidamente. Aprendemos a andar e a falar. Os dentes de leite aparecem e depois caem para dar lugar aos dentes definitivos.</span></div>
  </div>
  <div style="display:flex;gap:16px;align-items:flex-start;background:var(--green-50);border-radius:14px;padding:16px">
    <span style="font-size:36px">🧑‍🎓</span>
    <div><strong style="font-family:Fredoka;font-size:17px;color:var(--green-600)">Adolescência</strong><br><span style="font-size:14px;color:var(--ink-soft)">O corpo muda muito e ficamos mais altos e fortes. Os ossos crescem e o corpo começa a parecer-se com o de um adulto.</span></div>
  </div>
  <div style="display:flex;gap:16px;align-items:flex-start;background:#DEEEFF;border-radius:14px;padding:16px">
    <span style="font-size:36px">🧑</span>
    <div><strong style="font-family:Fredoka;font-size:17px;color:#1A5FA3">Idade Adulta</strong><br><span style="font-size:14px;color:var(--ink-soft)">O corpo deixa de crescer e estabiliza. Os adultos têm o corpo completamente formado.</span></div>
  </div>
  <div style="display:flex;gap:16px;align-items:flex-start;background:#FFE2DE;border-radius:14px;padding:16px">
    <span style="font-size:36px">👵</span>
    <div><strong style="font-family:Fredoka;font-size:17px;color:var(--coral)">Velhice</strong><br><span style="font-size:14px;color:var(--ink-soft)">O corpo fica mais lento e aparecem cabelos brancos e rugas na pele. Os ossos ficam mais frágeis.</span></div>
  </div>
</div>

<h3>Curiosidades sobre o corpo</h3>
<ul>
  <li>🦷 Um adulto tem normalmente <strong>32 dentes definitivos</strong></li>
  <li>🦴 O corpo tem <strong>206 ossos</strong> — os ossos crescem e ficam mais fortes com o exercício e boa alimentação</li>
  <li>❤️ O <strong>coração</strong> bombeia o sangue por todo o corpo</li>
  <li>🧠 O <strong>cérebro</strong> controla todas as ações do corpo</li>
  <li>💤 Dormir bem e comer de forma saudável ajuda o corpo a crescer forte</li>
</ul>`,
        },
        {
          type: "component",
          title: "Quiz — As transformações do corpo",
          componentId: "GenericQuiz",
          questions: [
            { q: "O nosso corpo muda ou fica sempre igual?", options: ["Muda", "Fica igual", "Encolhe"], answer: 0 },
            { q: "Quando crescemos, o corpo fica…", options: ["Mais pequeno", "Mais alto", "Igual"], answer: 1 },
            { q: "Quando nascemos somos…", options: ["Altos", "Fortes", "Muito pequenos"], answer: 2 },
            { q: "Os dentes de leite aparecem em que fase?", options: ["Quando somos bebés", "Na velhice", "Na adolescência"], answer: 0 },
            { q: "O que acontece aos dentes de leite quando crescemos?", options: ["Ficam para sempre", "Caem", "Mudam de cor"], answer: 1 },
            { q: "Depois dos dentes de leite, nascem os…", options: ["Dentes definitivos", "Dentes falsos", "Dentes de açúcar"], answer: 0 },
            { q: "À medida que crescemos, os ossos…", options: ["Ficam mais fracos", "Crescem e ficam mais fortes", "Encolhem"], answer: 1 },
            { q: "Quando ficamos mais velhos, o cabelo pode ficar…", options: ["Roxo", "Branco ou cinzento", "Laranja"], answer: 1 },
            { q: "Quantos dentes definitivos tem normalmente um adulto?", options: ["20", "32", "40"], answer: 1 },
            { q: "Qual é o órgão que faz o sangue circular pelo corpo?", options: ["Coração", "Estômago", "Pulmões"], answer: 0 },
            { q: "Qual é o órgão que controla todas as ações do corpo?", options: ["Cérebro", "Pulmões", "Fígado"], answer: 0 },
            { q: "A pele serve para…", options: ["Proteger o corpo", "Fazer barulho", "Mudar de cor"], answer: 0 },
            { q: "Quando fazemos exercício, o corpo fica…", options: ["Mais forte", "Mais cansado para sempre", "Fraco"], answer: 0 },
            { q: "Quando dormimos bem, o corpo…", options: ["Cresce e descansa", "Encolhe", "Fica sem energia"], answer: 0 },
            { q: "O corpo humano é feito de muitos…", options: ["Brinquedos", "Ossos e músculos", "Cabelos"], answer: 1 },
          ],
        },
      ],
    },
  ]);

  console.log("✅ 2 new lessons added to O Corpo Humano!");
  console.log("   - As Etapas da Vida Humana (order 3)");
  console.log("   - As Transformações do Corpo (order 4)");
  process.exit(0);
}

seedLessons().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
