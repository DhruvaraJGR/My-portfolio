import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  AtSign,
  Check,
  ChevronDown,
  Code2,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  Menu,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { site } from "./config/site.js";
import { projects } from "./data/projects.js";
import { experience } from "./data/experience.js";

const navItems = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];
const motionStorageKey = "dhruvaraj-portfolio-motion-v1";
const filters = ["All", "Full Stack", "IoT", "Android"];
const ease = [0.22, 1, 0.36, 1];

function Reveal({
  children,
  className = "",
  delay = 0,
  motionOn = true,
  ...props
}) {
  return (
    <motion.div
      className={className}
      initial={motionOn ? { opacity: 0, y: 32 } : false}
      whileInView={motionOn ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.72, delay, ease }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function Header({ motionEnabled, setMotionEnabled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const nodes = [...navItems.map(({ id }) => id), "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#home"
        aria-label={`${site.displayName}, home`}
        onClick={closeMenu}
      >
        <span className="wordmark-mark">
          D<span>G</span>
        </span>
        <span className="wordmark-name">
          {site.displayName}
          <i>.</i>
        </span>
      </a>
      <nav
        id="mobile-menu"
        className={`main-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activeSection === item.id ? "active" : ""}
            aria-current={activeSection === item.id ? "location" : undefined}
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
        <a
          className={`nav-contact${activeSection === "contact" ? " active" : ""}`}
          href="#contact"
          aria-current={activeSection === "contact" ? "location" : undefined}
          onClick={closeMenu}
        >
          Let’s talk <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </nav>
      <div className="header-actions">
        <button
          className="motion-toggle"
          type="button"
          aria-pressed={motionEnabled}
          onClick={() => setMotionEnabled((value) => !value)}
          title="Toggle motion effects"
        >
          <span
            className={`toggle-dot${motionEnabled ? " is-on" : ""}`}
            aria-hidden="true"
          />
          <span>Motion {motionEnabled ? "on" : "off"}</span>
        </button>
        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

function ProjectDialog({ project, onClose, motionOn, returnFocusRef }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab") {
        const dialog = event.currentTarget.querySelector('[role="dialog"]');
        const focusable = [
          ...dialog.querySelectorAll(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ),
        ];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      const trigger = returnFocusRef.current;
      window.requestAnimationFrame(() => {
        if (trigger?.isConnected) trigger.focus();
      });
    };
  }, [onClose, returnFocusRef]);

  return (
    <motion.div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      initial={motionOn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        tabIndex={-1}
        initial={motionOn ? { opacity: 0, y: 22, scale: 0.98 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: motionOn ? 0.3 : 0, ease }}
      >
        <button
          ref={closeButtonRef}
          className="dialog-close icon-button"
          type="button"
          aria-label="Close project details"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div
          className={`project-cover dialog-cover cover-${project.visual}`}
          aria-hidden="true"
        >
          <CoverArt visual={project.visual} />
        </div>
        <div className="dialog-copy">
          <p className="eyebrow">
            {project.type} <span>·</span> {project.categoryLabel} <span>·</span>{" "}
            {project.dates}
          </p>
          <h2 id="dialog-title">{project.title}</h2>
          <p id="dialog-description" className="dialog-summary">
            {project.summary}
          </p>
          <ul className="detail-list">
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <div className="tag-list">
            {project.stack.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
          {(project.liveUrl || project.sourceUrl) && (
            <div className="dialog-links">
              {project.liveUrl && (
                <a
                  className="button button-primary"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live project <ExternalLink size={15} />
                </a>
              )}
              {project.sourceUrl && (
                <a
                  className="button button-outline"
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Source code <Github size={15} />
                </a>
              )}
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}

function CoverArt({ visual }) {
  return visual === "sensor" ? (
    <div className="sensor-art">
      <span className="sensor-orbit orbit-one" />
      <span className="sensor-orbit orbit-two" />
      <span className="sensor-core">
        <span />
      </span>
      <span className="sensor-node node-one" />
      <span className="sensor-node node-two" />
      <span className="sensor-node node-three" />
      <span className="art-label">COLD STORAGE / SYSTEM</span>
    </div>
  ) : visual === "portfolio" ? (
    <div className="portfolio-art">
      <div className="portfolio-window">
        <div className="portfolio-window-bar">
          <span />
          <span />
          <span />
          <small>PORTFOLIO / 2026</small>
        </div>
        <div className="portfolio-window-body">
          <span className="portfolio-kicker">JAVA FULL STACK DEVELOPER</span>
          <span className="portfolio-title">BUILD<br /><i>WITH</i><br />PURPOSE<span>.</span></span>
          <span className="portfolio-rule" />
          <span className="portfolio-caption">REACT 19&nbsp; · &nbsp;VITE&nbsp; · &nbsp;MOTION</span>
        </div>
      </div>
      <span className="portfolio-stamp">PERSONAL<br />PORTFOLIO</span>
      <span className="art-label">DESIGN / DEVELOPMENT</span>
    </div>
  ) : (
    <div className="news-art">
      <div className="news-phone">
        <span className="phone-status" />
        <span className="news-brand">
          NEWS<span>.</span>
        </span>
        <span className="news-image" />
        <span className="news-line long" />
        <span className="news-line" />
        <span className="news-line short" />
        <span className="news-category">CATEGORY FILTERS</span>
      </div>
      <span className="news-orbit" />
      <span className="art-label">REAL-TIME / NEWS</span>
    </div>
  );
}

function ProjectCard({ project, index, motionOn, onSelect }) {
  return (
    <Reveal
      className={`project-card${index === 0 ? " project-card-featured" : ""}`}
      delay={index * 0.08}
      motionOn={motionOn}
    >
      <button
        className="project-card-button"
        type="button"
        onClick={(event) => onSelect(project, event.currentTarget)}
        aria-label={`View details for ${project.title}`}
      >
        <div className={`project-cover cover-${project.visual}`}>
          <CoverArt visual={project.visual} />
          <span className="project-open" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="project-meta">
          <span>{project.type}</span>
          <span>{project.dates}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <span className="text-link">
          Explore project <ArrowRight size={15} />
        </span>
      </button>
    </Reveal>
  );
}

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [motionEnabled, setMotionEnabled] = useState(() => {
    try {
      return localStorage.getItem(motionStorageKey) !== "off";
    } catch {
      return true;
    }
  });
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const projectTriggerRef = useRef(null);
  const motionOn = motionEnabled && !prefersReducedMotion;
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    try {
      localStorage.setItem(motionStorageKey, motionEnabled ? "on" : "off");
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
  }, [motionEnabled]);

  useEffect(() => {
    document.documentElement.dataset.motion = motionOn ? "on" : "off";
  }, [motionOn]);

  useEffect(() => {
    document.title = `${site.fullName} | ${site.profession}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = site.websiteUrl;
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", site.websiteUrl);
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute(
        "content",
        new URL("assets/portrait.webp", site.websiteUrl).href,
      );
    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.fullName,
      jobTitle: site.profession,
      url: site.websiteUrl,
      email: `mailto:${site.contact.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Shivamogga",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      sameAs: [site.contact.linkedin],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(person);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  const visibleProjects = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter(
            (project) =>
              project.category === filter ||
              (filter === "Full Stack" &&
                project.categoryLabel.includes("Full Stack")),
          ),
    [filter],
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.contact.email}`;
    }
  }

  function openMailDraft(event) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(
      `Portfolio enquiry from ${data.get("name")}`,
    );
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`,
    );
    window.location.href = `mailto:${site.contact.email}?subject=${subject}&body=${body}`;
  }

  function showProject(project, trigger) {
    projectTriggerRef.current = trigger;
    setSelectedProject(project);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <Header
        motionEnabled={motionEnabled}
        setMotionEnabled={setMotionEnabled}
      />
      <main id="main">
        <section
          className="hero section-shell"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <Reveal className="hero-kicker" motionOn={motionOn}>
              <span className="status-dot" /> {site.availability}
            </Reveal>
            <Reveal delay={0.05} motionOn={motionOn}>
              <p className="hero-role">
                {site.profession}
                <span>{site.roleLine2}</span>
              </p>
            </Reveal>
            <Reveal delay={0.1} motionOn={motionOn}>
              <h1 id="hero-title">{site.headline}</h1>
            </Reveal>
            <Reveal delay={0.16} motionOn={motionOn}>
              <p className="hero-intro">{site.intro}</p>
            </Reveal>
            <Reveal delay={0.22} motionOn={motionOn}>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">
                  View work <ArrowDownRight size={17} />
                </a>
                <a className="button button-outline" href="#contact">
                  Contact me <ArrowUpRight size={16} />
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.28} motionOn={motionOn}>
              <div className="hero-chips" aria-label="Core skills">
                {site.heroSkills.map((skill) => (
                  <span className="hero-chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal className="hero-visual" delay={0.16} motionOn={motionOn}>
            <div className="portrait-frame">
              <img
                src={site.portraitPath}
                alt={`${site.fullName}, ${site.profession}`}
                fetchPriority="high"
              />
              <div className="portrait-index">
                JAVA <span>/</span> FULL STACK
              </div>
            </div>
            <div className="portrait-note">
              <span className="scribble">building with purpose</span>
              <ArrowDownRight size={20} aria-hidden="true" />
            </div>
            <span className="hero-side-label">{site.shortLocation}</span>
          </Reveal>
          <a className="hero-scroll" href="#impact">
            <span>Scroll to explore</span>
            <ArrowDown size={14} />
          </a>
        </section>

        <section
          className="impact-section section-shell"
          id="impact"
          aria-label="Internship impact"
        >
          <div className="section-label">
            <span>01</span>
            <span>IMPACT, IN NUMBERS</span>
          </div>
          <div className="metrics-grid">
            {site.metrics.map((metric, index) => (
              <Reveal
                className="metric"
                key={metric.label}
                delay={index * 0.04}
                motionOn={motionOn}
              >
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          className="work-section section-shell"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / SELECTED WORK</p>
              <h2 id="work-title">
                Small ideas.
                <br />
                <span>Real systems.</span>
              </h2>
            </div>
            <p className="heading-aside">
              A few things I’ve built across web, mobile and connected devices.
            </p>
          </div>
          <div className="filter-row" role="group" aria-label="Filter projects">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={`filter-chip${filter === item ? " is-selected" : ""}`}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="projects-grid">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                motionOn={motionOn}
                onSelect={showProject}
              />
            ))}
          </div>
        </section>

        <section
          className="about-section section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="section-label">
            <span>03</span>
            <span>A LITTLE ABOUT ME</span>
          </div>
          <div className="about-grid">
            <Reveal motionOn={motionOn}>
              <p className="eyebrow">THOUGHTFUL BY DEFAULT</p>
              <h2 id="about-title">
                Good software is
                <br />
                built <span>all the way through.</span>
              </h2>
            </Reveal>
            <Reveal className="about-copy" delay={0.08} motionOn={motionOn}>
              {site.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <a
                className="text-link resume-link"
                href={site.resumePath}
                download="Dhruvaraj-GR-Resume.pdf"
              >
                Download resume <Download size={15} />
              </a>
            </Reveal>
          </div>
        </section>

        <section
          className="skills-section section-shell"
          id="skills"
          aria-labelledby="skills-title"
        >
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">04 / TOOLKIT</p>
              <h2 id="skills-title">
                Skills & <span>tools.</span>
              </h2>
            </div>
            <Code2
              className="heading-icon"
              size={36}
              strokeWidth={1.2}
              aria-hidden="true"
            />
          </div>
          <div className="skills-grid">
            {site.skillGroups.map((group, index) => (
              <Reveal
                className="skill-group"
                key={group.title}
                delay={index * 0.04}
                motionOn={motionOn}
              >
                <h3>{group.title}</h3>
                <div className="tag-list">
                  {group.items.map((skill) => (
                    <span className="tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="learning-row">
            <span className="learning-label">
              <Sparkles size={14} /> Currently learning
            </span>
            <div className="tag-list">
              {site.learning.map((item) => (
                <span className="tag tag-muted" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          className="experience-section section-shell"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">05 / EXPERIENCE</p>
              <h2 id="experience-title">
                Work that
                <br />
                <span>moves forward.</span>
              </h2>
            </div>
            <p className="heading-aside">
              Learning by building, measuring and improving.
            </p>
          </div>
          <div className="timeline">
            {experience.map((item, index) => (
              <Reveal
                className="timeline-item"
                key={`${item.company}-${item.dates}`}
                delay={index * 0.06}
                motionOn={motionOn}
              >
                <div className="timeline-marker" />
                <div className="timeline-top">
                  <div>
                    <p className="eyebrow">{item.location}</p>
                    <h3>{item.role}</h3>
                    <p className="timeline-company">{item.company}</p>
                  </div>
                  <span className="timeline-date">{item.dates}</span>
                </div>
                <ul className="experience-list">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          className="education-section section-shell"
          id="education"
          aria-labelledby="education-title"
        >
          <div className="section-label">
            <span>06</span>
            <span>FOUNDATIONS</span>
          </div>
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">EDUCATION & CERTIFICATIONS</p>
              <h2 id="education-title">
                Learning <span>for life.</span>
              </h2>
            </div>
          </div>
          <div className="education-grid">
            <div className="education-list">
              {site.education.map((item) => (
                <article className="education-card" key={item.degree}>
                  <div className="education-card-top">
                    <h3>{item.degree}</h3>
                    <span>{item.dates}</span>
                  </div>
                  <p>{item.institution}</p>
                  {item.detail && <small>{item.detail}</small>}
                </article>
              ))}
            </div>
            <div className="cert-list">
              <h3 className="subsection-title">Certifications</h3>
              {site.certifications.map((item) => (
                <article className="cert-card" key={item.title}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.issuer}</p>
                    {item.detail && <small>{item.detail}</small>}
                  </div>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="contact-section section-shell"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="section-label">
            <span>07</span>
            <span>LET’S CONNECT</span>
          </div>
          <div className="contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">HAVE A GOOD ONE IN MIND?</p>
              <h2 id="contact-title">
                Let’s make
                <br />
                <span>it work.</span>
              </h2>
              <p className="contact-lede">
                I’m open to full-time opportunities and conversations about
                building useful software.
              </p>
              <div className="contact-links">
                <button
                  className="contact-link email-copy"
                  type="button"
                  onClick={copyEmail}
                >
                  <AtSign size={17} />
                  <span>{site.contact.email}</span>
                  {copied ? (
                    <Check size={16} aria-label="Copied" />
                  ) : (
                    <ArrowUpRight size={16} aria-hidden="true" />
                  )}
                </button>
                <a
                  className="contact-link"
                  href={site.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={17} />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <p className="contact-location">
                  <MapPin size={16} />
                  {site.location}
                </p>
              </div>
            </div>
            <form className="contact-form" onSubmit={openMailDraft}>
              <p className="form-title">
                Send a note <MessageCircle size={17} />
              </p>
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                maxLength="80"
                placeholder="Name"
              />
              <label htmlFor="contact-email">Email address</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength="160"
                placeholder="you@example.com"
              />
              <label htmlFor="contact-message">What’s on your mind?</label>
              <textarea
                id="contact-message"
                name="message"
                required
                minLength="10"
                maxLength="1500"
                rows="4"
                placeholder="A little about what you’re looking for…"
              />
              <button
                className="button button-primary form-submit"
                type="submit"
              >
                Open email draft <Send size={15} />
              </button>
              <p className="form-note">
                Your email app will open with a draft. This static site does not
                send or store messages.
              </p>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="footer-wordmark" href="#home">
          {site.displayName}
          <i>.</i>
        </a>
        <p>Designed with intent. Built with care.</p>
        <div className="footer-right">
          <span>
            © {new Date().getFullYear()} {site.fullName}
          </span>
          <a href="#home">
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </footer>
      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          motionOn={motionOn}
          returnFocusRef={projectTriggerRef}
        />
      )}
      <div className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard." : ""}
      </div>
    </>
  );
}

export default App;
