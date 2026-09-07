import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">

          <Link href="/" className="logo">
            <div className="logo-icon">AI</div>
            <span>AI Examination</span>
          </Link>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>

            <Link href="/login" className="login-link">
              Login
            </Link>

            <Link href="/register" className="register-button">
              Register
            </Link>
          </div>

        </div>
      </nav>


      {/* HERO */}
      <section className="hero">

        <div className="hero-container">

          <div className="hero-content">

            <div className="hero-badge">
              ✨ AI Powered Examination Platform
            </div>

            <h1>
              Smarter Exams.
              <br />
              <span>Better Results.</span>
            </h1>

            <p>
              A secure and intelligent examination platform designed
              for students, examiners, and administrators.
            </p>

            <div className="hero-buttons">

              <Link
                href="/register"
                className="primary-button"
              >
                Get Started →
              </Link>

              <Link
                href="/login"
                className="secondary-button"
              >
                Login
              </Link>

            </div>

            <div className="hero-stats">

              <div>
                <strong>3</strong>
                <span>User Roles</span>
              </div>

              <div>
                <strong>AI</strong>
                <span>Powered</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Available</span>
              </div>

            </div>

          </div>


          {/* DASHBOARD PREVIEW */}
          <div className="hero-dashboard">

            <div className="dashboard-window">

              <div className="window-header">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span>AI Examination Platform</span>
              </div>


              <div className="dashboard-content">

                <aside className="dashboard-sidebar">

                  <div className="mini-logo">
                    AI
                  </div>

                  <div className="sidebar-link active">
                    ▣ Dashboard
                  </div>

                  <div className="sidebar-link">
                    📝 Exams
                  </div>

                  <div className="sidebar-link">
                    📊 Results
                  </div>

                  <div className="sidebar-link">
                    ⚙ Settings
                  </div>

                </aside>


                <div className="dashboard-main">

                  <h3>Welcome back 👋</h3>

                  <p>
                    Here's your examination overview
                  </p>


                  <div className="dashboard-cards">

                    <div className="dashboard-card">
                      <span className="card-icon">📝</span>

                      <div>
                        <small>Examinations</small>
                        <strong>12</strong>
                      </div>
                    </div>


                    <div className="dashboard-card">
                      <span className="card-icon">✓</span>

                      <div>
                        <small>Completed</small>
                        <strong>8</strong>
                      </div>
                    </div>


                    <div className="dashboard-card">
                      <span className="card-icon">★</span>

                      <div>
                        <small>Average Score</small>
                        <strong>86%</strong>
                      </div>
                    </div>

                  </div>


                  <div className="performance-card">

                    <div className="performance-header">
                      <strong>Performance</strong>
                      <span>This Month</span>
                    </div>

                    <div className="chart">

                      <div style={{ height: "35%" }}></div>
                      <div style={{ height: "55%" }}></div>
                      <div style={{ height: "45%" }}></div>
                      <div style={{ height: "70%" }}></div>
                      <div style={{ height: "60%" }}></div>
                      <div style={{ height: "85%" }}></div>
                      <div style={{ height: "75%" }}></div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section id="features" className="features-section">

        <div className="section-heading">

          <span className="section-label">
            PLATFORM FEATURES
          </span>

          <h2>
            Everything you need for
            <br />
            <span>modern examinations</span>
          </h2>

          <p>
            Manage the complete examination process from one
            centralized platform.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🎓
            </div>

            <h3>Student Portal</h3>

            <p>
              Students can attend examinations, submit answers,
              and view their results easily.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🧑‍🏫
            </div>

            <h3>Examiner Portal</h3>

            <p>
              Examiners can create examinations, manage questions,
              and evaluate student performance.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🛡️
            </div>

            <h3>Admin Control</h3>

            <p>
              Administrators manage users, examiner approvals,
              and the complete platform.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <h3>AI Powered</h3>

            <p>
              Intelligent technology helps provide a modern
              and efficient examination experience.
            </p>

          </div>

        </div>

      </section>


      {/* ABOUT */}
      <section id="about" className="about-section">

        <div className="about-container">

          <div className="about-content">

            <span className="section-label">
              ABOUT PLATFORM
            </span>

            <h2>
              Built for the
              <span> future of education</span>
            </h2>

            <p>
              AI Examination Platform provides a centralized
              environment for students, examiners, and
              administrators.
            </p>

            <p>
              From registration and examination management
              to results and administration, everything is
              organized in one secure platform.
            </p>

            <Link
              href="/register"
              className="primary-button"
            >
              Create Account →
            </Link>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <h2>
          Ready to get started?
        </h2>

        <p>
          Start your examination journey today.
        </p>

        <Link
          href="/register"
          className="cta-button"
        >
          Get Started
        </Link>

      </section>


      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-container">

          <div className="footer-logo">

            <div className="logo-icon">
              AI
            </div>

            <span>
              AI Examination Platform
            </span>

          </div>

          <p>
            © 2026 AI Examination Platform
          </p>

        </div>

      </footer>

    </main>
  );
}