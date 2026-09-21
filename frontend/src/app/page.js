"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ---------- Scroll Reveal Hook ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- Animated Counter ---------- */
function Counter({ end, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            setCount(Math.floor(p * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ---------- Typing Effect ---------- */
function TypingText({ words }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];
    const speed = deleting ? 40 : 90;

    const t = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 1) {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return (
    <>
      <span className="typing-gradient">{text}</span>
      <span className="typing-cursor">|</span>
    </>
  );
}

/* ---------- FAQ Accordion ---------- */
const FAQS = [
  {
    q: "Who can use this platform?",
    a: "Students, examiners, and administrators — each with a dedicated role-based dashboard.",
  },
  {
    q: "Is the platform AI powered?",
    a: "Yes. AI assists in generating questions, evaluating answers, and analyzing performance.",
  },
  {
    q: "Do examiners need admin approval?",
    a: "Yes. Examiners register and wait for admin approval before creating examinations.",
  },
  {
    q: "Can students view results instantly?",
    a: "Results are available as soon as the examiner publishes them from their dashboard.",
  },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {FAQS.map((item, i) => (
        <div
          key={i}
          className={`faq-item ${open === i ? "open" : ""}`}
          onClick={() => setOpen(open === i ? -1 : i)}
        >
          <div className="faq-q">
            <span>{item.q}</span>
            <span className="faq-icon">{open === i ? "−" : "+"}</span>
          </div>
          <div className="faq-a">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================
   MAIN PAGE
================================================ */
export default function HomePage() {
  useReveal();

  return (
    <main className="landing-page">

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-container">

          <div className="hero-content">

            <div className="hero-badge">
              <span className="badge-dot" />
              AI Powered Examination Platform
            </div>

            <h1>
              Smarter Exams.
              <br />
              <TypingText
                words={["Better Results.", "Faster Grading.", "Smarter Insights."]}
              />
            </h1>

            <p>
              A secure and intelligent examination platform designed
              for students, examiners, and administrators.
            </p>

            <div className="hero-buttons">
              <Link href="/register" className="primary-button">
                Get Started →
              </Link>
              <Link href="/login" className="secondary-button">
                Login
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong><Counter end={3} /></strong>
                <span>User Roles</span>
              </div>
              <div>
                <strong><Counter end={100} suffix="%" /></strong>
                <span>AI Powered</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Available</span>
              </div>
            </div>

          </div>

          {/* FLOATING DASHBOARD MOCKUP */}
          <div className="hero-dashboard">
            <div className="dashboard-window floating">

              <div className="window-header">
                <div className="window-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="window-title">AI Examination Platform</span>
              </div>

              <div className="dashboard-content">

                <aside className="dashboard-sidebar">
                  <div className="mini-logo">AI</div>
                  <div className="sidebar-link active">▣ Dashboard</div>
                  <div className="sidebar-link">📝 Exams</div>
                  <div className="sidebar-link">📊 Results</div>
                  <div className="sidebar-link">⚙ Settings</div>
                </aside>

                <div className="dashboard-main">

                  <h3>Welcome back 👋</h3>
                  <p className="dashboard-sub">Here's your examination overview</p>

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
                    <div className="chart animated">
                      <div style={{ "--h": "35%" }}></div>
                      <div style={{ "--h": "55%" }}></div>
                      <div style={{ "--h": "45%" }}></div>
                      <div style={{ "--h": "70%" }}></div>
                      <div style={{ "--h": "60%" }}></div>
                      <div style={{ "--h": "85%" }}></div>
                      <div style={{ "--h": "75%" }}></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ============ LOGO STRIP ============ */}
      <section className="logo-strip">
        <p>Trusted by forward-thinking institutions</p>
        <div className="logo-strip-row">
          <span>🎓 University</span>
          <span>🏫 Academy</span>
          <span>📚 Institute</span>
          <span>🎯 Coaching</span>
          <span>🧪 Lab</span>
        </div>
      </section>


      {/* ============ FEATURES ============ */}
      <section id="features" className="features-section">

        <div className="section-heading reveal">
          <span className="section-label">PLATFORM FEATURES</span>
          <h2>
            Everything you need for
            <br />
            <span>modern examinations</span>
          </h2>
          <p>Manage the complete examination process from one centralized platform.</p>
        </div>

        <div className="features-grid">

          <div className="feature-card reveal">
            <div className="feature-icon">🎓</div>
            <h3>Student Portal</h3>
            <p>Attend examinations, submit answers, and view results in real-time.</p>
            <span className="feature-arrow">→</span>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">🧑‍🏫</div>
            <h3>Examiner Portal</h3>
            <p>Create examinations, manage questions, and evaluate performance.</p>
            <span className="feature-arrow">→</span>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">🛡️</div>
            <h3>Admin Control</h3>
            <p>Manage users, examiner approvals, and the complete platform.</p>
            <span className="feature-arrow">→</span>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">🤖</div>
            <h3>AI Powered</h3>
            <p>Intelligent technology for a modern examination experience.</p>
            <span className="feature-arrow">→</span>
          </div>

        </div>

      </section>


      {/* ============ HOW IT WORKS ============ */}
      <section className="how-section">
        <div className="section-heading reveal">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Get started in <span>3 simple steps</span></h2>
        </div>

        <div className="steps-grid">
          <div className="step-card reveal">
            <div className="step-num">01</div>
            <h3>Register</h3>
            <p>Create your account as a student, examiner, or administrator.</p>
          </div>
          <div className="step-card reveal">
            <div className="step-num">02</div>
            <h3>Attend or Create</h3>
            <p>Students take exams. Examiners create and manage them.</p>
          </div>
          <div className="step-card reveal">
            <div className="step-num">03</div>
            <h3>Get Results</h3>
            <p>Instant feedback, scores, and performance insights.</p>
          </div>
        </div>
      </section>


      {/* ============ ABOUT ============ */}
      <section id="about" className="about-section">
        <div className="about-container reveal">

          <span className="section-label">ABOUT PLATFORM</span>

          <h2>
            Built for the
            <span> future of education</span>
          </h2>

          <p>
            AI Examination Platform provides a centralized environment
            for students, examiners, and administrators.
          </p>

          <p>
            From registration and examination management to results
            and administration, everything is organized in one secure platform.
          </p>

          <Link href="/register" className="primary-button">
            Create Account →
          </Link>

        </div>
      </section>


      {/* ============ FAQ ============ */}
      <section className="faq-section">
        <div className="section-heading reveal">
          <span className="section-label">FAQ</span>
          <h2>Frequently asked <span>questions</span></h2>
        </div>
        <div className="reveal">
          <Faq />
        </div>
      </section>


      {/* ============ CTA ============ */}
      <section className="cta-section">
        <h2 className="reveal">Ready to get started?</h2>
        <p className="reveal">Start your examination journey today.</p>
        <Link href="/register" className="cta-button reveal">
          Get Started
        </Link>
      </section>

    </main>
  );
}