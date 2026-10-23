"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, CheckCheck, MapPin } from "lucide-react";
import SquircleIcon, { type FeatureIconName, type SquircleTone } from "./squircle-icon";
import { useScrollScrub, useScrubEnabled } from "./use-scroll-scrub";

type Tab = {
  id: string;
  label: string;
  icon: FeatureIconName;
  tone: SquircleTone;
  title: string;
  body: string;
  href: string;
  draw: ReactNode;
};

function EventsPreview() {
  return (
    <div className="preview-window event-preview">
      <div className="preview-window-head"><span>UP NEXT IN YOUR COMMUNITY</span><span className="preview-count">3 EVENTS</span></div>
      <div className="event-preview-row"><span className="date-tile"><small>OCT</small><b>31</b></span><span className="event-preview-main"><span className="event-tag volunteer-tag">VOLUNTEER DAY</span><b>Community garden clean-up</b><small><MapPin size={12} /> Riverside Gardens <i>·</i> 9:00 AM</small></span><span className="preview-arrow">↗</span></div>
      <div className="event-preview-row"><span className="date-tile meeting-date"><small>NOV</small><b>04</b></span><span className="event-preview-main"><span className="event-tag meeting-tag">COMMUNITY MEETING</span><b>East Ward monthly baraza</b><small><MapPin size={12} /> Umoja Hall <i>·</i> 5:30 PM</small></span><span className="preview-arrow">↗</span></div>
      <div className="event-preview-foot"><span className="preview-avatar-row"><i>J</i><i>A</i><i>M</i><i>+6</i></span><span>People are already making plans</span></div>
    </div>
  );
}

function SignupsPreview() {
  return (
    <div className="preview-window signup-preview">
      <div className="preview-window-head"><span>PEOPLE COMING</span><b>Garden clean-up <small>· Sat, Oct 31</small></b><span className="preview-avatar-row"><i>J</i><i>A</i><i>M</i><i>+9</i></span></div>
      <div className="signup-row"><span className="person-avatar terracotta">JM</span><div><b>Joyce M.</b><small>Joined just now</small></div><span className="signup-state"><Check size={13} /> Going</span></div>
      <div className="signup-row"><span className="person-avatar moss">AK</span><div><b>Amara K.</b><small>Joined yesterday</small></div><span className="signup-state"><Check size={13} /> Going</span></div>
      <div className="signup-row"><span className="person-avatar ochre">TN</span><div><b>Tendai N.</b><small>Joined yesterday</small></div><span className="signup-state"><Check size={13} /> Going</span></div>
      <div className="preview-capacity"><span>13 of 20 spaces filled</span><div><i style={{ width: "65%" }} /></div><small>7 spaces left</small></div>
    </div>
  );
}

function AttendancePreview() {
  const volunteers: [string, string, boolean][] = [
    ["Joyce M.", "JM", true],
    ["Amara K.", "AK", true],
    ["Tendai N.", "TN", true],
    ["Peter S.", "PS", false],
  ];

  return (
    <div className="preview-window attendance-preview">
      <div className="preview-window-head"><span>CHECK-IN</span><b>Community garden clean-up <small>· Today</small></b><span className="checked-count">9 / 13 here</span></div>
      {volunteers.map(([name, initials, checked]) => (
        <div className="attendance-row" key={name}>
          <span className={`person-avatar ${checked ? "moss" : "pale"}`}>{initials}</span>
          <b>{name}</b>
          <span className={`check-control ${checked ? "checked" : ""}`}>{checked && <Check size={13} />}</span>
        </div>
      ))}
      <div className="preview-checkin-note"><CheckCheck size={15} /> Attendance updates the volunteer record.</div>
    </div>
  );
}

function VolunteerHoursPreview() {
  return (
    <div className="preview-window hours-preview">
      <div className="volunteer-card"><span className="person-avatar terracotta large">JM</span><span><small>VOLUNTEER PROFILE</small><b>Joyce Moyo</b><em>Riverside Residents Association</em></span><span className="profile-hours"><b>24.5</b><small>HOURS GIVEN</small></span></div>
      <div className="hours-summary"><div><span>EVENTS ATTENDED</span><b>8</b></div><div><span>THIS MONTH</span><b>6.5 <small>hrs</small></b></div><div><span>LAST ACTIVE</span><b>Oct 18</b></div></div>
      <div className="hours-list-title">RECENT VOLUNTEERING <span>View history →</span></div>
      <div className="hours-list-row"><span className="hours-icon"><MapPin size={13} /></span><span><b>Creekside clean-up</b><small>Oct 18 · Riverside</small></span><strong>2.5 hrs</strong></div>
      <div className="hours-list-row"><span className="hours-icon"><MapPin size={13} /></span><span><b>Community garden day</b><small>Oct 11 · East Ward</small></span><strong>4 hrs</strong></div>
    </div>
  );
}

const TABS: Tab[] = [
  {
    id: "events",
    label: "Community events",
    icon: "calendar",
    tone: "forest",
    title: "A clear home for what’s happening.",
    body: "Post the time, place, and plan once. Neighbors can find the next gathering whenever they’re ready.",
    href: "/dashboard",
    draw: <EventsPreview />,
  },
  {
    id: "signups",
    label: "RSVP and sign-ups",
    icon: "people",
    tone: "clay",
    title: "Know who’s in before the day.",
    body: "People join in one step. Organizers can see the list and keep volunteer spaces open to the right number.",
    href: "/dashboard",
    draw: <SignupsPreview />,
  },
  {
    id: "attendance",
    label: "Attendance check-in",
    icon: "check",
    tone: "ochre",
    title: "Keep a record of who came.",
    body: "Check people in on the day and keep attendance with the event, where the whole group can find it.",
    href: "/dashboard",
    draw: <AttendancePreview />,
  },
  {
    id: "hours",
    label: "Volunteer history and hours",
    icon: "clock",
    tone: "sage",
    title: "Give every hour its credit.",
    body: "A volunteer profile keeps event history and contributed hours together, so the work people give is visible.",
    href: "/dashboard",
    draw: <VolunteerHoursPreview />,
  },
];

const GROW = 280;
const SEG = 0.7;
const GAP = 24;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ease = (value: number) => value * value * (3 - 2 * value);

/** Omentir's scroll-driven product stage, with Umoja feature copy and previews. */
export default function ProductTabs() {
  const scrub = useScrubEnabled();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLElement | null)[]>([]);

  useScrollScrub(trackRef, scrub, (scrolled) => {
    const stage = stageRef.current;
    const inner = innerRef.current;
    if (!stage || !inner) return;
    const viewportHeight = window.innerHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const segment = viewportHeight * SEG;
    const pinned = TABS.length * segment;

    const grow = ease(clamp(scrolled / GROW) * (1 - clamp((scrolled - GROW - pinned) / GROW)));
    const baseWidth = Math.min(stage.parentElement?.clientWidth ?? viewportWidth, 1216);
    const baseHeight = inner.offsetHeight;
    stage.style.width = `${baseWidth + (viewportWidth - 2 * GAP - baseWidth) * grow}px`;
    stage.style.height = `${baseHeight + Math.max(0, viewportHeight - 2 * GAP - baseHeight) * grow}px`;
    document.documentElement.toggleAttribute("data-cal-immersive", grow > 0.6);

    const current = clamp((scrolled - GROW) / segment - 0.5, 0, TABS.length - 1);
    layerRefs.current.forEach((element, index) => {
      if (element) element.style.opacity = String(clamp((0.5 - Math.abs(current - index)) / 0.15 + 0.5));
    });
    const next = Math.round(current);
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });

  useEffect(() => {
    if (scrub) return;
    document.documentElement.removeAttribute("data-cal-immersive");
    stageRef.current?.style.removeProperty("width");
    stageRef.current?.style.removeProperty("height");
    layerRefs.current.forEach((element) => element?.style.removeProperty("opacity"));
  }, [scrub]);

  useEffect(() => () => document.documentElement.removeAttribute("data-cal-immersive"), []);

  const pick = (index: number) => {
    const track = trackRef.current;
    if (!scrub || !track) {
      activeRef.current = index;
      setActive(index);
      return;
    }
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + GROW + (index + 0.5) * window.innerHeight * SEG, behavior: "smooth" });
  };

  const layer = (index: number) => (element: HTMLElement | null) => {
    layerRefs.current[index] = element;
  };

  return (
    <div ref={trackRef} className={`cal-stage-track${scrub ? " is-scrub" : ""}`} id="features">
      <div className="cal-stage-pin">
        <div ref={stageRef} className="cal-stage">
          {TABS.map((tab, index) => (
            <div
              key={tab.id}
              ref={layer(index + TABS.length)}
              className={`cal-stage-back is-${tab.id}${index === active ? " is-on" : ""}`}
              aria-hidden="true"
            />
          ))}
          <div ref={innerRef} className="cal-stage-inner">
            <div className="cal-tabs" role="tablist" aria-label="Umoja products">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`cal-tab-${tab.id}`}
                  aria-selected={index === active}
                  aria-controls={`cal-panel-${tab.id}`}
                  aria-label={tab.label}
                  title={tab.label}
                  className="cal-tab"
                  onClick={() => pick(index)}
                >
                  <SquircleIcon icon={tab.icon} tone={index === active ? tab.tone : "muted"} size={52} ring />
                </button>
              ))}
            </div>

            <div className="cal-tab-cards">
              {TABS.map((tab, index) => (
                <div
                  key={tab.id}
                  ref={layer(index)}
                  id={`cal-panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`cal-tab-${tab.id}`}
                  inert={index !== active}
                  className={`cal-tab-card${index === active ? " is-on" : ""}`}
                >
                  <div className="cal-tab-copy">
                    <h2>{tab.title}</h2>
                    <p className="cal-muted">{tab.body}</p>
                    <Link href={tab.href} className="cal-underline-link">
                      Explore the workspace <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                  <div className="cal-tab-draw">{tab.draw}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
