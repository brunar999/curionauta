export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div style={{ marginBottom: 12 }}>
          <img src="/logo.png" alt="CurioNauta" style={{ height: 48, width: "auto" }} />
        </div>
        <p style={{ margin: "0 0 8px" }}>
          Plataforma de Estudo do Meio para o 1º ao 4º ano · 🇵🇹 Em Português de Portugal
        </p>
        <p style={{ margin: 0, fontSize: 12 }}>
          © {new Date().getFullYear()} CurioNauta. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
