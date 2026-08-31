export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1>AI Examination Platform</h1>

      <p>
        Welcome to the AI Examination Platform
      </p>

      <div>
        <a
          href="/register"
          style={{
            marginRight: "15px",
            padding: "10px 20px",
            border: "1px solid #000",
            textDecoration: "none",
          }}
        >
          Register
        </a>

        <a
          href="/login"
          style={{
            padding: "10px 20px",
            border: "1px solid #000",
            textDecoration: "none",
          }}
        >
          Login
        </a>
      </div>
    </main>
  );
}