export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        padding: "20px",
        textAlign: "center",
        background: "#111",
        color: "white",
      }}
    >
      <p>© {new Date().getFullYear()} E-Commerce App</p>
      <p>Built with Next.js + FastAPI + PostgreSQL</p>
    </footer>
  );
}