import { useState, useRef, useEffect } from "react";
import { useUpdateProgress } from "@/hooks/useProgress";
import { useActiveStudent } from "@/context/StudentContext";

const QUESTIONS = [
  { q: "Qual é a estação do ano mais quente?", correct: 1, options: ["Primavera", "Verão", "Outono", "Inverno"] },
  { q: "Em que estação caem as folhas das árvores?", correct: 2, options: ["Primavera", "Verão", "Outono", "Inverno"] },
  { q: "Qual é a estação mais fria?", correct: 3, options: ["Primavera", "Verão", "Outono", "Inverno"] },
  { q: "Em que estação as flores desabrocham?", correct: 0, options: ["Primavera", "Verão", "Outono", "Inverno"] },
  { q: "Quais são os meses do Verão?", correct: 2, options: ["Março, Abril, Maio", "Setembro, Outubro, Novembro", "Junho, Julho, Agosto", "Dezembro, Janeiro, Fevereiro"] },
  { q: "Quais são os meses do Inverno?", correct: 3, options: ["Março, Abril, Maio", "Junho, Julho, Agosto", "Setembro, Outubro, Novembro", "Dezembro, Janeiro, Fevereiro"] },
  { q: "Qual é a estação depois do Outono?", correct: 3, options: ["Primavera", "Verão", "Outono", "Inverno"] },
  { q: "Qual é a estação antes do Verão?", correct: 0, options: ["Primavera", "Verão", "Outono", "Inverno"] },
  { q: "Quantas estações tem o ano?", correct: 1, options: ["3", "4", "5", "6"] },
  { q: "Em que estação os pássaros constroem ninhos?", correct: 0, options: ["Primavera", "Verão", "Outono", "Inverno"] },
];

interface Props {
  lessonId: number;
  onComplete: () => void;
}

export default function SeasonsQuiz({ lessonId, onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const { activeStudent } = useActiveStudent();
  const updateProgress = useUpdateProgress();

  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeSpentRef = useRef(0);
  const correctRef = useRef(0);
  const totalRef = useRef(0);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      timeSpentRef.current = Math.floor((Date.now() - startTime.current) / 1000);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const SEASON_EMOJIS: Record<string, string> = {
    "Primavera": "🌸", "Verão": "☀️", "Outono": "🍂", "Inverno": "❄️",
  };

  function handleConfirm() {
    if (selected === null) return;
    const isCorrect = selected === QUESTIONS[currentQ].correct;
    setSubmitted(true);

    const newTotal = totalRef.current + 1;
    const newCorrect = isCorrect ? correctRef.current + 1 : correctRef.current;
    totalRef.current = newTotal;
    correctRef.current = newCorrect;
    setTotalAnswers(newTotal);
    setCorrectAnswers(newCorrect);
    setScore((prev) => isCorrect ? Math.min(100, prev + 10) : Math.max(0, prev - 7));
  }

  function handleNext() {
    if (currentQ + 1 >= QUESTIONS.length || score >= 100) {
      finishQuiz();
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  function finishQuiz() {
    if (!activeStudent) return;
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
        <h2 style={{ fontSize: 38, marginBottom: 10 }}>Quiz das estações concluído!</h2>
        <p style={{ color: "var(--ink-soft)", fontSize: 17 }}>
          {correctAnswers} respostas certas de {totalAnswers} perguntas
        </p>
      </div>
    );
  }

  const question = QUESTIONS[currentQ];
  const isCorrect = selected === question.correct;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="chip chip-coral">🌸 Pergunta {currentQ + 1} de {QUESTIONS.length}</div>
        <span className="chip chip-green">Score: {score}%</span>
      </div>

      <div className="progress" style={{ height: 8, marginBottom: 28 }}>
        <div className="progress-fill" style={{ width: `${score}%` }} />
      </div>

      <h2 style={{ fontSize: 28, marginBottom: 28 }}>{question.q}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 28 }}>
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectAnswer = i === question.correct;
          const showCorrect = submitted && isCorrectAnswer;
          const showWrong = submitted && isSelected && !isCorrectAnswer;
          const emoji = SEASON_EMOJIS[opt] ?? "🔵";

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className="sticker-card"
              style={{
                padding: "20px 24px", textAlign: "left",
                display: "flex", alignItems: "center", gap: 14,
                background: showCorrect ? "var(--green-100)" : showWrong ? "#FFE2DE" : isSelected ? "var(--purple-50)" : "white",
                borderColor: showCorrect ? "var(--green-500)" : showWrong ? "var(--coral)" : isSelected ? "var(--purple-600)" : "var(--purple-700)",
                boxShadow: `0 6px 0 ${showCorrect ? "var(--green-500)" : showWrong ? "var(--coral)" : isSelected ? "var(--purple-600)" : "var(--purple-700)"}`,
                cursor: submitted ? "default" : "pointer",
              }}
            >
              {opt.length < 10 && <div style={{ fontSize: 36 }}>{emoji}</div>}
              <span style={{ fontFamily: "Fredoka", fontSize: 16, fontWeight: 600 }}>{opt}</span>
            </button>
          );
        })}
      </div>

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
            {currentQ + 1 >= QUESTIONS.length || score >= 100 ? "Terminar quiz →" : "Próxima →"}
          </button>
        )}
      </div>
    </div>
  );
}
