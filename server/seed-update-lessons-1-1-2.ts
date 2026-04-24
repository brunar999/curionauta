import "dotenv/config";
import { db } from "./db";
import { themes, lessons } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// ── Rich content for 1.1 — As Etapas da Vida Humana ──────────────────────────
const CONTENT_1_1 = `
<h2>As Etapas da Vida Humana</h2>
<p style="font-size:17px;color:var(--ink-soft);margin-bottom:28px">
  As pessoas passam por várias fases ao longo da vida.<br>
  Em cada fase, crescemos, mudamos e aprendemos coisas novas.<br>
  <strong>Vamos descobrir quais são essas fases!</strong>
</p>

<!-- Phase 1: Infância -->
<div style="background:#FFF3D1;border-radius:20px;border:3px solid #FFC94A;box-shadow:0 6px 0 #E6B000;padding:28px;margin-bottom:24px">
  <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
    <span style="font-size:56px">👶</span>
    <div>
      <h3 style="margin:0;font-size:28px;color:var(--purple-700)">1. Infância</h3>
      <span style="background:var(--purple-100);color:var(--purple-700);font-family:Fredoka;font-weight:700;font-size:13px;padding:4px 12px;border-radius:999px">0 – 11 anos</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🍼</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">É o <strong>início da vida</strong>. O bebé precisa de ajuda para tudo: comer, vestir-se, andar.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🚶</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Aprende a <strong>gatinhar, falar</strong> e dar os primeiros passos.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">😴</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Dorme muito e <strong>cresce rapidamente</strong>. Gosta de colo e de ouvir vozes familiares.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🏫</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">É quando vamos à escola e aprendemos a <strong>ler, escrever e contar</strong>.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🦷</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Crescemos, <strong>trocamos os dentes</strong> e ganhamos mais força.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🎉</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Brincamos, fazemos amigos e começamos a ser mais <strong>independentes</strong>. Uma fase cheia de alegria!</p>
    </div>
  </div>
</div>

<!-- Phase 2: Adolescência -->
<div style="background:#DCF5EB;border-radius:20px;border:3px solid #09AA86;box-shadow:0 6px 0 #077A60;padding:28px;margin-bottom:24px">
  <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
    <span style="font-size:56px">🧑‍🎓</span>
    <div>
      <h3 style="margin:0;font-size:28px;color:var(--green-600)">2. Adolescência</h3>
      <span style="background:var(--green-100);color:var(--green-600);font-family:Fredoka;font-weight:700;font-size:13px;padding:4px 12px;border-radius:999px">12 – 18 anos</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">📏</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">O corpo muda muito: ficamos <strong>mais altos e fortes</strong>.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🧠</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Começamos a pensar como adultos, mas <strong>ainda precisamos de ajuda e conselhos</strong>.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">💭</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">É uma fase de <strong>crescimento e mudanças emocionais</strong>.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🔭</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Os adolescentes gostam de descobrir <strong>quem são</strong> e o que querem fazer no futuro.</p>
    </div>
  </div>
</div>

<!-- Phase 3: Idade Adulta -->
<div style="background:#DEEEFF;border-radius:20px;border:3px solid #6FB9FF;box-shadow:0 6px 0 #3A8FD6;padding:28px;margin-bottom:24px">
  <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
    <span style="font-size:56px">🧑</span>
    <div>
      <h3 style="margin:0;font-size:28px;color:#1A5FA3">3. Idade Adulta</h3>
      <span style="background:#DEEEFF;color:#1A5FA3;font-family:Fredoka;font-weight:700;font-size:13px;padding:4px 12px;border-radius:999px">19 – 60 anos</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">✅</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">O corpo <strong>atinge o tamanho final</strong>. Já não cresce mais.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">💼</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Os adultos <strong>trabalham</strong>, cuidam da casa e ajudam os mais novos.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🏠</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">É uma fase de <strong>responsabilidade e maturidade</strong>.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">👨‍👩‍👧</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Podem ser <strong>pais ou mães</strong> e continuar sempre a aprender.</p>
    </div>
  </div>
</div>

<!-- Phase 4: Velhice -->
<div style="background:#FFE2DE;border-radius:20px;border:3px solid #FA697A;box-shadow:0 6px 0 #C9394A;padding:28px;margin-bottom:28px">
  <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
    <span style="font-size:56px">👵</span>
    <div>
      <h3 style="margin:0;font-size:28px;color:#A13A2E">4. Velhice</h3>
      <span style="background:#FFE2DE;color:#A13A2E;font-family:Fredoka;font-weight:700;font-size:13px;padding:4px 12px;border-radius:999px">+ 60 anos</span>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🐌</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">O corpo fica <strong>mais lento</strong> e aparecem cabelos brancos e rugas.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">📚</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">As pessoas idosas têm muita <strong>experiência e sabedoria</strong>.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">💬</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Gostam de <strong>contar histórias</strong> e relembrar o passado.</p>
    </div>
    <div style="background:white;border-radius:12px;padding:14px;display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:22px">🤗</span>
      <p style="margin:0;font-size:14px;color:var(--ink-soft)">Precisam de <strong>carinho e companhia</strong>.</p>
    </div>
  </div>
</div>

<!-- Summary: order -->
<div style="background:var(--purple-50);border-radius:16px;padding:24px;border:2.5px solid var(--purple-100)">
  <h3 style="margin:0 0 16px;color:var(--purple-700);text-align:center">A ordem das fases da vida</h3>
  <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap">
    <div style="text-align:center">
      <div style="font-size:32px">👶</div>
      <div style="font-family:Fredoka;font-weight:700;font-size:14px;color:var(--purple-700);background:#FFF3D1;padding:6px 12px;border-radius:999px;margin-top:4px">Infância</div>
    </div>
    <span style="font-size:24px;color:var(--ink-mute)">→</span>
    <div style="text-align:center">
      <div style="font-size:32px">🧑‍🎓</div>
      <div style="font-family:Fredoka;font-weight:700;font-size:14px;color:var(--green-600);background:var(--green-100);padding:6px 12px;border-radius:999px;margin-top:4px">Adolescência</div>
    </div>
    <span style="font-size:24px;color:var(--ink-mute)">→</span>
    <div style="text-align:center">
      <div style="font-size:32px">🧑</div>
      <div style="font-family:Fredoka;font-weight:700;font-size:14px;color:#1A5FA3;background:#DEEEFF;padding:6px 12px;border-radius:999px;margin-top:4px">Idade Adulta</div>
    </div>
    <span style="font-size:24px;color:var(--ink-mute)">→</span>
    <div style="text-align:center">
      <div style="font-size:32px">👵</div>
      <div style="font-family:Fredoka;font-weight:700;font-size:14px;color:#A13A2E;background:#FFE2DE;padding:6px 12px;border-radius:999px;margin-top:4px">Velhice</div>
    </div>
  </div>
</div>
`;

// ── Rich content for 1.2 — As Transformações do Corpo ────────────────────────
const CONTENT_1_2 = `
<h2>As Transformações do Corpo</h2>
<p style="font-size:17px;color:var(--ink-soft);margin-bottom:28px">
  O nosso corpo <strong>não fica sempre igual</strong> — muda ao longo de toda a vida!<br>
  Vamos descobrir como o corpo se transforma em cada fase.
</p>

<!-- How body changes per phase -->
<h3 style="font-size:22px;margin-bottom:16px;color:var(--purple-700)">🔄 Como o corpo muda em cada fase</h3>

<div style="display:flex;flex-direction:column;gap:14px;margin-bottom:32px">
  <div style="background:#FFF3D1;border-radius:16px;border:2.5px solid #FFC94A;padding:20px;display:flex;gap:16px;align-items:flex-start">
    <span style="font-size:44px;flex-shrink:0">👶</span>
    <div>
      <h4 style="margin:0 0 8px;font-family:Fredoka;font-size:20px;color:var(--purple-700)">Infância</h4>
      <p style="margin:0 0 8px;font-size:15px;color:var(--ink-soft)">O corpo <strong>cresce rapidamente</strong> e aprendemos a andar e a falar.</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #FFC94A">🚶 Aprende a andar</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #FFC94A">💬 Aprende a falar</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #FFC94A">🦷 Dentes de leite</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #FFC94A">📏 Cresce muito</span>
      </div>
    </div>
  </div>

  <div style="background:#DCF5EB;border-radius:16px;border:2.5px solid #09AA86;padding:20px;display:flex;gap:16px;align-items:flex-start">
    <span style="font-size:44px;flex-shrink:0">🧑‍🎓</span>
    <div>
      <h4 style="margin:0 0 8px;font-family:Fredoka;font-size:20px;color:var(--green-600)">Adolescência</h4>
      <p style="margin:0 0 8px;font-size:15px;color:var(--ink-soft)">O corpo <strong>muda muito</strong> e ficamos mais altos.</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #09AA86">📏 Fica mais alto</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #09AA86">💪 Fica mais forte</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #09AA86">🦴 Ossos crescem</span>
      </div>
    </div>
  </div>

  <div style="background:#DEEEFF;border-radius:16px;border:2.5px solid #6FB9FF;padding:20px;display:flex;gap:16px;align-items:flex-start">
    <span style="font-size:44px;flex-shrink:0">🧑</span>
    <div>
      <h4 style="margin:0 0 8px;font-family:Fredoka;font-size:20px;color:#1A5FA3">Idade Adulta</h4>
      <p style="margin:0 0 8px;font-size:15px;color:var(--ink-soft)">O corpo <strong>deixa de crescer</strong> e estabiliza.</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #6FB9FF">✅ Corpo completo</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #6FB9FF">💼 Trabalha</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #6FB9FF">🦷 32 dentes</span>
      </div>
    </div>
  </div>

  <div style="background:#FFE2DE;border-radius:16px;border:2.5px solid #FA697A;padding:20px;display:flex;gap:16px;align-items:flex-start">
    <span style="font-size:44px;flex-shrink:0">👵</span>
    <div>
      <h4 style="margin:0 0 8px;font-family:Fredoka;font-size:20px;color:#A13A2E">Velhice</h4>
      <p style="margin:0 0 8px;font-size:15px;color:var(--ink-soft)">O corpo fica <strong>mais lento</strong> e aparecem cabelos brancos.</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #FA697A">🐌 Mais lento</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #FA697A">🩶 Cabelos brancos</span>
        <span style="background:white;border-radius:8px;padding:5px 10px;font-size:13px;border:1.5px solid #FA697A">🧴 Rugas na pele</span>
      </div>
    </div>
  </div>
</div>

<!-- Specific body parts that change -->
<h3 style="font-size:22px;margin-bottom:16px;color:var(--purple-700)">🦷 Partes do corpo que mudam</h3>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:32px">
  <div style="background:var(--paper);border-radius:16px;border:2.5px solid var(--line);padding:20px">
    <div style="font-size:36px;margin-bottom:8px">🦷</div>
    <h4 style="margin:0 0 6px;font-family:Fredoka;font-size:18px;color:var(--purple-700)">Os Dentes</h4>
    <p style="margin:0;font-size:14px;color:var(--ink-soft)">Primeiro temos os <strong>dentes de leite</strong>. Depois caem e nascem os <strong>dentes definitivos</strong>. Um adulto tem normalmente <strong>32 dentes</strong>!</p>
  </div>
  <div style="background:var(--paper);border-radius:16px;border:2.5px solid var(--line);padding:20px">
    <div style="font-size:36px;margin-bottom:8px">🦴</div>
    <h4 style="margin:0 0 6px;font-family:Fredoka;font-size:18px;color:var(--purple-700)">Os Ossos</h4>
    <p style="margin:0;font-size:14px;color:var(--ink-soft)">Os ossos <strong>crescem</strong> quando somos novos e ficam <strong>mais fortes</strong> com exercício e boa alimentação.</p>
  </div>
  <div style="background:var(--paper);border-radius:16px;border:2.5px solid var(--line);padding:20px">
    <div style="font-size:36px;margin-bottom:8px">💇</div>
    <h4 style="margin:0 0 6px;font-family:Fredoka;font-size:18px;color:var(--purple-700)">O Cabelo</h4>
    <p style="margin:0;font-size:14px;color:var(--ink-soft)">O cabelo <strong>cresce</strong> ao longo do tempo. Quando ficamos mais velhos, pode ficar <strong>branco ou cinzento</strong>.</p>
  </div>
  <div style="background:var(--paper);border-radius:16px;border:2.5px solid var(--line);padding:20px">
    <div style="font-size:36px;margin-bottom:8px">🧴</div>
    <h4 style="margin:0 0 6px;font-family:Fredoka;font-size:18px;color:var(--purple-700)">A Pele</h4>
    <p style="margin:0;font-size:14px;color:var(--ink-soft)">A pele <strong>protege o corpo</strong>. Com a velhice, aparecem <strong>rugas</strong> — marcas da vida vivida!</p>
  </div>
</div>

<!-- How to help body grow healthy -->
<h3 style="font-size:22px;margin-bottom:16px;color:var(--purple-700)">💪 Como ajudar o corpo a crescer saudável</h3>
<div style="background:var(--green-50);border-radius:16px;border:2.5px solid var(--green-100);padding:24px;margin-bottom:28px">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
    <div style="background:white;border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:36px;margin-bottom:6px">🥦</div>
      <div style="font-family:Fredoka;font-weight:700;font-size:15px;color:var(--green-600)">Comer bem</div>
      <p style="margin:4px 0 0;font-size:12px;color:var(--ink-mute)">Frutas, legumes e proteínas dão energia ao corpo</p>
    </div>
    <div style="background:white;border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:36px;margin-bottom:6px">😴</div>
      <div style="font-family:Fredoka;font-weight:700;font-size:15px;color:var(--green-600)">Dormir bem</div>
      <p style="margin:4px 0 0;font-size:12px;color:var(--ink-mute)">O corpo <strong>cresce</strong> e descansa enquanto dormimos</p>
    </div>
    <div style="background:white;border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:36px;margin-bottom:6px">⚽</div>
      <div style="font-family:Fredoka;font-weight:700;font-size:15px;color:var(--green-600)">Fazer exercício</div>
      <p style="margin:4px 0 0;font-size:12px;color:var(--ink-mute)">O exercício <strong>fortalece</strong> os ossos e os músculos</p>
    </div>
  </div>
</div>

<!-- Fun facts -->
<div style="background:#FFF9F0;border-radius:16px;border:2.5px solid var(--yellow);padding:20px">
  <h4 style="margin:0 0 12px;font-family:Fredoka;font-size:18px;color:var(--purple-700)">⭐ Sabias que…</h4>
  <ul style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px">
    <li style="font-size:14px;color:var(--ink-soft)">O <strong>coração</strong> bombeia o sangue por todo o corpo sem parar!</li>
    <li style="font-size:14px;color:var(--ink-soft)">O <strong>cérebro</strong> é o "computador" do corpo — controla tudo o que fazemos.</li>
    <li style="font-size:14px;color:var(--ink-soft)">As <strong>unhas</strong> crescem nas mãos e nos pés ao longo da vida.</li>
    <li style="font-size:14px;color:var(--ink-soft)">O corpo humano tem <strong>206 ossos</strong>!</li>
  </ul>
</div>
`;

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

async function update() {
  console.log("📝 Updating lesson content for 1.1 and 1.2...");

  const [theme] = await db
    .select()
    .from(themes)
    .where(eq(themes.title, "Nós e a família"))
    .limit(1);

  if (!theme) {
    console.error("❌ Theme 'Nós e a família' not found.");
    process.exit(1);
  }

  const lessonList = await db
    .select()
    .from(lessons)
    .where(eq(lessons.themeId, theme.id));

  const l1 = lessonList.find((l) => l.order === 1); // 1.1
  const l2 = lessonList.find((l) => l.order === 2); // 1.2

  if (!l1 || !l2) {
    console.error("❌ Lessons not found at order 1 or 2.");
    process.exit(1);
  }

  await db
    .update(lessons)
    .set({
      parts: [
        { type: "content", title: "As etapas da vida", content: CONTENT_1_1 },
        { type: "component", title: "Quiz — As etapas da vida", componentId: "GenericQuiz", questions: QUIZ_1_1 },
      ],
    })
    .where(eq(lessons.id, l1.id));
  console.log(`✅ Updated lesson 1.1 (id: ${l1.id})`);

  await db
    .update(lessons)
    .set({
      parts: [
        { type: "content", title: "O corpo muda ao longo da vida", content: CONTENT_1_2 },
        { type: "component", title: "Quiz — As transformações do corpo", componentId: "GenericQuiz", questions: QUIZ_1_2 },
      ],
    })
    .where(eq(lessons.id, l2.id));
  console.log(`✅ Updated lesson 1.2 (id: ${l2.id})`);

  console.log("\n🎉 Content updated successfully!");
  process.exit(0);
}

update().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
