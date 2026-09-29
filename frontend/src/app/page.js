"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/* ---------- Scroll Reveal Hook ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
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

            if (p < 1) {
              requestAnimationFrame(tick);
            }
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

    const timer = setTimeout(() => {
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

    return () => clearTimeout(timer);
  }, [text, deleting, index, words]);

  return (
    <>
      <span className="typing-gradient">{text}</span>
      <span className="typing-cursor">|</span>
    </>
  );
}

/* ---------- FAQ Accordion ---------- */
function Faq() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(0);

  const faqs = [
    {
      q: t("landing.faq1_q"),
      a: t("landing.faq1_a"),
    },
    {
      q: t("landing.faq2_q"),
      a: t("landing.faq2_a"),
    },
    {
      q: t("landing.faq3_q"),
      a: t("landing.faq3_a"),
    },
    {
      q: t("landing.faq4_q"),
      a: t("landing.faq4_a"),
    },
  ];

  return (
    <div className="faq-list">
      {faqs.map((item, i) => (
        <div
          key={i}
          className={`faq-item ${open === i ? "open" : ""}`}
          onClick={() => setOpen(open === i ? -1 : i)}
        >
          <div className="faq-q">
            <span>{item.q}</span>

            <span className="faq-icon">
              {open === i ? "−" : "+"}
            </span>
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

  const { t } = useTranslation();

  return (
    <main
      className="landing-page"
      style={{ position: "relative" }}
    >

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              {t("landing.ai_powered_platform")}
            </div>

            <h1>
              {t("landing.smarter_exams")}
              <br />

              <TypingText
                words={[
                  t("landing.better_results"),
                  t("landing.faster_grading"),
                  t("landing.smarter_insights"),
                ]}
              />
            </h1>

            <p>
              {t("landing.hero_description")}
            </p>

            <div className="hero-buttons">
              <Link
                href="/register"
                className="primary-button"
              >
                {t("landing.get_started")} →
              </Link>

              <Link
                href="/login"
                className="secondary-button"
              >
                {t("landing.login")}
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>
                  <Counter end={3} />
                </strong>

                <span>
                  {t("landing.user_roles")}
                </span>
              </div>

              <div>
                <strong>
                  <Counter end={100} suffix="%" />
                </strong>

                <span>
                  {t("landing.ai_powered")}
                </span>
              </div>

              <div>
                <strong>24/7</strong>

                <span>
                  {t("landing.available")}
                </span>
              </div>
            </div>
          </div>

          {/* FLOATING DASHBOARD MOCKUP */}
          <div className="hero-dashboard">
            <div className="dashboard-window floating">
              <div className="window-header">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span className="window-title">
                  {t("landing.ai_examination_platform")}
                </span>
              </div>

              <div className="dashboard-content">
                <aside className="dashboard-sidebar">
                  <div className="mini-logo">AI</div>

                  <div className="sidebar-link active">
                    ▣ {t("landing.dashboard")}
                  </div>

                  <div className="sidebar-link">
                    📝 {t("landing.exams")}
                  </div>

                  <div className="sidebar-link">
                    📊 {t("landing.results")}
                  </div>

                  <div className="sidebar-link">
                    ⚙ {t("landing.settings")}
                  </div>
                </aside>

                <div className="dashboard-main">
                  <h3>
                    {t("landing.welcome_back")} 👋
                  </h3>

                  <p className="dashboard-sub">
                    {t("landing.examination_overview")}
                  </p>

                  <div className="dashboard-cards">
                    <div className="dashboard-card">
                      <span className="card-icon">
                        📝
                      </span>

                      <div>
                        <small>
                          {t("landing.examinations")}
                        </small>

                        <strong>12</strong>
                      </div>
                    </div>

                    <div className="dashboard-card">
                      <span className="card-icon">
                        ✓
                      </span>

                      <div>
                        <small>
                          {t("landing.completed")}
                        </small>

                        <strong>8</strong>
                      </div>
                    </div>

                    <div className="dashboard-card">
                      <span className="card-icon">
                        ★
                      </span>

                      <div>
                        <small>
                          {t("landing.average_score")}
                        </small>

                        <strong>86%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="performance-card">
                    <div className="performance-header">
                      <strong>
                        {t("landing.performance")}
                      </strong>

                      <span>
                        {t("landing.this_month")}
                      </span>
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
        <p>
          {t("landing.trusted_institutions")}
        </p>

        <div className="logo-strip-row">
          <span>
            🎓 {t("landing.university")}
          </span>

          <span>
            🏫 {t("landing.academy")}
          </span>

          <span>
            📚 {t("landing.institute")}
          </span>

          <span>
            🎯 {t("landing.coaching")}
          </span>

          <span>
            🧪 {t("landing.lab")}
          </span>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section
        id="features"
        className="features-section"
      >
        <div className="section-heading reveal">
          <span className="section-label">
            {t("landing.platform_features")}
          </span>

          <h2>
            {t("landing.everything_you_need")}
            <br />
            <span>
              {t("landing.modern_examinations")}
            </span>
          </h2>

          <p>
            {t("landing.features_description")}
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">
              🎓
            </div>

            <h3>
              {t("landing.student_portal")}
            </h3>

            <p>
              {t("landing.student_portal_description")}
            </p>

            <span className="feature-arrow">
              →
            </span>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">
              🧑‍🏫
            </div>

            <h3>
              {t("landing.examiner_portal")}
            </h3>

            <p>
              {t("landing.examiner_portal_description")}
            </p>

            <span className="feature-arrow">
              →
            </span>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">
              🛡️
            </div>

            <h3>
              {t("landing.admin_control")}
            </h3>

            <p>
              {t("landing.admin_control_description")}
            </p>

            <span className="feature-arrow">
              →
            </span>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">
              🤖
            </div>

            <h3>
              {t("landing.ai_powered")}
            </h3>

            <p>
              {t("landing.ai_powered_description")}
            </p>

            <span className="feature-arrow">
              →
            </span>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="how-section">
        <div className="section-heading reveal">
          <span className="section-label">
            {t("landing.how_it_works")}
          </span>

          <h2>
            {t("landing.get_started_in")}{" "}
            <span>
              {t("landing.three_simple_steps")}
            </span>
          </h2>
        </div>

        <div className="steps-grid">
          <div className="step-card reveal">
            <div className="step-num">
              01
            </div>

            <h3>
              {t("landing.register")}
            </h3>

            <p>
              {t("landing.register_description")}
            </p>
          </div>

          <div className="step-card reveal">
            <div className="step-num">
              02
            </div>

            <h3>
              {t("landing.attend_or_create")}
            </h3>

            <p>
              {t("landing.attend_or_create_description")}
            </p>
          </div>

          <div className="step-card reveal">
            <div className="step-num">
              03
            </div>

            <h3>
              {t("landing.get_results")}
            </h3>

            <p>
              {t("landing.get_results_description")}
            </p>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section
        id="about"
        className="about-section"
      >
        <div className="about-container reveal">
          <span className="section-label">
            {t("landing.about_platform")}
          </span>

          <h2>
            {t("landing.built_for_the")}
            <span>
              {" "}
              {t("landing.future_of_education")}
            </span>
          </h2>

          <p>
            {t("landing.about_description_one")}
          </p>

          <p>
            {t("landing.about_description_two")}
          </p>

          <Link
            href="/register"
            className="primary-button"
          >
            {t("landing.create_account")} →
          </Link>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="faq-section">
        <div className="section-heading reveal">
          <span className="section-label">
            {t("landing.faq")}
          </span>

          <h2>
            {t("landing.frequently_asked")}{" "}
            <span>
              {t("landing.questions")}
            </span>
          </h2>
        </div>

        <div className="reveal">
          <Faq />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-section">
        <h2 className="reveal">
          {t("landing.ready_to_get_started")}
        </h2>

        <p className="reveal">
          {t("landing.start_journey_today")}
        </p>

        <Link
          href="/register"
          className="cta-button reveal"
        >
          {t("landing.get_started")}
        </Link>
      </section>
    </main>
  );
}