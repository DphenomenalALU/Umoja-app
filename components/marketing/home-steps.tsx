import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "./scroll-reveal";
import SquircleIcon, { type FeatureIconName, type SquircleTone } from "./squircle-icon";

/** One person row in a demo card: initials, name, detail and an optional pill. */
function MiniPerson({ face, name, detail, pill }: { face: string; name: string; detail: string; pill?: string }) {
  return (
    <div className="cal-mini-row">
      <span className="cal-mini-face">{face}</span>
      <span className="min-w-0 flex-1">
        <strong>{name}</strong>
        <small>{detail}</small>
      </span>
      {pill ? <span className="cal-mini-pill">{pill}</span> : null}
    </div>
  );
}

type Step = {
  title: string;
  body: string;
  items: Array<[FeatureIconName, SquircleTone, string]>;
  demo: ReactNode;
  art: ReactNode;
};

/** Pastel gradient fill for the resting-card artwork. Colors come from the
 *  theme's gradient tokens, so the shapes follow light and dark mode. */
function ArtGradient({ id, from, to }: { id: string; from: string; to: string }) {
  return (
    <defs>
      {/* Lit from the upper left: a soft highlight fading into two pale tints. */}
      <radialGradient id={id} cx="0.3" cy="0.15" r="1.05">
        <stop offset="0" style={{ stopColor: "var(--cal-art-light)", stopOpacity: 1 }} />
        <stop offset="0.55" style={{ stopColor: `var(${from})`, stopOpacity: 0.5 }} />
        <stop offset="1" style={{ stopColor: `var(${to})`, stopOpacity: 0.7 }} />
      </radialGradient>
    </defs>
  );
}

const ART_BOX = { viewBox: "0 0 240 260", preserveAspectRatio: "xMidYMax slice", "aria-hidden": true } as const;

const STEPS: Step[] = [
  {
    title: "Share the plan",
    body: "Create a meeting or volunteer day with the details people need to show up.",
    items: [
      ["calendar", "forest", "Add a date, place, and agenda"],
      ["people", "clay", "Set spaces for volunteer days"],
      ["location", "sage", "Keep directions with the event"],
    ],
    demo: (
      <div className="cal-mini">
        <p className="cal-mini-label">Next community events</p>
        <div className="cal-mini-list">
          <MiniPerson face="31" name="Community garden clean-up" detail="Oct 31 · Riverside Gardens" pill="Volunteer" />
          <MiniPerson face="04" name="East Ward monthly baraza" detail="Nov 04 · Umoja Hall" pill="Meeting" />
        </div>
      </div>
    ),
    // A search lens.
    art: (
      <svg {...ART_BOX}>
        <ArtGradient id="cal-art-find" from="--cal-art-mint" to="--cal-art-blue" />
        <circle cx="104" cy="150" r="74" fill="none" stroke="url(#cal-art-find)" strokeWidth="40" />
        <rect x="150" y="206" width="44" height="110" rx="22" transform="rotate(-42 172 261)" fill="url(#cal-art-find)" />
      </svg>
    ),
  },
  {
    title: "Bring people in",
    body: "Neighbors RSVP in one step. Organizers can see the list and how many spaces remain.",
    items: [
      ["people", "clay", "One action to join"],
      ["check", "forest", "See who plans to come"],
      ["heart", "ochre", "Know when the group is full"],
    ],
    demo: (
      <div className="cal-mini">
        <p className="cal-mini-label">People coming · 13 spots filled</p>
        <div className="cal-mini-meter"><span style={{ width: "65%" }} /></div>
        <p className="cal-mini-note">7 volunteer spaces remain</p>
        <div className="cal-mini-list cal-mini-divided">
          <MiniPerson face="JM" name="Joyce Moyo" detail="Joined just now" pill="Going" />
          <MiniPerson face="AK" name="Amara Kunda" detail="Joined yesterday" pill="Going" />
        </div>
      </div>
    ),
    // Two linked circles.
    art: (
      <svg {...ART_BOX}>
        <ArtGradient id="cal-art-connect-a" from="--cal-art-blue" to="--cal-art-mint" />
        <ArtGradient id="cal-art-connect-b" from="--cal-art-lavender" to="--cal-art-blue" />
        <circle cx="86" cy="176" r="78" fill="url(#cal-art-connect-a)" />
        <circle cx="170" cy="140" r="78" fill="url(#cal-art-connect-b)" opacity="0.8" />
      </svg>
    ),
  },
  {
    title: "Mark who came",
    body: "Check people in on the day and keep attendance connected to each event.",
    items: [
      ["check", "forest", "Organizer confirms attendance"],
      ["calendar", "ochre", "Keep a record for every event"],
      ["people", "sage", "See the whole group together"],
    ],
    demo: (
      <div className="cal-mini">
        <p className="cal-mini-label">Check-in · Garden clean-up</p>
        <div className="cal-mini-list">
          <MiniPerson face="JM" name="Joyce Moyo" detail="Checked in" pill="2.5 hrs" />
          <MiniPerson face="PS" name="Peter Sitoe" detail="Not here yet" />
        </div>
        <p className="cal-mini-note cal-mini-divided">Attendance stays with the event.</p>
      </div>
    ),
    // Two chat bubbles.
    art: (
      <svg {...ART_BOX}>
        <ArtGradient id="cal-art-message-a" from="--cal-art-lavender" to="--cal-art-peach" />
        <ArtGradient id="cal-art-message-b" from="--cal-art-lime" to="--cal-art-lavender" />
        <path d="M24 118a44 44 0 0 1 44-44h86a44 44 0 0 1 0 88H70l-34 26 6-34a44 44 0 0 1-18-36Z" fill="url(#cal-art-message-a)" />
        <path d="M216 222a40 40 0 0 0-40-40H96a40 40 0 0 0 0 80h82l30 22-6-30a40 40 0 0 0 14-32Z" fill="url(#cal-art-message-b)" />
      </svg>
    ),
  },
  {
    title: "Recognize the hours",
    body: "Build a volunteer history that shows the events people attended and time they gave.",
    items: [
      ["clock", "ochre", "Record hours at check-in"],
      ["heart", "clay", "See volunteer history"],
      ["people", "sage", "Celebrate consistent help"],
    ],
    demo: (
      <div className="cal-mini">
        <p className="cal-mini-label">Volunteer profile</p>
        <p className="cal-mini-bubble">24.5 hours given across 8 community events.</p>
        <div className="cal-mini-list cal-mini-divided">
          <MiniPerson face="JM" name="Joyce Moyo" detail="Creekside clean-up · Oct 18" pill="2.5 hrs" />
        </div>
      </div>
    ),
    // A calendar grid with one day picked.
    art: (
      <svg {...ART_BOX}>
        <ArtGradient id="cal-art-book" from="--cal-art-lime" to="--cal-art-lavender" />
        <ArtGradient id="cal-art-book-on" from="--cal-art-mint" to="--cal-art-blue" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={22 + col * 70}
              y={92 + row * 70}
              width="58"
              height="58"
              rx="18"
              fill={row === 1 && col === 1 ? "url(#cal-art-book-on)" : "url(#cal-art-book)"}
              opacity={row === 1 && col === 1 ? 1 : 0.55}
            />
          )),
        )}
      </svg>
    ),
  },
];

/** "Built for..." band: four step cards; the hovered or focused card widens
 *  and shows its small demo, the first card is open by default. */
export default function HomeSteps() {
  return (
    <section aria-labelledby="cal-steps-heading" className="cal-section wrap" id="how-it-works">
      <Reveal className="cal-intro">
        <h2 id="cal-steps-heading" className="cal-h2-xl">
          Four steps. A stronger community.
        </h2>
        <p className="cal-lead">
          From the first announcement to the hours neighbors give, Umoja keeps the work moving together.
        </p>
        <Link href="/dashboard" className="button button-dark mt-8">
          Explore Umoja
        </Link>
      </Reveal>

      <Reveal>
        <ol className="cal-steps">
          {STEPS.map((step) => (
            <li key={step.title} className="cal-step" tabIndex={0}>
              <div className="cal-step-head">
                <h3>{step.title}</h3>
                <p className="cal-muted">{step.body}</p>
                <ul className="cal-step-items">
                  {step.items.map(([icon, tone, text]) => (
                    <li key={text}>
                      <SquircleIcon icon={icon} tone={tone} size={22} />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cal-step-art" aria-hidden="true">
                {step.art}
              </div>
              <div className="cal-step-demo" aria-hidden="true">
                {step.demo}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
