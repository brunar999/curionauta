import { useTTS } from "@/hooks/useTTS";

interface Props {
  text: string;
}

export default function TTSButton({ text }: Props) {
  const { speak, stop, isSpeaking } = useTTS();

  function handleClick() {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isSpeaking ? "Parar leitura" : "Ler em voz alta"}
      title={isSpeaking ? "Parar leitura" : "Ler em voz alta"}
      style={{
        background: isSpeaking ? "var(--purple-100)" : "transparent",
        border: "2px solid var(--purple-200)",
        borderRadius: 999,
        padding: "4px 10px",
        cursor: "pointer",
        fontSize: 13,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "Fredoka",
        fontWeight: 600,
        color: "var(--purple-600)",
        transition: "all 0.12s",
      }}
    >
      {isSpeaking ? "⏹" : "🔊"}
    </button>
  );
}
