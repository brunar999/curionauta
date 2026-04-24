import { useState, useEffect, useRef } from "react";
import { useUpdateProgress } from "@/hooks/useProgress";
import { useActiveStudent } from "@/context/StudentContext";
import TTSButton from "@/components/TTSButton";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const QUESTIONS = [
  { q: "Qual é o primeiro mês do ano?", correct: 0, options: ["Janeiro", "Fevereiro", "Março", "Dezembro"] },
  { q: "Qual é o último mês do ano?", correct: 3, options: ["Outubro", "Novembro", "Março", "Dezembro"] },
  { q: "Quantos meses tem o ano?", correct: 2, options: ["10", "11", "12", "13"] },
  { q: "Qual é o mês do Natal?", correct: 1, options: ["Novembro", "Dezembro", "Janeiro", "Outubro"] },
  { q: "Qual é o mês do Verão que vem a seguir a Junho?", correct: 0, options: ["Julho", "Agosto", "Maio", "Setembro"] },
  { q: "Em que mês começa a Primavera (no hemisfério norte)?", correct: 3, options: ["Janeiro", "Fevereiro", "Fevereiro", "Março"] },
  { q: "Qual é o 5º mês do ano?", correct: 2, options: ["Março", "Abril", "Maio", "Junho"] },
  { q: "Qual é o mês a seguir a Outubro?", correct: 1, options: ["Outubro", "Novembro", "Dezembro", "Setembro"] },
  { q: "Qual é o mês a seguir a Março?", correct: 0, options: ["Abril", "Fevereiro", "Maio", "Junho"] },
  { q: "Qual é o segundo mês do ano?", correct: 3, options: ["Janeiro", "Março", "Abril", "Fevereiro"] },
];

interface Props {
  lessonId: number;
  onComplete: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MonthsQuiz({ lessonId, onComplete }: Props) {
  const [pool, setPool] = useState(() => shuffle(QUESTIONS));
  const [poolIdx, setPoolIdx] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [scoreAnim, setScoreAnim] = useState<{ delta: number; id: number } | null>(null);

  const { activeStudent } = useActiveStudent();
  const updateProgress = useUpdateProgress();

  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeSpentRef = useRef(0);
  const correctRef = useRef(0);
  const totalRef = useRef(0);
  const isCompleteRef = useRef(false);
  const activeStudentRef = useRef(activeStudent);
  activeStudentRef.current = activeStudent;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      timeSpentRef.current = Math.floor((Date.now() - startTime.current) / 1000);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!isCompleteRef.current && activeStudentRef.current) {
        updateProgress.mutate({
          studentId: activeStudentRef.current.id,
          lessonId,
          status: "in_progress",
          timeSpent: timeSpentRef.current,
          correctAnswers: correctRef.current,
          totalAnswers: totalRef.current,
        });
      }
    };
  }, []);

  function handleSelect(idx: number) {
    if (submitted) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null) return;
    const isCorrect = selected === pool[poolIdx].correct;
    setSubmitted(true);

    const newTotal = totalRef.current + 1;
    const newCorrect = isCorrect ? correctRef.current + 1 : correctRef.current;
    totalRef.current = newTotal;
    correctRef.current = newCorrect;
    setTotalAnswers(newTotal);
    setCorrectAnswers(newCorrect);

    // Score: +10 correct, -7 wrong
    const delta = isCorrect ? 10 : -7;
    setScoreAnim({ delta, id: Date.now() });
    setScore((prev) => {
      const next = isCorrect ? Math.min(100, prev + 10) : Math.max(0, prev - 7);
      return next;
    });
  }

  function handleNext() {
    if (score >= 100) {
      finishQuiz();
      return;
    }
    const nextIdx = poolIdx + 1;
    if (nextIdx >= pool.length) {
      setPool(shuffle([...QUESTIONS]));
      setPoolIdx(0);
    } else {
      setPoolIdx(nextIdx);
    }
    setQuestionCount((n) => n + 1);
    setSelected(null);
    setSubmitted(false);
  }

  function finishQuiz() {
    if (!activeStudent) return;
    isCompleteRef.current = true;
    const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
    updateProgress.mutate({
      studentId: activeStudent.id,
      lessonId,
      status: "completed",
      timeSpent,
      correctAnswers: correctRef.current,
      totalAnswers: totalRef.current,
      starsEarned: 3,
    }, {
      onSuccess: () => {
        setQuizComplete(true);
        onComplete();
      },
    });
  }

  if (quizComplete) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div className="pop-in" style={{ fontSize: 100, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 38, marginBottom: 10 }}>Quiz concluído!</h2>
        <p style={{ color: "var(--ink-soft)", fontSize: 17 }}>
          {correctAnswers} respostas corretas de {totalAnswers} perguntas
        </p>
      </div>
    );
  }

  const question = pool[poolIdx];
  const isCorrect = selected === question.correct;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="chip chip-coral">🎯 Questão {questionCount + 1}</div>
        <div style={{ display: "flex", gap: 12 }}>
          <span className="chip chip-green">✓ {correctAnswers}</span>
          <span className="chip chip-coral">Score: {score}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: "relative", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          <span style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 16, color: score >= 70 ? "var(--green-600)" : "var(--purple-700)" }}>
            {score}%
          </span>
        </div>
        <div className="progress" style={{ height: 22, borderRadius: 999, border: "2px solid var(--line)" }}>
          <div className="progress-fill" style={{ width: `${score}%`, borderRadius: 999 }} />
        </div>
        {scoreAnim && (
          <div
            key={scoreAnim.id}
            style={{
              position: "absolute",
              left: `${Math.min(Math.max(score, 8), 92)}%`,
              top: 0,
              fontFamily: "Fredoka",
              fontWeight: 800,
              fontSize: 24,
              color: scoreAnim.delta > 0 ? "var(--green-600)" : "var(--coral)",
              pointerEvents: "none",
              animation: `${scoreAnim.delta > 0 ? "score-rise" : "score-drop"} 1.1s ease forwards`,
              zIndex: 10,
              whiteSpace: "nowrap",
            }}
          >
            {scoreAnim.delta > 0 ? `+${scoreAnim.delta} ↑` : `${scoreAnim.delta} ↓`}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, margin: 0, flex: 1 }}>{question.q}</h2>
        <TTSButton text={question.q} />
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 28 }}>
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectAnswer = i === question.correct;
          const showCorrect = submitted && isCorrectAnswer;
          const showWrong = submitted && isSelected && !isCorrectAnswer;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="sticker-card"
              style={{
                padding: "20px 24px", textAlign: "left",
                display: "flex", alignItems: "center", gap: 14,
                background: showCorrect ? "var(--green-100)" : showWrong ? "#FFE2DE" : isSelected ? "var(--purple-50)" : "white",
                borderColor: showCorrect ? "var(--green-500)" : showWrong ? "var(--coral)" : isSelected ? "var(--purple-600)" : "var(--purple-700)",
                boxShadow: `0 6px 0 ${showCorrect ? "var(--green-500)" : showWrong ? "var(--coral)" : isSelected ? "var(--purple-600)" : "var(--purple-700)"}`,
                cursor: submitted ? "default" : "pointer",
                transition: "all 0.12s",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: showCorrect ? "var(--green-500)" : showWrong ? "var(--coral)" : isSelected ? "var(--purple-600)" : "var(--line)",
                display: "grid", placeItems: "center", color: "white", fontWeight: 700,
              }}>
                {showCorrect ? "✓" : showWrong ? "✕" : isSelected ? "●" : ""}
              </div>
              <span style={{ fontFamily: "Fredoka", fontSize: 18, fontWeight: 600 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div style={{
          background: isCorrect ? "var(--green-100)" : "#FFE2DE",
          borderRadius: 16, padding: "16px 20px", marginBottom: 20,
          border: `2.5px solid ${isCorrect ? "var(--green-500)" : "var(--coral)"}`,
          display: "flex", gap: 14, alignItems: "center",
        }}>
          <div style={{ fontSize: 32 }}>{isCorrect ? "🎉" : "💡"}</div>
          <div>
            <div style={{ fontFamily: "Fredoka", fontSize: 17, fontWeight: 600 }}>
              {isCorrect ? "Muito bem!" : "Quase! Continua!"}
            </div>
            {!isCorrect && (
              <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                A resposta certa é <strong>{question.options[question.correct]}</strong>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {!submitted ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleConfirm}
            disabled={selected === null}
            style={{ opacity: selected === null ? 0.5 : 1 }}
          >
            Confirmar
          </button>
        ) : (
          <button className="btn btn-green btn-lg" onClick={handleNext}>
            {score >= 100 ? "Terminar quiz →" : "Próxima →"}
          </button>
        )}
      </div>
    </div>
  );
}
