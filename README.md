# CurioNauta 🦦

> Plataforma educativa de **Estudo do Meio** para o 1º ao 4º ano do ensino básico português.

CurioNauta torna a aprendizagem das ciências divertida e interativa — com quizzes, jogos de arrastar, acompanhamento de progresso e conteúdo 100% alinhado com o currículo nacional português.

---

## ✨ Funcionalidades

- 📚 **Lições por ano e tema** — navegação hierárquica: Ano → Tema → Lição
- 🎯 **Quizzes interativos** — perguntas com feedback imediato e sistema de pontuação
- ✋ **Jogos drag-and-drop** — classificação de animais e outras atividades
- 📊 **Acompanhamento de progresso** — tempo de estudo, respostas certas, estrelas ganhas
- 👨‍👩‍👧 **Multi-estudante** — uma conta para toda a família, perfis individuais por criança
- 🇵🇹 **100% em Português de Portugal**

---

## 🛠 Tech Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Estilos | Tailwind CSS + sistema de design customizado |
| Routing | Wouter |
| Estado / Fetch | TanStack Query |
| Backend | Express.js + Node.js |
| Base de dados | PostgreSQL |
| ORM | Drizzle ORM |
| Autenticação | Sessões (→ Clerk em breve) |
| Deploy | Railway |

---

## 🚀 Como correr localmente

### Pré-requisitos

- Node.js 20+
- PostgreSQL (local ou [Neon](https://neon.tech) / [Railway](https://railway.app))

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edita o `.env` com os teus valores:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=uma-string-secreta-longa
PORT=5000
NODE_ENV=development
```

### 3. Criar as tabelas

```bash
npm run db:push
```

### 4. Popular a base de dados com conteúdo

```bash
npm run db:seed
```

Isto cria os 4 anos escolares, temas e lições iniciais (meses, estações, animais, corpo humano, etc.)

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) no browser.

---

## 📁 Estrutura do projeto

```
curionauta/
├── client/
│   ├── index.html
│   └── src/
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   └── lessons/         # Quizzes e jogos interativos
│       ├── context/             # StudentContext (perfil ativo)
│       ├── hooks/               # useAuth, useProgress
│       ├── lib/                 # queryClient, utils
│       ├── pages/               # Landing, Dashboard, Grade, Theme, Lesson...
│       ├── App.tsx              # Routing (Wouter)
│       ├── index.css            # Sistema de design (variáveis CSS)
│       └── main.tsx
├── server/
│   ├── db.ts                    # Ligação PostgreSQL (Drizzle)
│   ├── routes.ts                # API REST
│   ├── seed.ts                  # Popular base de dados
│   ├── storage.ts               # Camada de acesso a dados
│   └── index.ts                 # Express app
├── shared/
│   └── schema.ts                # Schema Drizzle (partilhado frontend/backend)
├── .env.example
├── drizzle.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🗄 Estrutura da base de dados

```
users          → contas de utilizador (email + password)
students       → perfis de aluno (múltiplos por conta)
grades         → anos escolares (1º ao 4º)
themes         → temas por ano (ex: "À Descoberta de Si Mesmo")
lessons        → lições por tema (conteúdo, quiz, drag-drop, misto)
lesson_progress → progresso por aluno por lição
```

---

## 🔌 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/grades
GET    /api/grades/:id
GET    /api/grades/:id/themes
GET    /api/themes/:id
GET    /api/themes/:id/lessons
GET    /api/lessons/:id

GET    /api/students              (auth)
POST   /api/students              (auth)
PATCH  /api/students/:id          (auth)
DELETE /api/students/:id          (auth)
GET    /api/students/:id/progress (auth)
GET    /api/students/:id/stats    (auth)
POST   /api/progress              (auth)
```

---

## 📜 Scripts disponíveis

```bash
npm run dev        # Servidor de desenvolvimento (porta 5000 + Vite 5173)
npm run build      # Build de produção
npm run start      # Iniciar em produção
npm run check      # Verificar TypeScript
npm run db:push    # Criar/atualizar tabelas na base de dados
npm run db:seed    # Popular a base de dados com conteúdo inicial
npm run db:studio  # Abrir Drizzle Studio (UI para a BD)
```

---

## 🚢 Deploy (Railway)

1. Cria um projeto em [railway.app](https://railway.app)
2. Adiciona um serviço **PostgreSQL**
3. Liga o repositório GitHub ao projeto
4. Define as variáveis de ambiente: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`
5. O Railway deteta automaticamente o `package.json` e corre `npm run build` + `npm run start`

---

## 🗺 Roadmap

- [ ] Autenticação com Clerk (Google + email)
- [ ] Mais lições e temas para todos os anos
- [ ] Sistema de conquistas e medalhas
- [ ] Modo escuro
- [ ] App mobile (React Native)
- [ ] Painel para pais/professores

---

## 📄 Licença

MIT © CurioNauta
