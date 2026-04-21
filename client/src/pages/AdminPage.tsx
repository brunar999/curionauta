import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiFetch } from "@/lib/queryClient";
import Header from "@/components/Header";
import type { Grade, Theme, Lesson } from "@shared/schema";

type Tab = "lessons" | "themes" | "grades";

// ── Grade form ─────────────────────────────────────────────────────────────────
function GradeForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Grade>;
  onSave: (data: Partial<Grade>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    number: initial?.number ?? 1,
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    icon: initial?.icon ?? "",
    color: initial?.color ?? "",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
        <div>
          <label className="form-label">Número</label>
          <input className="form-input" type="number" min={1} max={4} value={form.number} onChange={(e) => setForm({ ...form, number: Number(e.target.value) })} />
        </div>
        <div>
          <label className="form-label">Nome</label>
          <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="1º Ano" />
        </div>
      </div>
      <div>
        <label className="form-label">Descrição</label>
        <input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label className="form-label">Ícone (emoji)</label>
          <input className="form-input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🌱" />
        </div>
        <div>
          <label className="form-label">Cor (CSS)</label>
          <input className="form-input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="#FFF3E0" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary btn-sm" onClick={() => onSave(form)} disabled={!form.name}>Guardar</button>
      </div>
    </div>
  );
}

// ── Theme form ─────────────────────────────────────────────────────────────────
function ThemeForm({
  initial,
  grades,
  onSave,
  onCancel,
}: {
  initial?: Partial<Theme>;
  grades: Grade[];
  onSave: (data: Partial<Theme>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    gradeId: initial?.gradeId ?? grades[0]?.id ?? 1,
    title: initial?.title ?? "",
    shortTitle: initial?.shortTitle ?? "",
    description: initial?.description ?? "",
    icon: initial?.icon ?? "",
    bgColor: initial?.bgColor ?? "",
    accentColor: initial?.accentColor ?? "",
    order: initial?.order ?? 0,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label className="form-label">Ano</label>
        <select className="form-input" value={form.gradeId} onChange={(e) => setForm({ ...form, gradeId: Number(e.target.value) })}>
          {grades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Título</label>
        <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label className="form-label">Título curto</label>
          <input className="form-input" value={form.shortTitle} onChange={(e) => setForm({ ...form, shortTitle: e.target.value })} />
        </div>
        <div>
          <label className="form-label">Ordem</label>
          <input className="form-input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
      </div>
      <div>
        <label className="form-label">Descrição</label>
        <input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div>
          <label className="form-label">Ícone</label>
          <input className="form-input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </div>
        <div>
          <label className="form-label">Cor de fundo</label>
          <input className="form-input" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} />
        </div>
        <div>
          <label className="form-label">Cor de destaque</label>
          <input className="form-input" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary btn-sm" onClick={() => onSave(form)} disabled={!form.title}>Guardar</button>
      </div>
    </div>
  );
}

// ── Lesson form ────────────────────────────────────────────────────────────────
function LessonForm({
  initial,
  themes,
  onSave,
  onCancel,
}: {
  initial?: Partial<Lesson>;
  themes: Theme[];
  onSave: (data: Partial<Lesson>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    themeId: initial?.themeId ?? themes[0]?.id ?? 1,
    title: initial?.title ?? "",
    type: initial?.type ?? "content",
    duration: initial?.duration ?? 10,
    order: initial?.order ?? 0,
    content: initial?.content ?? "",
    parts: initial?.parts ? JSON.stringify(initial.parts, null, 2) : "",
  });
  const [partsError, setPartsError] = useState("");

  function handleSave() {
    let parsedParts = undefined;
    if (form.parts.trim()) {
      try {
        parsedParts = JSON.parse(form.parts);
        setPartsError("");
      } catch {
        setPartsError("JSON inválido no campo 'Partes'");
        return;
      }
    }
    onSave({ ...form, parts: parsedParts ?? null });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label className="form-label">Tema</label>
        <select className="form-input" value={form.themeId} onChange={(e) => setForm({ ...form, themeId: Number(e.target.value) })}>
          {themes.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Título</label>
        <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div>
          <label className="form-label">Tipo</label>
          <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="content">content</option>
            <option value="quiz">quiz</option>
            <option value="drag-drop">drag-drop</option>
            <option value="mixed">mixed</option>
          </select>
        </div>
        <div>
          <label className="form-label">Duração (min)</label>
          <input className="form-input" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
        </div>
        <div>
          <label className="form-label">Ordem</label>
          <input className="form-input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </div>
      </div>
      <div>
        <label className="form-label">Conteúdo HTML</label>
        <textarea
          className="form-input"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={6}
          style={{ fontFamily: "monospace", fontSize: 13, resize: "vertical" }}
          placeholder="<p>Conteúdo da lição em HTML…</p>"
        />
      </div>
      <div>
        <label className="form-label">Partes (JSON — para tipo "mixed")</label>
        <textarea
          className="form-input"
          value={form.parts}
          onChange={(e) => { setForm({ ...form, parts: e.target.value }); setPartsError(""); }}
          rows={6}
          style={{ fontFamily: "monospace", fontSize: 13, resize: "vertical", borderColor: partsError ? "var(--coral)" : undefined }}
          placeholder='[{"type":"content","title":"Introdução","content":"<p>...</p>"}]'
        />
        {partsError && <div style={{ color: "var(--coral)", fontSize: 13, marginTop: 4 }}>{partsError}</div>}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.title}>Guardar</button>
      </div>
    </div>
  );
}

// ── Main AdminPage ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("lessons");
  const qc = useQueryClient();

  // Admin access check
  const { data: adminCheck, isError: notAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["admin-check"],
    queryFn: () => apiFetch("/api/admin/check"),
    retry: false,
  });

  const { data: grades } = useQuery<Grade[]>({
    queryKey: ["admin-grades"],
    queryFn: () => apiFetch("/api/admin/grades"),
    enabled: !!adminCheck,
  });

  const { data: themes } = useQuery<Theme[]>({
    queryKey: ["admin-themes"],
    queryFn: () => apiFetch("/api/admin/themes"),
    enabled: !!adminCheck,
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["admin-lessons"],
    queryFn: () => apiFetch("/api/admin/lessons"),
    enabled: !!adminCheck,
  });

  // Editing state
  const [editingLesson, setEditingLesson] = useState<Lesson | null | "new">(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null | "new">(null);
  const [editingGrade, setEditingGrade] = useState<Grade | null | "new">(null);

  // Mutations
  const createLessonMut = useMutation({
    mutationFn: (data: Partial<Lesson>) => apiFetch("/api/admin/lessons", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-lessons"] }); setEditingLesson(null); },
  });

  const updateLessonMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Lesson> }) =>
      apiFetch(`/api/admin/lessons/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-lessons"] }); setEditingLesson(null); },
  });

  const deleteLessonMut = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/admin/lessons/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-lessons"] }),
  });

  const createThemeMut = useMutation({
    mutationFn: (data: Partial<Theme>) => apiFetch("/api/admin/themes", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-themes"] }); setEditingTheme(null); },
  });

  const updateThemeMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Theme> }) =>
      apiFetch(`/api/admin/themes/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-themes"] }); setEditingTheme(null); },
  });

  const deleteThemeMut = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/admin/themes/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-themes"] }),
  });

  const createGradeMut = useMutation({
    mutationFn: (data: Partial<Grade>) => apiFetch("/api/admin/grades", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-grades"] }); setEditingGrade(null); },
  });

  const updateGradeMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Grade> }) =>
      apiFetch(`/api/admin/grades/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-grades"] }); setEditingGrade(null); },
  });

  const deleteGradeMut = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/admin/grades/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-grades"] }),
  });

  if (checkingAdmin) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "Fredoka", fontSize: 22, color: "var(--purple-600)" }}>A verificar acesso… 🦦</div>
      </div>
    );
  }

  if (notAdmin) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 28, marginBottom: 12 }}>Acesso negado</h2>
          <p style={{ color: "var(--ink-mute)", marginBottom: 24 }}>Só o administrador pode aceder a esta página.</p>
          <Link href="/dashboard"><button className="btn btn-primary">← Voltar ao início</button></Link>
        </div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "lessons", label: "📖 Lições" },
    { id: "themes", label: "🗂 Temas" },
    { id: "grades", label: "🎓 Anos" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      <Header />

      <div className="container" style={{ padding: "32px 28px 60px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontSize: 30, margin: 0 }}>Painel de Administração</h1>
              <span className="chip" style={{ background: "var(--coral)", color: "white" }}>🔧 Admin</span>
            </div>
            <p style={{ color: "var(--ink-mute)", margin: 0, fontSize: 14 }}>Gerir conteúdo da plataforma</p>
          </div>
          <Link href="/dashboard" style={{ marginLeft: "auto" }}>
            <button className="btn btn-ghost btn-sm">← Início</button>
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "10px 20px", borderRadius: 999, border: "none", cursor: "pointer",
                fontFamily: "Fredoka", fontWeight: 600, fontSize: 15,
                background: tab === t.id ? "var(--purple-600)" : "white",
                color: tab === t.id ? "white" : "var(--ink-soft)",
                boxShadow: tab === t.id ? "0 3px 0 var(--purple-700)" : "0 2px 0 var(--line)",
                transition: "all 0.1s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Lessons Tab ── */}
        {tab === "lessons" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>Lições ({lessons?.length ?? 0})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setEditingLesson("new")}>+ Nova lição</button>
            </div>

            {editingLesson && (
              <div className="sticker-card" style={{ padding: 24, background: "white", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>
                  {editingLesson === "new" ? "Nova lição" : `Editar: ${editingLesson.title}`}
                </h3>
                <LessonForm
                  initial={editingLesson === "new" ? undefined : editingLesson}
                  themes={themes ?? []}
                  onSave={(data) => {
                    if (editingLesson === "new") {
                      createLessonMut.mutate(data);
                    } else {
                      updateLessonMut.mutate({ id: editingLesson.id, data });
                    }
                  }}
                  onCancel={() => setEditingLesson(null)}
                />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lessons?.map((lesson) => {
                const theme = themes?.find((t) => t.id === lesson.themeId);
                const grade = grades?.find((g) => g.id === theme?.gradeId);
                return (
                  <div
                    key={lesson.id}
                    className="card"
                    style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: 16 }}>{lesson.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>
                        {grade?.name} › {theme?.shortTitle ?? theme?.title} · {lesson.type} · {lesson.duration}min
                      </div>
                    </div>
                    <span className="chip" style={{ fontSize: 11, background: "var(--purple-100)", color: "var(--purple-700)" }}>{lesson.type}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingLesson(lesson)}>Editar</button>
                    <button
                      className="btn btn-sm"
                      style={{ background: "#FFE2DE", color: "var(--coral)", border: "1.5px solid var(--coral)" }}
                      onClick={() => {
                        if (confirm(`Eliminar "${lesson.title}"?`)) deleteLessonMut.mutate(lesson.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                );
              })}
              {!lessons?.length && (
                <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--ink-mute)" }}>Sem lições ainda.</div>
              )}
            </div>
          </div>
        )}

        {/* ── Themes Tab ── */}
        {tab === "themes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>Temas ({themes?.length ?? 0})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setEditingTheme("new")}>+ Novo tema</button>
            </div>

            {editingTheme && (
              <div className="sticker-card" style={{ padding: 24, background: "white", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>
                  {editingTheme === "new" ? "Novo tema" : `Editar: ${editingTheme.title}`}
                </h3>
                <ThemeForm
                  initial={editingTheme === "new" ? undefined : editingTheme}
                  grades={grades ?? []}
                  onSave={(data) => {
                    if (editingTheme === "new") {
                      createThemeMut.mutate(data);
                    } else {
                      updateThemeMut.mutate({ id: editingTheme.id, data });
                    }
                  }}
                  onCancel={() => setEditingTheme(null)}
                />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {themes?.map((theme) => {
                const grade = grades?.find((g) => g.id === theme.gradeId);
                return (
                  <div key={theme.id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 28 }}>{theme.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: 16 }}>{theme.title}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{grade?.name} · ordem {theme.order}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingTheme(theme)}>Editar</button>
                    <button
                      className="btn btn-sm"
                      style={{ background: "#FFE2DE", color: "var(--coral)", border: "1.5px solid var(--coral)" }}
                      onClick={() => {
                        if (confirm(`Eliminar "${theme.title}"?`)) deleteThemeMut.mutate(theme.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                );
              })}
              {!themes?.length && (
                <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--ink-mute)" }}>Sem temas ainda.</div>
              )}
            </div>
          </div>
        )}

        {/* ── Grades Tab ── */}
        {tab === "grades" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>Anos ({grades?.length ?? 0})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setEditingGrade("new")}>+ Novo ano</button>
            </div>

            {editingGrade && (
              <div className="sticker-card" style={{ padding: 24, background: "white", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>
                  {editingGrade === "new" ? "Novo ano" : `Editar: ${editingGrade.name}`}
                </h3>
                <GradeForm
                  initial={editingGrade === "new" ? undefined : editingGrade}
                  onSave={(data) => {
                    if (editingGrade === "new") {
                      createGradeMut.mutate(data);
                    } else {
                      updateGradeMut.mutate({ id: editingGrade.id, data });
                    }
                  }}
                  onCancel={() => setEditingGrade(null)}
                />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {grades?.map((grade) => (
                <div key={grade.id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 28 }}>{grade.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: 16 }}>{grade.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{grade.description}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditingGrade(grade)}>Editar</button>
                  <button
                    className="btn btn-sm"
                    style={{ background: "#FFE2DE", color: "var(--coral)", border: "1.5px solid var(--coral)" }}
                    onClick={() => {
                      if (confirm(`Eliminar "${grade.name}"? Isto apaga todos os temas e lições associados!`)) deleteGradeMut.mutate(grade.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              {!grades?.length && (
                <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--ink-mute)" }}>Sem anos ainda.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
