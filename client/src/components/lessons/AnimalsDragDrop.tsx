import { useState } from "react";
import { useUpdateProgress } from "@/hooks/useProgress";
import { useActiveStudent } from "@/context/StudentContext";

interface Animal {
  id: string;
  emoji: string;
  label: string;
  kind: "domestico" | "selvagem";
}

const ANIMALS: Animal[] = [
  { id: "1", emoji: "🐶", label: "Cão", kind: "domestico" },
  { id: "2", emoji: "🦁", label: "Leão", kind: "selvagem" },
  { id: "3", emoji: "🐴", label: "Cavalo", kind: "domestico" },
  { id: "4", emoji: "🦒", label: "Girafa", kind: "selvagem" },
  { id: "5", emoji: "🐱", label: "Gato", kind: "domestico" },
  { id: "6", emoji: "🐘", label: "Elefante", kind: "selvagem" },
  { id: "7", emoji: "🐔", label: "Galinha", kind: "domestico" },
  { id: "8", emoji: "🐺", label: "Lobo", kind: "selvagem" },
];

interface BucketItem extends Animal {
  correct: boolean;
}

interface Props {
  lessonId: number;
  onComplete: () => void;
}

function DropBucket({
  title,
  color,
  bg,
  items,
  onDrop,
}: {
  title: string;
  color: string;
  bg: string;
  items: BucketItem[];
  onDrop: () => void;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(); }}
      style={{
        background: bg, borderRadius: 22, padding: 20, minHeight: 180,
        border: `3px ${over ? "solid" : "dashed"} ${color}`,
        transition: "transform 0.1s",
        transform: over ? "scale(1.02)" : "scale(1)",
      }}
    >
      <div style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: 20, color, marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minHeight: 60 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            padding: "8px 14px 8px 8px", background: "white", borderRadius: 14,
            border: `2.5px solid ${it.correct ? "var(--green-500)" : "var(--coral)"}`,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 24 }}>{it.emoji}</span>
            <span style={{ fontFamily: "Fredoka", fontSize: 14, fontWeight: 500 }}>{it.label}</span>
            <span style={{ color: it.correct ? "var(--green-500)" : "var(--coral)", fontWeight: 700 }}>
              {it.correct ? "✓" : "✕"}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <span style={{ color: "var(--ink-mute)", fontSize: 14, fontStyle: "italic" }}>
            Larga aqui os animais…
          </span>
        )}
      </div>
    </div>
  );
}

export default function AnimalsDragDrop({ lessonId, onComplete }: Props) {
  const [remaining, setRemaining] = useState(ANIMALS);
  const [buckets, setBuckets] = useState<{ domestico: BucketItem[]; selvagem: BucketItem[] }>({
    domestico: [],
    selvagem: [],
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const { activeStudent } = useActiveStudent();
  const updateProgress = useUpdateProgress();

  function handleDrop(kind: "domestico" | "selvagem") {
    if (!draggingId) return;
    const animal = remaining.find((a) => a.id === draggingId);
    if (!animal) return;
    setBuckets((b) => ({
      ...b,
      [kind]: [...b[kind], { ...animal, correct: animal.kind === kind }],
    }));
    setRemaining((prev) => prev.filter((a) => a.id !== draggingId));
    setDraggingId(null);
  }

  function handleFinish() {
    if (!activeStudent) return;
    const allCorrect = [...buckets.domestico, ...buckets.selvagem];
    const correct = allCorrect.filter((a) => a.correct).length;
    updateProgress.mutate({
      studentId: activeStudent.id,
      lessonId,
      status: "completed",
      timeSpent: 60,
      correctAnswers: correct,
      totalAnswers: ANIMALS.length,
      starsEarned: correct === ANIMALS.length ? 3 : correct > ANIMALS.length / 2 ? 2 : 1,
    }, {
      onSuccess: () => {
        setDone(true);
        onComplete();
      },
    });
  }

  if (done) {
    const allItems = [...buckets.domestico, ...buckets.selvagem];
    const correct = allItems.filter((a) => a.correct).length;
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div className="pop-in" style={{ fontSize: 100, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 36, marginBottom: 10 }}>Jogo concluído!</h2>
        <p style={{ fontSize: 18, color: "var(--ink-soft)" }}>
          {correct} de {ANIMALS.length} animais classificados corretamente!
        </p>
      </div>
    );
  }

  const isAllPlaced = remaining.length === 0;

  return (
    <div>
      <div className="chip chip-yellow" style={{ marginBottom: 12 }}>✋ Jogo interativo</div>
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>Arrasta cada animal para o grupo certo</h2>
      <p style={{ color: "var(--ink-mute)", marginBottom: 24, fontSize: 15 }}>
        Animais domésticos vivem connosco · Animais selvagens vivem na natureza.
      </p>

      {/* Source pool */}
      <div className="sticker-card" style={{ padding: 22, marginBottom: 22, minHeight: 120 }}>
        <div style={{ fontFamily: "Fredoka", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-mute)", marginBottom: 12 }}>
          Animais para classificar
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", minHeight: 80 }}>
          {remaining.map((animal) => (
            <div
              key={animal.id}
              draggable
              onDragStart={() => setDraggingId(animal.id)}
              onDragEnd={() => setDraggingId(null)}
              style={{
                padding: "10px 16px 10px 10px", background: "white", borderRadius: 16,
                border: "2.5px solid var(--purple-700)", boxShadow: "0 4px 0 var(--purple-700)",
                display: "flex", alignItems: "center", gap: 10, cursor: "grab",
                opacity: draggingId === animal.id ? 0.4 : 1,
                userSelect: "none",
              }}
            >
              <span style={{ fontSize: 32 }}>{animal.emoji}</span>
              <span style={{ fontFamily: "Fredoka", fontWeight: 500 }}>{animal.label}</span>
            </div>
          ))}
          {remaining.length === 0 && (
            <div style={{ color: "var(--green-600)", fontFamily: "Fredoka", fontWeight: 600 }}>
              ✓ Todos os animais colocados!
            </div>
          )}
        </div>
      </div>

      {/* Drop buckets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28 }}>
        <DropBucket
          title="Domésticos 🏡"
          color="var(--green-500)"
          bg="var(--green-50)"
          items={buckets.domestico}
          onDrop={() => handleDrop("domestico")}
        />
        <DropBucket
          title="Selvagens 🌳"
          color="var(--coral)"
          bg="#FFE2DE"
          items={buckets.selvagem}
          onDrop={() => handleDrop("selvagem")}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn btn-green btn-lg"
          onClick={handleFinish}
          disabled={!isAllPlaced || updateProgress.isPending}
        >
          {isAllPlaced ? "Terminar jogo →" : `Faltam ${remaining.length} animais…`}
        </button>
      </div>
    </div>
  );
}
