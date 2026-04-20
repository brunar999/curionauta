import "dotenv/config";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ── Body parsing ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Sessions ───────────────────────────────────────────────────────────────────
const PgSession = connectPgSimple(session);
const { Pool } = pg;

const sessionStore = process.env.DATABASE_URL
  ? new PgSession({
      pool: new Pool({ connectionString: process.env.DATABASE_URL }),
      createTableIfMissing: true,
    })
  : undefined;

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "curionauta-dev-secret-change-in-prod",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

// ── API routes ─────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── Serve frontend (production) ────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "public");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 CurioNauta server running on http://localhost:${PORT}`);
});

// ── Session type augmentation ──────────────────────────────────────────────────
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}
