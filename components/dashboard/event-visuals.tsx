import type { Attendee, Kind } from "./types";

const tones = ["avatar-clay", "avatar-slate", "avatar-gold", "avatar-blue", "avatar-plum"];

export function initialsColor(index: number) {
  return tones[index % tones.length];
}

export function AvatarStack({ people }: { people: Attendee[] }) {
  return (
    <span className="crm-avatar-stack" aria-label={`${people.length} people signed up`}>
      {people.slice(0, 3).map((person, index) => (
        <i className={`person-avatar ${initialsColor(index)}`} key={person.name}>
          {person.initials.slice(0, 1)}
        </i>
      ))}
      {people.length > 3 && <i className="crm-avatar-overflow">+{people.length - 3}</i>}
    </span>
  );
}

export function KindPill({ kind }: { kind: Kind }) {
  return (
    <span className={`crm-kind-pill ${kind === "Volunteer day" ? "is-volunteer" : "is-meeting"}`}>
      <i />
      {kind}
    </span>
  );
}
