import "dotenv/config";
import { db } from "./db";
import { grades, themes, lessons } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Grades ───────────────────────────────────────────────────────────────────
  const [g1, g2, g3, g4] = await db
    .insert(grades)
    .values([
      { number: 1, name: "1º Ano", description: "Estudo do Meio — 1º ano", icon: "🌱", color: "#DCF5EB" },
      { number: 2, name: "2º Ano", description: "Estudo do Meio — 2º ano", icon: "🌿", color: "#EBE1FB" },
      { number: 3, name: "3º Ano", description: "Estudo do Meio — 3º ano", icon: "🌳", color: "#DEEEFF" },
      { number: 4, name: "4º Ano", description: "Estudo do Meio — 4º ano", icon: "🚀", color: "#FFE2DE" },
    ])
    .returning();

  console.log("✅ Grades created");

  // ── Themes (1º Ano) ──────────────────────────────────────────────────────────
  const themes1 = await db
    .insert(themes)
    .values([
      {
        gradeId: g1.id,
        title: "À Descoberta de Si Mesmo",
        shortTitle: "Quem Sou Eu",
        description: "O meu corpo, a minha identidade e os meus sentidos.",
        icon: "🧒",
        bgColor: "#FFE2DE",
        accentColor: "#FF7A6B",
        order: 1,
      },
      {
        gradeId: g1.id,
        title: "À Descoberta dos Outros",
        shortTitle: "A Minha Família",
        description: "A família, a escola e a comunidade onde vivo.",
        icon: "👨‍👩‍👧",
        bgColor: "#FFF3D1",
        accentColor: "#FFC94A",
        order: 2,
      },
      {
        gradeId: g1.id,
        title: "À Descoberta do Ambiente Natural",
        shortTitle: "A Natureza",
        description: "Animais, plantas, o céu e as estações do ano.",
        icon: "🌳",
        bgColor: "#DCF5EB",
        accentColor: "#20B381",
        order: 3,
      },
      {
        gradeId: g1.id,
        title: "Inter-relações entre Espaços",
        shortTitle: "Os Meus Lugares",
        description: "A minha casa, a escola, a rua e Portugal.",
        icon: "🗺️",
        bgColor: "#EBE1FB",
        accentColor: "#7B3EE0",
        order: 4,
      },
      {
        gradeId: g1.id,
        title: "À Descoberta dos Materiais e Objetos",
        shortTitle: "Experiências",
        description: "A água, o ar, e brincar com materiais.",
        icon: "🧪",
        bgColor: "#DEEEFF",
        accentColor: "#6FB9FF",
        order: 5,
      },
    ])
    .returning();

  console.log("✅ Themes (1º ano) created");

  // ── Themes (2º Ano) ──────────────────────────────────────────────────────────
  const themes2 = await db
    .insert(themes)
    .values([
      {
        gradeId: g2.id,
        title: "O Corpo Humano",
        shortTitle: "O Meu Corpo",
        description: "Os órgãos dos sentidos, o esqueleto e os músculos.",
        icon: "🧠",
        bgColor: "#FFE2DE",
        accentColor: "#FF7A6B",
        order: 1,
      },
      {
        gradeId: g2.id,
        title: "Os Seres Vivos",
        shortTitle: "Animais e Plantas",
        description: "Características, ciclo de vida e habitats.",
        icon: "🐾",
        bgColor: "#DCF5EB",
        accentColor: "#20B381",
        order: 2,
      },
      {
        gradeId: g2.id,
        title: "A Água",
        shortTitle: "A Água",
        description: "Estados da água, o ciclo da água e a sua importância.",
        icon: "💧",
        bgColor: "#DEEEFF",
        accentColor: "#6FB9FF",
        order: 3,
      },
    ])
    .returning();

  console.log("✅ Themes (2º ano) created");

  // ── Themes (3º Ano) ──────────────────────────────────────────────────────────
  await db.insert(themes).values([
    {
      gradeId: g3.id,
      title: "O Sistema Solar",
      shortTitle: "O Universo",
      description: "Os planetas, o Sol, a Lua e as estrelas.",
      icon: "🪐",
      bgColor: "#EBE1FB",
      accentColor: "#7B3EE0",
      order: 1,
    },
    {
      gradeId: g3.id,
      title: "Os Materiais e as suas Propriedades",
      shortTitle: "Materiais",
      description: "Sólidos, líquidos, gases e as suas transformações.",
      icon: "⚗️",
      bgColor: "#DEEEFF",
      accentColor: "#6FB9FF",
      order: 2,
    },
  ]);

  // ── Themes (4º Ano) ──────────────────────────────────────────────────────────
  await db.insert(themes).values([
    {
      gradeId: g4.id,
      title: "Portugal — História e Geografia",
      shortTitle: "Portugal",
      description: "O território de Portugal, a sua história e diversidade.",
      icon: "🇵🇹",
      bgColor: "#FFE2DE",
      accentColor: "#FF7A6B",
      order: 1,
    },
    {
      gradeId: g4.id,
      title: "O Corpo Humano — Sistemas",
      shortTitle: "Sistemas do Corpo",
      description: "Os sistemas digestivo, respiratório e circulatório.",
      icon: "❤️",
      bgColor: "#FFF3D1",
      accentColor: "#FFC94A",
      order: 2,
    },
  ]);

  console.log("✅ Themes (3º-4º anos) created");

  // ── Lessons — Theme 1: Quem Sou Eu ──────────────────────────────────────────
  const [quemSouEuTheme] = themes1;
  await db.insert(lessons).values([
    {
      themeId: quemSouEuTheme.id,
      title: "O Meu Corpo",
      type: "content",
      duration: 8,
      order: 1,
      content: `<h2>O Meu Corpo</h2>
<p>O nosso corpo é incrível! Tem muitas partes diferentes, cada uma com uma função especial.</p>
<h3>As partes do corpo</h3>
<ul>
  <li><strong>Cabeça</strong> — onde está o nosso cérebro, os olhos, os ouvidos, o nariz e a boca.</li>
  <li><strong>Tronco</strong> — o peito e a barriga, onde estão os órgãos mais importantes.</li>
  <li><strong>Membros superiores</strong> — os braços e as mãos.</li>
  <li><strong>Membros inferiores</strong> — as pernas e os pés.</li>
</ul>
<h3>Os 5 sentidos</h3>
<p>Usamos os nossos sentidos para conhecer o mundo à nossa volta:</p>
<ul>
  <li>👁️ <strong>Visão</strong> — os olhos</li>
  <li>👂 <strong>Audição</strong> — os ouvidos</li>
  <li>👃 <strong>Olfato</strong> — o nariz</li>
  <li>👅 <strong>Paladar</strong> — a língua</li>
  <li>✋ <strong>Tato</strong> — a pele</li>
</ul>`,
    },
    {
      themeId: quemSouEuTheme.id,
      title: "Os Meses do Ano",
      type: "mixed",
      duration: 12,
      order: 2,
      parts: [
        {
          type: "content",
          title: "Aprende os meses",
          content: `<h2>Os 12 Meses do Ano</h2>
<p>O ano tem <strong>12 meses</strong>. Cada mês tem um número de dias diferente.</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0">
  ${[
    ["Janeiro","Fevereiro","Março"],
    ["Abril","Maio","Junho"],
    ["Julho","Agosto","Setembro"],
    ["Outubro","Novembro","Dezembro"],
  ].flat().map((m, i) => `<div style="background:#EBE1FB;border-radius:12px;padding:12px;text-align:center"><strong>${i + 1}</strong><br>${m}</div>`).join("")}
</div>
<p>Os meses de <strong>verão</strong> são: Junho, Julho e Agosto. Os meses de <strong>inverno</strong> são: Dezembro, Janeiro e Fevereiro.</p>`,
        },
        {
          type: "component",
          title: "Quiz dos meses",
          componentId: "MonthsQuiz",
        },
      ],
    },
    {
      themeId: quemSouEuTheme.id,
      title: "As Estações do Ano",
      type: "mixed",
      duration: 12,
      order: 3,
      parts: [
        {
          type: "content",
          title: "As quatro estações",
          content: `<h2>As Quatro Estações do Ano</h2>
<p>O ano divide-se em <strong>4 estações</strong>. Cada estação tem características próprias.</p>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:20px 0">
  <div style="background:#DCF5EB;border-radius:16px;padding:20px">
    <div style="font-size:40px;margin-bottom:8px">🌸</div>
    <h3 style="margin:0 0 6px">Primavera</h3>
    <p style="margin:0;font-size:14px">Março · Abril · Maio<br>Flores, chuva e calor suave.</p>
  </div>
  <div style="background:#FFF3D1;border-radius:16px;padding:20px">
    <div style="font-size:40px;margin-bottom:8px">☀️</div>
    <h3 style="margin:0 0 6px">Verão</h3>
    <p style="margin:0;font-size:14px">Junho · Julho · Agosto<br>Muito calor e dias longos.</p>
  </div>
  <div style="background:#FFE2DE;border-radius:16px;padding:20px">
    <div style="font-size:40px;margin-bottom:8px">🍂</div>
    <h3 style="margin:0 0 6px">Outono</h3>
    <p style="margin:0;font-size:14px">Setembro · Outubro · Novembro<br>Folhas caem e arrefece.</p>
  </div>
  <div style="background:#DEEEFF;border-radius:16px;padding:20px">
    <div style="font-size:40px;margin-bottom:8px">❄️</div>
    <h3 style="margin:0 0 6px">Inverno</h3>
    <p style="margin:0;font-size:14px">Dezembro · Janeiro · Fevereiro<br>Frio, chuva e neve.</p>
  </div>
</div>`,
        },
        {
          type: "component",
          title: "Quiz das estações",
          componentId: "SeasonsQuiz",
        },
      ],
    },
    {
      themeId: quemSouEuTheme.id,
      title: "A Minha Higiene",
      type: "content",
      duration: 8,
      order: 4,
      content: `<h2>A Minha Higiene Pessoal</h2>
<p>Cuidar do nosso corpo é muito importante para nos mantermos saudáveis.</p>
<h3>Hábitos de higiene diários</h3>
<ul>
  <li>🦷 Lavar os dentes <strong>depois de cada refeição</strong> e antes de dormir</li>
  <li>🚿 Tomar banho <strong>todos os dias</strong></li>
  <li>🙌 Lavar as mãos antes de comer e depois de ir à casa de banho</li>
  <li>✂️ Cortar as unhas regularmente</li>
  <li>🛏️ Dormir entre <strong>9 a 11 horas</strong> por noite</li>
</ul>
<p>Quando lavamos as mãos, devemos usar sabão e lavar durante pelo menos 20 segundos — o tempo de cantar os Parabéns duas vezes!</p>`,
    },
    {
      themeId: quemSouEuTheme.id,
      title: "A Alimentação Saudável",
      type: "content",
      duration: 10,
      order: 5,
      content: `<h2>Uma Alimentação Saudável</h2>
<p>O que comemos dá energia ao nosso corpo. É importante comer de forma variada e equilibrada.</p>
<h3>A Roda dos Alimentos</h3>
<p>A roda dos alimentos ajuda-nos a saber o que devemos comer mais e o que devemos comer menos.</p>
<ul>
  <li>🌾 <strong>Cereais e derivados</strong> — pão, arroz, massa (comer em maior quantidade)</li>
  <li>🥦 <strong>Hortícolas</strong> — legumes e verduras</li>
  <li>🍎 <strong>Frutas</strong> — ricas em vitaminas</li>
  <li>🥛 <strong>Laticínios</strong> — leite, queijo, iogurte</li>
  <li>🐟 <strong>Carnes, pescado e ovos</strong> — proteínas</li>
  <li>🫘 <strong>Leguminosas</strong> — feijão, grão, lentilhas</li>
  <li>🫒 <strong>Gorduras e óleos</strong> — azeite (usar com moderação)</li>
</ul>
<p>Não te esqueças de beber bastante <strong>água</strong> — pelo menos 6 copos por dia!</p>`,
    },
  ]);

  // ── Lessons — Theme 3: A Natureza ─────────────────────────────────────────────
  const [, , naturezaTheme] = themes1;
  await db.insert(lessons).values([
    {
      themeId: naturezaTheme.id,
      title: "Animais do Meu Jardim",
      type: "content",
      duration: 8,
      order: 1,
      content: `<h2>Animais do Meu Jardim</h2>
<p>Mesmo no jardim ou no campo perto de casa podemos encontrar muitos animais fascinantes!</p>
<h3>Alguns animais que podes encontrar</h3>
<ul>
  <li>🐛 <strong>Lagarta</strong> — vai transformar-se numa borboleta</li>
  <li>🐝 <strong>Abelha</strong> — produz mel e ajuda as flores a reproduzirem-se</li>
  <li>🐌 <strong>Caracol</strong> — anda devagar e carrega a sua casa nas costas</li>
  <li>🐛 <strong>Minhoca</strong> — vive na terra e ajuda a torná-la fértil</li>
  <li>🦋 <strong>Borboleta</strong> — voa de flor em flor</li>
  <li>🐞 <strong>Joaninha</strong> — tem pintinhas e come pulgões</li>
</ul>
<h3>Como tratar os animais</h3>
<p>Os animais são seres vivos que merecem respeito. Podemos observá-los sem os magoar e sem tirar do seu habitat natural.</p>`,
    },
    {
      themeId: naturezaTheme.id,
      title: "Animais Selvagens e Domésticos",
      type: "mixed",
      duration: 12,
      order: 2,
      parts: [
        {
          type: "content",
          title: "Domésticos e Selvagens",
          content: `<h2>Animais Domésticos e Selvagens</h2>
<p>Os animais podem ser <strong>domésticos</strong> ou <strong>selvagens</strong>.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0">
  <div style="background:#DCF5EB;border-radius:16px;padding:20px">
    <h3 style="margin:0 0 10px">🏡 Domésticos</h3>
    <p style="margin:0 0 10px;font-size:14px">Vivem com as pessoas e dependem delas para sobreviver.</p>
    <p style="margin:0;font-size:24px">🐶 🐱 🐴 🐇 🐄 🐔</p>
  </div>
  <div style="background:#FFE2DE;border-radius:16px;padding:20px">
    <h3 style="margin:0 0 10px">🌳 Selvagens</h3>
    <p style="margin:0 0 10px;font-size:14px">Vivem livremente na natureza e encontram o seu próprio alimento.</p>
    <p style="margin:0;font-size:24px">🦁 🐘 🦒 🐻 🐺 🦊</p>
  </div>
</div>`,
        },
        {
          type: "component",
          title: "Jogo — Classifica os animais",
          componentId: "AnimalsDragDrop",
        },
      ],
    },
    {
      themeId: naturezaTheme.id,
      title: "Plantas: Raiz, Caule, Folha",
      type: "content",
      duration: 10,
      order: 3,
      content: `<h2>As Partes de uma Planta</h2>
<p>As plantas têm várias partes, cada uma com uma função importante.</p>
<ul>
  <li>🌱 <strong>Raiz</strong> — fixa a planta ao solo e absorve água e sais minerais</li>
  <li>🪵 <strong>Caule</strong> — sustenta a planta e transporta a água e nutrientes</li>
  <li>🍃 <strong>Folha</strong> — realiza a fotossíntese (transforma a luz do sol em alimento)</li>
  <li>🌸 <strong>Flor</strong> — serve para a reprodução da planta</li>
  <li>🍎 <strong>Fruto</strong> — contém as sementes para novas plantas</li>
  <li>🌰 <strong>Semente</strong> — dá origem a uma nova planta</li>
</ul>
<h3>A Fotossíntese</h3>
<p>As plantas fabricam o seu próprio alimento usando:</p>
<ul>
  <li>☀️ Luz do Sol</li>
  <li>💧 Água (absorvida pelas raízes)</li>
  <li>💨 Dióxido de carbono (absorvido pelas folhas)</li>
</ul>
<p>E libertam <strong>oxigénio</strong> — o ar que nós respiramos!</p>`,
    },
    {
      themeId: naturezaTheme.id,
      title: "As Estações do Ano — A Natureza",
      type: "content",
      duration: 9,
      order: 4,
      content: `<h2>As Estações do Ano e a Natureza</h2>
<p>As estações do ano afetam a natureza de formas muito diferentes.</p>
<h3>🌸 Na Primavera</h3>
<p>As flores desabrocham, os animais saem da hibernação, os pássaros fazem ninhos.</p>
<h3>☀️ No Verão</h3>
<p>Os dias são longos e quentes. As plantas crescem muito. Muitos frutos amadurecem.</p>
<h3>🍂 No Outono</h3>
<p>As folhas das árvores ficam amarelas e caem. Os animais preparam-se para o inverno.</p>
<h3>❄️ No Inverno</h3>
<p>Muitas árvores ficam sem folhas. Alguns animais hibernam. Pode nevar nas montanhas.</p>`,
    },
  ]);

  // ── Lessons — Theme: O Corpo Humano (2º Ano) ─────────────────────────────────
  const [corpoHumanoTheme] = themes2;
  await db.insert(lessons).values([
    {
      themeId: corpoHumanoTheme.id,
      title: "Os Órgãos dos Sentidos",
      type: "content",
      duration: 10,
      order: 1,
      content: `<h2>Os Órgãos dos Sentidos</h2>
<p>Os órgãos dos sentidos permitem-nos receber informação do mundo à nossa volta.</p>
<ul>
  <li>👁️ <strong>Olhos (visão)</strong> — captam a luz e permitem-nos ver cores, formas e movimento</li>
  <li>👂 <strong>Ouvidos (audição)</strong> — captam as vibrações do ar que se transformam em sons</li>
  <li>👃 <strong>Nariz (olfato)</strong> — detecta os cheiros das substâncias no ar</li>
  <li>👅 <strong>Língua (paladar)</strong> — detecta os sabores: doce, salgado, ácido e amargo</li>
  <li>✋ <strong>Pele (tato)</strong> — detecta temperatura, pressão, dor e textura</li>
</ul>
<p>Todos os sentidos enviam mensagens ao <strong>cérebro</strong>, que interpreta a informação.</p>`,
    },
    {
      themeId: corpoHumanoTheme.id,
      title: "O Esqueleto",
      type: "content",
      duration: 12,
      order: 2,
      content: `<h2>O Esqueleto Humano</h2>
<p>O esqueleto é o conjunto de todos os ossos do nosso corpo. Tem funções muito importantes:</p>
<ul>
  <li>🦴 <strong>Suporte</strong> — mantém o corpo ereto</li>
  <li>🛡️ <strong>Proteção</strong> — protege órgãos vitais (o crânio protege o cérebro)</li>
  <li>🏃 <strong>Movimento</strong> — junto com os músculos, permite-nos mover</li>
</ul>
<h3>Alguns ossos importantes</h3>
<ul>
  <li><strong>Crânio</strong> — protege o cérebro</li>
  <li><strong>Coluna vertebral</strong> — sustenta o corpo e protege a espinal medula</li>
  <li><strong>Costelas</strong> — protegem o coração e os pulmões</li>
  <li><strong>Fémur</strong> — o maior osso do corpo, na coxa</li>
</ul>
<p>Os ossos são feitos de um material duro chamado <strong>cálcio</strong>. O leite e os lacticínios ajudam os ossos a crescer fortes!</p>`,
    },
  ]);

  console.log("✅ Lessons created");
  console.log("🎉 Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
