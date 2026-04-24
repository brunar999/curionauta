import "dotenv/config";
import { db } from "./db";
import { grades, themes, lessons } from "@shared/schema";
import { eq, inArray, ne } from "drizzle-orm";

const STUB = (title: string) =>
  `<h2>${title}</h2>
<div style="background:var(--purple-50);border-radius:16px;padding:28px;text-align:center;margin:20px 0">
  <div style="font-size:60px;margin-bottom:12px">🔜</div>
  <h3 style="color:var(--purple-700);margin-bottom:8px">Conteúdo em preparação</h3>
  <p style="color:var(--ink-mute);margin:0">Esta lição estará disponível em breve. Continua a explorar os outros temas!</p>
</div>`;

// Full content for 1.1 and 1.2 from docx files
const CONTENT_1_1 = `<h2>As Etapas da Vida Humana</h2>
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
<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:16px 0;font-family:Fredoka;font-size:16px;font-weight:600">
  <span style="background:var(--purple-100);color:var(--purple-700);padding:8px 16px;border-radius:999px">👶 Infância</span>
  <span style="color:var(--ink-mute)">→</span>
  <span style="background:var(--green-100);color:var(--green-600);padding:8px 16px;border-radius:999px">🧑‍🎓 Adolescência</span>
  <span style="color:var(--ink-mute)">→</span>
  <span style="background:#DEEEFF;color:#1A5FA3;padding:8px 16px;border-radius:999px">🧑 Idade Adulta</span>
  <span style="color:var(--ink-mute)">→</span>
  <span style="background:#FFE2DE;color:var(--coral);padding:8px 16px;border-radius:999px">👵 Velhice</span>
</div>`;

const QUIZ_1_1 = [
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
];

const CONTENT_1_2 = `<h2>As Transformações do Corpo</h2>
<p>O nosso corpo não fica sempre igual — muda ao longo de toda a vida! Vamos descobrir como o corpo se transforma em cada fase.</p>
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
  <li>🦴 Os ossos crescem e ficam mais fortes com o exercício e boa alimentação</li>
  <li>❤️ O <strong>coração</strong> bombeia o sangue por todo o corpo</li>
  <li>🧠 O <strong>cérebro</strong> controla todas as ações do corpo</li>
  <li>💤 Dormir bem e comer de forma saudável ajuda o corpo a crescer forte</li>
</ul>`;

const QUIZ_1_2 = [
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
];

async function restructure() {
  console.log("🔄 Restructuring Grade 1 curriculum...\n");

  // ── Step 1: Hide grades 2, 3, 4 ──────────────────────────────────────────────
  await db.update(grades).set({ hidden: true }).where(ne(grades.number, 1));
  console.log("✅ Grades 2, 3, 4 hidden");

  // ── Step 2: Delete old Grade 1 themes + lessons (cascade) ────────────────────
  const [g1] = await db.select().from(grades).where(eq(grades.number, 1));
  const oldThemes = await db.select().from(themes).where(eq(themes.gradeId, g1.id));
  if (oldThemes.length > 0) {
    const oldIds = oldThemes.map((t) => t.id);
    await db.delete(lessons).where(inArray(lessons.themeId, oldIds));
    await db.delete(themes).where(inArray(themes.id, oldIds));
  }
  console.log(`✅ Cleared ${oldThemes.length} old themes from Grade 1`);

  // ── Step 3: Create 6 new themes ───────────────────────────────────────────────
  const [t1, t2, t3, t4, t5, t6] = await db
    .insert(themes)
    .values([
      { gradeId: g1.id, title: "Nós e a família", shortTitle: "Família", description: "As etapas da vida, a família e as emoções.", icon: "👨‍👩‍👧", bgColor: "#FFF3D1", accentColor: "#FFC94A", order: 1 },
      { gradeId: g1.id, title: "Aprender a respeitar os outros", shortTitle: "Respeito", description: "Funções em família, profissões e respeito.", icon: "🤝", bgColor: "#DCF5EB", accentColor: "#09AA86", order: 2 },
      { gradeId: g1.id, title: "Vamos a diferentes lugares", shortTitle: "Lugares", description: "A localidade, a casa, a escola e regras.", icon: "🗺️", bgColor: "#EBE1FB", accentColor: "#6B2698", order: 3 },
      { gradeId: g1.id, title: "Como cuidar de nós?", shortTitle: "Saúde", description: "Alimentação, higiene e hábitos saudáveis.", icon: "💪", bgColor: "#FFE2DE", accentColor: "#FA697A", order: 4 },
      { gradeId: g1.id, title: "Descobrir o mundo", shortTitle: "Natureza", description: "Paisagens, seres vivos, plantas e animais.", icon: "🌿", bgColor: "#DCF5EB", accentColor: "#09AA86", order: 5 },
      { gradeId: g1.id, title: "O ambiente e o mundo à volta", shortTitle: "Ambiente", description: "O planeta, reciclagem e fenómenos naturais.", icon: "🌍", bgColor: "#DEEEFF", accentColor: "#6FB9FF", order: 6 },
    ])
    .returning();

  console.log("✅ 6 new themes created");

  // ── Step 4: Lessons for Theme 1 — Nós e a família ────────────────────────────
  await db.insert(lessons).values([
    {
      themeId: t1.id, title: "As Etapas da Vida Humana", type: "mixed", duration: 15, order: 1,
      parts: [
        { type: "content", title: "As etapas da vida", content: CONTENT_1_1 },
        { type: "component", title: "Quiz — As etapas da vida", componentId: "GenericQuiz", questions: QUIZ_1_1 },
      ],
    },
    {
      themeId: t1.id, title: "As Transformações do Corpo", type: "mixed", duration: 15, order: 2,
      parts: [
        { type: "content", title: "O corpo muda ao longo da vida", content: CONTENT_1_2 },
        { type: "component", title: "Quiz — As transformações do corpo", componentId: "GenericQuiz", questions: QUIZ_1_2 },
      ],
    },
    { themeId: t1.id, title: "O Seu Passado", type: "content", duration: 10, order: 3, content: STUB("O Seu Passado") },
    { themeId: t1.id, title: "Datas e Locais Importantes", type: "content", duration: 10, order: 4, content: STUB("Datas e Locais Importantes") },
    { themeId: t1.id, title: "Os Símbolos Nacionais", type: "content", duration: 10, order: 5, content: STUB("Os Símbolos Nacionais") },
    { themeId: t1.id, title: "As Famílias", type: "content", duration: 10, order: 6, content: STUB("As Famílias") },
    { themeId: t1.id, title: "A Minha Família", type: "content", duration: 10, order: 7, content: STUB("A Minha Família") },
    { themeId: t1.id, title: "As Minhas Emoções", type: "content", duration: 10, order: 8, content: STUB("As Minhas Emoções") },
    { themeId: t1.id, title: "Direitos das Crianças", type: "content", duration: 10, order: 9, content: STUB("Direitos das Crianças") },
  ]);
  console.log("✅ Theme 1 lessons created (9)");

  // ── Step 5: Lessons for Theme 2 — Aprender a respeitar os outros ──────────────
  await db.insert(lessons).values([
    { themeId: t2.id, title: "As Funções na Família", type: "content", duration: 10, order: 1, content: STUB("As Funções na Família") },
    { themeId: t2.id, title: "Tarefas Domésticas", type: "content", duration: 10, order: 2, content: STUB("Tarefas Domésticas") },
    { themeId: t2.id, title: "O Respeito pelos Outros", type: "content", duration: 10, order: 3, content: STUB("O Respeito pelos Outros") },
    { themeId: t2.id, title: "As Profissões", type: "content", duration: 10, order: 4, content: STUB("As Profissões") },
    { themeId: t2.id, title: "A Evolução Tecnológica", type: "content", duration: 10, order: 5, content: STUB("A Evolução Tecnológica") },
    { themeId: t2.id, title: "A Forma e a Textura dos Objetos", type: "content", duration: 10, order: 6, content: STUB("A Forma e a Textura dos Objetos") },
  ]);
  console.log("✅ Theme 2 lessons created (6)");

  // ── Step 6: Lessons for Theme 3 — Vamos a diferentes lugares ─────────────────
  await db.insert(lessons).values([
    { themeId: t3.id, title: "A Sua Localidade", type: "content", duration: 10, order: 1, content: STUB("A Sua Localidade") },
    { themeId: t3.id, title: "Os Itinerários Diários", type: "content", duration: 10, order: 2, content: STUB("Os Itinerários Diários") },
    { themeId: t3.id, title: "A Prevenção Rodoviária", type: "content", duration: 10, order: 3, content: STUB("A Prevenção Rodoviária") },
    { themeId: t3.id, title: "A Casa", type: "content", duration: 10, order: 4, content: STUB("A Casa") },
    { themeId: t3.id, title: "A Escola", type: "content", duration: 10, order: 5, content: STUB("A Escola") },
    { themeId: t3.id, title: "Todos Iguais", type: "content", duration: 10, order: 6, content: STUB("Todos Iguais") },
    { themeId: t3.id, title: "A Preservação dos Espaços Comuns", type: "content", duration: 10, order: 7, content: STUB("A Preservação dos Espaços Comuns") },
    { themeId: t3.id, title: "Regras em Casa e na Escola", type: "content", duration: 10, order: 8, content: STUB("Regras em Casa e na Escola") },
  ]);
  console.log("✅ Theme 3 lessons created (8)");

  // ── Step 7: Lessons for Theme 4 — Como cuidar de nós? ────────────────────────
  await db.insert(lessons).values([
    { themeId: t4.id, title: "A Alimentação", type: "content", duration: 10, order: 1, content: STUB("A Alimentação") },
    { themeId: t4.id, title: "Dissolve-se ou Não?", type: "content", duration: 10, order: 2, content: STUB("Dissolve-se ou Não?") },
    { themeId: t4.id, title: "A Saúde", type: "content", duration: 10, order: 3, content: STUB("A Saúde") },
    { themeId: t4.id, title: "A Higiene", type: "content", duration: 10, order: 4, content: STUB("A Higiene") },
    { themeId: t4.id, title: "As Rotinas Diárias", type: "content", duration: 10, order: 5, content: STUB("As Rotinas Diárias") },
    { themeId: t4.id, title: "Os Comportamentos de Risco", type: "content", duration: 10, order: 6, content: STUB("Os Comportamentos de Risco") },
    { themeId: t4.id, title: "Manusear os Objetos", type: "content", duration: 10, order: 7, content: STUB("Manusear os Objetos") },
  ]);
  console.log("✅ Theme 4 lessons created (7)");

  // ── Step 8: Lessons for Theme 5 — Descobrir o mundo ──────────────────────────
  await db.insert(lessons).values([
    { themeId: t5.id, title: "A Paisagem", type: "content", duration: 10, order: 1, content: STUB("A Paisagem") },
    { themeId: t5.id, title: "Os Seres Vivos", type: "content", duration: 10, order: 2, content: STUB("Os Seres Vivos") },
    { themeId: t5.id, title: "As Características dos Animais", type: "content", duration: 10, order: 3, content: STUB("As Características dos Animais") },
    { themeId: t5.id, title: "À Descoberta de um Animal", type: "content", duration: 10, order: 4, content: STUB("À Descoberta de um Animal") },
    { themeId: t5.id, title: "As Necessidades Básicas dos Seres Vivos", type: "content", duration: 10, order: 5, content: STUB("As Necessidades Básicas dos Seres Vivos") },
    { themeId: t5.id, title: "Dar Vida de Novo", type: "content", duration: 10, order: 6, content: STUB("Dar Vida de Novo") },
    { themeId: t5.id, title: "Germinação da Semente", type: "content", duration: 10, order: 7, content: STUB("Germinação da Semente") },
    { themeId: t5.id, title: "A Importância do Sol", type: "content", duration: 10, order: 8, content: STUB("A Importância do Sol") },
    { themeId: t5.id, title: "Bem Estar Animal", type: "content", duration: 10, order: 9, content: STUB("Bem Estar Animal") },
  ]);
  console.log("✅ Theme 5 lessons created (9)");

  // ── Step 9: Lessons for Theme 6 — O ambiente e o mundo à volta ───────────────
  await db.insert(lessons).values([
    { themeId: t6.id, title: "O Planeta Terra", type: "content", duration: 10, order: 1, content: STUB("O Planeta Terra") },
    { themeId: t6.id, title: "A Preservação do Ambiente", type: "content", duration: 10, order: 2, content: STUB("A Preservação do Ambiente") },
    { themeId: t6.id, title: "Reciclar", type: "content", duration: 10, order: 3, content: STUB("Reciclar") },
    { themeId: t6.id, title: "Educação Ambiental", type: "content", duration: 10, order: 4, content: STUB("Educação Ambiental") },
    { themeId: t6.id, title: "A Tecnologia ao Nosso Dispor", type: "content", duration: 10, order: 5, content: STUB("A Tecnologia ao Nosso Dispor") },
    { themeId: t6.id, title: "O Brilho", type: "content", duration: 10, order: 6, content: STUB("O Brilho") },
    { themeId: t6.id, title: "As Cores e os Cheiros", type: "content", duration: 10, order: 7, content: STUB("As Cores e os Cheiros") },
    { themeId: t6.id, title: "A Segurança Junto à Água", type: "content", duration: 10, order: 8, content: STUB("A Segurança Junto à Água") },
    { themeId: t6.id, title: "Flutua ou Não Flutua?", type: "content", duration: 10, order: 9, content: STUB("Flutua ou Não Flutua?") },
    { themeId: t6.id, title: "Os Estados do Tempo", type: "content", duration: 10, order: 10, content: STUB("Os Estados do Tempo") },
  ]);
  console.log("✅ Theme 6 lessons created (10)");

  console.log("\n🎉 Grade 1 restructured successfully!");
  console.log("   6 themes · 49 lessons (2 with full content, 47 stubs)");
  process.exit(0);
}

restructure().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
