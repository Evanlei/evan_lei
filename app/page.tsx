import ClimbScene from "@/components/ClimbScene";
import { experience, logoCluster, logos, profile, projects, type Project } from "@/lib/content";
import { stageMarkup } from "@/lib/stage-markup";

function InkoSketch() {
  return (
    <svg width="150" height="96" viewBox="0 0 120 80" fill="none" stroke="#45634f" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M28 36 L54 20 M28 44 L54 60 M70 20 L92 36 M70 60 L92 44 M62 25 L62 55" stroke="#d2672f" />
      <circle cx="20" cy="40" r="9" fill="#fbfaf5" />
      <circle cx="62" cy="16" r="9" fill="#fbfaf5" />
      <circle cx="62" cy="64" r="9" fill="#fbfaf5" />
      <circle cx="100" cy="40" r="9" fill="#fbfaf5" />
    </svg>
  );
}

function ProjectPanel({ project }: { project: Project }) {
  const shotClass = project.image ? (project.image.kind === "icon" ? "shot icon" : "shot") : "shot inko";
  return (
    <section className="panel" id={project.id} data-camp={project.camp}>
      <span className="kicker">
        <b data-alt="" /> · {project.kicker}
      </span>
      <div className="ptitle">
        {project.icon && <img className="ico" src={project.icon} alt="" />}
        <h2>{project.name}</h2>
        {project.award && <span className="award">◆ {project.award}</span>}
        <span className="date">{project.date}</span>
      </div>
      <div className={shotClass}>
        {project.image ? <img src={project.image.src} alt={project.image.alt} /> : <InkoSketch />}
        <div className="stack">
          {project.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
      <p>{project.description}</p>
      <div className="links">
        {project.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <div className="stage" aria-hidden="true" dangerouslySetInnerHTML={{ __html: stageMarkup }} />

      <p className="sr-only" id="npLive" aria-live="polite" />
      <header className="hud">
        <a className="wordmark" href="#base">
          {profile.name}
        </a>
        <div className="hud-right">
          <span className="altimeter" aria-hidden="true">
            ↑ <b id="alt">0</b> m
          </span>
          <button className="pill" id="viewToggle" type="button">
            List view
          </button>
        </div>
      </header>

      <nav className="camps-nav" aria-label="Sections" id="campsNav" />

      <div className="scroll-hint" id="scrollHint" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 2v10M3 8l4 4 4-4" />
        </svg>
        <span className="hint-desk">
          Scroll or press <kbd>↓</kbd> to start the climb
        </span>
        <span className="hint-touch">Swipe up to start the climb</span>
      </div>

      <main id="main">
        <section className="panel hero" id="base" data-camp="Base camp">
          <span className="kicker">
            <b data-alt="">0 m</b> · Base camp
          </span>
          <h1>
            Hi, I&apos;m{" "}
            <span className="chip me" data-tip="That's me">
              <img src="/images/me.png" alt="" />
            </span>{" "}
            <strong>Evan&nbsp;Lei</strong>.
          </h1>
          <p className="lede">
            I&apos;m a CS student at{" "}
            <span className="chip crown" data-tip="Columbia University">
              <img src={logos.columbia} alt="" />
            </span>{" "}
            <strong>Columbia University</strong>. I like building things I&apos;d actually use, lately with computer
            vision and real-time collaboration.
          </p>
          <p>Off the keyboard, I play clarinet in the Columbia University Orchestra and run long distances.</p>
          <div className="links">
            <a href={profile.github}>GitHub</a>
            <a href={profile.linkedin}>LinkedIn</a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        </section>

        <section className="panel" id="experience" data-camp="Experience">
          <span className="kicker">
            <b data-alt="" /> · Experience
          </span>
          <p className="lede" style={{ marginTop: 0 }}>
            I&apos;ve built software at{" "}
            <span className="cluster">
              {logoCluster.map((job) => (
                <span key={job.org} className={job.padLogo ? "logo pad" : "logo"} data-tip={`${job.role} @ ${job.org}`}>
                  <img src={job.logo} alt={job.logoAlt} />
                </span>
              ))}
            </span>{" "}
            a defense contractor and two research labs.
          </p>
          <div className="exp-list">
            {experience.map((job) => (
              <div className="exp" key={job.org}>
                <div className="exp-head">
                  <h3>{job.org}</h3>
                  <span className="when">{job.when}</span>
                </div>
                <p>{job.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {projects.map((project) => (
          <ProjectPanel key={project.id} project={project} />
        ))}

        <section className="panel summit-panel" id="summit" data-camp="Summit">
          <span className="kicker">
            <b data-alt="" /> · Summit
          </span>
          <h2>You made it to the top.</h2>
          <p className="cta-line">
            Want to talk about a project, running gear, or a good trail?{" "}
            <a href={`mailto:${profile.email}`}>Let&apos;s chat →</a>
          </p>
          <div className="links">
            <a href={profile.linkedin}>LinkedIn</a>
            <a href={profile.github}>GitHub</a>
          </div>
          <p className="clock" id="nycClock" />
          <div className="links">
            <button className="pill" type="button" id="backDown">
              ↓ Head back down
            </button>
          </div>
        </section>
      </main>

      <ClimbScene />
    </>
  );
}
