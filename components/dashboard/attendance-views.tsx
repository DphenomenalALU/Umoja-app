"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, Check, CheckCheck, Clock3, MoreHorizontal, UsersRound, X } from "lucide-react";
import Button from "@/components/dashboard/crm-button";
import FilterMenu from "@/components/dashboard/filter-menu";
import { initialsColor } from "@/components/dashboard/event-visuals";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { checkInSignup, getEventSignups, getVolunteerHistory, getVolunteerProfile } from "@/lib/attendance-api";
import type { EventSignup, VolunteerHistoryEntry, VolunteerProfile } from "@/lib/attendance-api";
import { isMockDataMode } from "@/lib/events-api";
import type { Attendee, UmojaEvent } from "@/components/dashboard/types";

type VolunteerRow = {
  id: string;
  name: string;
  email: string | null;
  initials: string;
  events: number;
  hours: number;
  last: string;
};

const EMPTY_SIGNUPS_BY_EVENT: EventSignup[][] = [];

function formatHours(value: number) {
  return Number(value.toFixed(2)).toString();
}

function getInitials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function toAttendee(signup: EventSignup): Attendee & { signupId: string } {
  return {
    signupId: signup.signup_id,
    name: signup.full_name,
    initials: getInitials(signup.full_name),
    checkedIn: Boolean(signup.checked_in_at),
    hours: Number(signup.volunteer_hours),
  };
}

function AttendanceView({ events, onToggle }: { events: UmojaEvent[]; onToggle: (eventId: string, attendeeName: string, hours: number) => void }) {
  const volunteerEvents = events.filter((event) => event.kind === "Volunteer day");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadedSignups, setLoadedSignups] = useState<{ eventId: string; records?: EventSignup[]; error?: string } | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [hoursBySignup, setHoursBySignup] = useState<Record<string, string>>({});
  const [savingSignupId, setSavingSignupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const event = events.find((item) => item.id === selectedId) ?? volunteerEvents[0] ?? events[0];
  const eventId = event?.id;

  useEffect(() => {
    if (!eventId || isMockDataMode) return;
    let cancelled = false;
    void getEventSignups(eventId).then(
      (records) => { if (!cancelled) setLoadedSignups({ eventId, records }); },
      (loadError: unknown) => { if (!cancelled) setLoadedSignups({ eventId, error: loadError instanceof Error ? loadError.message : "Could not load sign-ups." }); },
    );
    return () => { cancelled = true; };
  }, [eventId, reloadVersion]);

  const currentSignups = eventId && loadedSignups?.eventId === eventId ? loadedSignups : null;
  const signups = currentSignups?.records ?? [];
  const loading = Boolean(eventId && !isMockDataMode && !currentSignups);
  const loadError = currentSignups?.error ?? null;
  const attendees = isMockDataMode ? event?.attendees ?? [] : signups.map(toAttendee);
  if (!event) return <section className="crm-workspace-view" aria-label="Attendance"><p className="crm-empty">Create an event before recording attendance.</p></section>;

  const checkedInCount = attendees.filter((person) => person.checkedIn).length;
  const markPresent = async (person: Attendee & { signupId?: string }) => {
    setError(null);
    setNotice(null);
    const hours = event.kind === "Volunteer day" ? Number(hoursBySignup[person.signupId ?? person.name] ?? "2") : 0;
    if (event.kind === "Volunteer day" && (!Number.isFinite(hours) || hours < 0.25 || hours > 24)) {
      setError("Enter volunteer hours between 0.25 and 24.");
      return;
    }
    if (isMockDataMode) {
      onToggle(event.id, person.name, hours);
      setNotice(`${person.name} marked present.`);
      return;
    }
    if (!person.signupId) {
      setError("This sign-up is missing its record ID. Reload the event and try again.");
      return;
    }
    setSavingSignupId(person.signupId);
    try {
      await checkInSignup(event.id, person.signupId, hours);
      setLoadedSignups({ eventId: event.id, records: await getEventSignups(event.id) });
      setNotice(`${person.name} marked present.`);
    } catch (checkinError) {
      setError(checkinError instanceof Error ? checkinError.message : "Could not record attendance.");
    } finally {
      setSavingSignupId(null);
    }
  };

  return <section className="crm-workspace-view" aria-label="Attendance">
    <div className="crm-view-toolbar"><div className="crm-filter-row"><FilterMenu label="Event" value={event.id} options={events.map((item) => ({ value: item.id, label: item.title }))} onChange={(id) => { setSelectedId(id); setError(null); setNotice(null); }} /><span className="crm-inline-stat"><CheckCheck size={14} />{checkedInCount} / {attendees.length} checked in</span></div><div className="crm-actions"><Button variant="secondary" size="sm"><ArrowDownToLine size={13} />Export</Button></div></div>
    {loading && <p role="status" className="px-4 py-3">Loading sign-ups…</p>}
    {(loadError || error) && <p role="alert" className="px-4 py-3">{error ?? loadError}</p>}
    {loadError && <div className="px-4"><Button variant="secondary" size="sm" onClick={() => { setLoadedSignups(null); setReloadVersion((version) => version + 1); }}>Try again</Button></div>}
    {notice && <p role="status" className="px-4 py-3">{notice}</p>}
    <ScrollArea orientation="both" className="crm-table-scroll"><Table role="table" className="crm-table crm-table-attendance grid min-w-max grid-cols-[repeat(5,max-content)] justify-between"><TableHeader role="rowgroup" className="contents"><TableRow role="row" className="crm-table-row"><TableHead role="columnheader">Volunteer</TableHead><TableHead role="columnheader">Sign-up</TableHead><TableHead role="columnheader">Hours given</TableHead><TableHead role="columnheader">Check-in</TableHead><TableHead role="columnheader">Action</TableHead></TableRow></TableHeader><TableBody role="rowgroup" className="contents">{attendees.map((person, index) => {
      const personKey = (person as Attendee & { signupId?: string }).signupId ?? person.name;
      const signupId = (person as Attendee & { signupId?: string }).signupId;
      return <TableRow role="row" className="crm-table-row" key={signupId ?? person.name}><TableCell role="cell"><span className="crm-volunteer-cell"><i className={`person-avatar ${initialsColor(index)}`}>{person.initials}</i><b>{person.name}</b></span></TableCell><TableCell role="cell">Signed up</TableCell><TableCell role="cell">{event.kind === "Volunteer day" ? person.checkedIn ? `${formatHours(person.hours)} hrs` : <label className="crm-hours-input"><input type="number" aria-label={`Hours for ${person.name}`} min="0.25" max="24" step="0.25" value={hoursBySignup[personKey] ?? "2"} onChange={(e) => setHoursBySignup((current) => ({ ...current, [personKey]: e.target.value }))} />hrs</label> : "—"}</TableCell><TableCell role="cell"><span className={`crm-check-status${person.checkedIn ? " is-checked" : ""}`}><i />{person.checkedIn ? "Present" : "Not checked in"}</span></TableCell><TableCell role="cell"><Button size="sm" variant={person.checkedIn ? "muted" : "primary"} disabled={person.checkedIn || loading || savingSignupId !== null} onClick={() => void markPresent({ ...person, signupId })}>{person.checkedIn ? <><Check size={13} />Present</> : savingSignupId === signupId ? "Saving…" : "Mark present"}</Button></TableCell></TableRow>;
    })}{!loading && !loadError && !error && attendees.length === 0 && <TableRow role="row" className="crm-table-row"><TableCell role="cell" colSpan={5} className="crm-empty">No one has signed up for this event yet.</TableCell></TableRow>}</TableBody></Table></ScrollArea>
    <footer className="crm-table-footer"><span><b>{attendees.length}</b> people signed up</span><span>Hours are saved when attendance is confirmed.</span></footer>
  </section>;
}

function buildMockPeople(events: UmojaEvent[]): VolunteerRow[] {
  const totals = new Map<string, VolunteerRow>();
  for (const event of events) for (const attendee of event.attendees) {
    const existing = totals.get(attendee.name) ?? { id: attendee.name, name: attendee.name, email: null, initials: attendee.initials, events: 0, hours: 0, last: "—" };
    if (attendee.checkedIn) {
      existing.events += 1;
      existing.hours += attendee.hours;
      existing.last = event.date;
    }
    totals.set(attendee.name, existing);
  }
  return [...totals.values()].sort((a, b) => b.hours - a.hours || a.name.localeCompare(b.name));
}

function buildLivePeople(events: UmojaEvent[], signupsByEvent: EventSignup[][]): VolunteerRow[] {
  const totals = new Map<string, VolunteerRow>();
  signupsByEvent.forEach((signups, eventIndex) => {
    const event = events[eventIndex];
    for (const signup of signups) {
      const person = totals.get(signup.person_id) ?? { id: signup.person_id, name: signup.full_name, email: signup.email, initials: getInitials(signup.full_name), events: 0, hours: 0, last: "—" };
      if (signup.checked_in_at) {
        person.events += 1;
        person.hours += Number(signup.volunteer_hours);
        person.last = event?.date ?? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(signup.checked_in_at));
      }
      totals.set(signup.person_id, person);
    }
  });
  return [...totals.values()].sort((a, b) => b.hours - a.hours || a.name.localeCompare(b.name));
}

function VolunteersView({ events }: { events: UmojaEvent[] }) {
  const [loadedEvents, setLoadedEvents] = useState<{ eventIds: string; signupsByEvent?: EventSignup[][]; error?: string } | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState<VolunteerRow | null>(null);
  const eventIds = events.map((event) => event.id).join(",");

  useEffect(() => {
    if (isMockDataMode || !events.length) return;
    let cancelled = false;
    void Promise.all(events.map((event) => getEventSignups(event.id))).then(
      (signupsByEvent) => { if (!cancelled) setLoadedEvents({ eventIds, signupsByEvent }); },
      (loadError: unknown) => { if (!cancelled) setLoadedEvents({ eventIds, error: loadError instanceof Error ? loadError.message : "Could not load volunteer records." }); },
    );
    return () => { cancelled = true; };
  }, [events, eventIds, reloadVersion]);

  const currentEvents = loadedEvents?.eventIds === eventIds ? loadedEvents : null;
  const signupsByEvent = currentEvents?.signupsByEvent ?? EMPTY_SIGNUPS_BY_EVENT;
  const loading = !isMockDataMode && events.length > 0 && !currentEvents;
  const error = currentEvents?.error ?? null;
  const people = useMemo(() => isMockDataMode ? buildMockPeople(events) : buildLivePeople(events, signupsByEvent), [events, signupsByEvent]);
  const totalHours = people.reduce((sum, person) => sum + person.hours, 0);
  const closeProfile = () => setSelectedPerson(null);

  return <section className="crm-workspace-view" aria-label="Volunteers">
    <div className="crm-view-toolbar"><div className="crm-filter-row"><span className="crm-inline-stat"><UsersRound size={14} />{people.length} volunteers</span><span className="crm-inline-stat"><Clock3 size={14} />{formatHours(totalHours)} hrs given</span></div><div className="crm-actions"><Button variant="secondary" size="sm"><ArrowDownToLine size={13} />Export</Button></div></div>
    {loading && <p role="status" className="px-4 py-3">Loading volunteer records…</p>}
    {error && <p role="alert" className="px-4 py-3">Could not load volunteer records: {error}</p>}
    {error && <div className="px-4"><Button variant="secondary" size="sm" onClick={() => { setLoadedEvents(null); setReloadVersion((version) => version + 1); }}>Try again</Button></div>}
    <ScrollArea orientation="both" className="crm-table-scroll"><Table role="table" className="crm-table crm-table-volunteers grid min-w-max grid-cols-[repeat(5,max-content)] justify-between"><TableHeader role="rowgroup" className="contents"><TableRow role="row" className="crm-table-row"><TableHead role="columnheader">Volunteer</TableHead><TableHead role="columnheader">Events attended</TableHead><TableHead role="columnheader">Hours given</TableHead><TableHead role="columnheader">Last active</TableHead><TableHead role="columnheader">Action</TableHead></TableRow></TableHeader><TableBody role="rowgroup" className="contents">{people.map((person, index) => <TableRow role="row" className="crm-table-row" key={person.id}><TableCell role="cell"><span className="crm-volunteer-cell"><i className={`person-avatar ${initialsColor(index)}`}>{person.initials}</i><b>{person.name}</b></span></TableCell><TableCell role="cell">{person.events}</TableCell><TableCell role="cell" className="crm-hours-total">{formatHours(person.hours)} <small>hrs</small></TableCell><TableCell role="cell">{person.last}</TableCell><TableCell role="cell"><Button variant="ghost" size="icon-sm" aria-label={`View ${person.name} profile`} onClick={() => setSelectedPerson(person)}><MoreHorizontal size={14} /></Button></TableCell></TableRow>)}{!loading && !error && people.length === 0 && <TableRow role="row" className="crm-table-row"><TableCell role="cell" colSpan={5} className="crm-empty">Volunteer records will appear after people sign up.</TableCell></TableRow>}</TableBody></Table></ScrollArea>
    <footer className="crm-table-footer"><span><b>{people.length}</b> volunteer profiles</span><span><Clock3 size={13} /> <b>{formatHours(totalHours)}</b> total hours recorded</span></footer>
    <VolunteerProfileDialog person={selectedPerson} events={events} onClose={closeProfile} />
  </section>;
}

function mockHistory(person: VolunteerRow, events: UmojaEvent[]): VolunteerHistoryEntry[] {
  return events.flatMap((event) => event.attendees
    .filter((attendee) => attendee.name === person.name && attendee.checkedIn)
    .map((attendee) => ({ id: event.id, title: event.title, kind: event.kind === "Volunteer day" ? "volunteer" as const : "meeting" as const, checked_in_at: event.date, volunteer_hours: attendee.hours })));
}

function formatHistoryDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function VolunteerProfileDialog({ person, events, onClose }: { person: VolunteerRow | null; events: UmojaEvent[]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loadedProfile, setLoadedProfile] = useState<{
    personId: string;
    profile?: VolunteerProfile;
    history?: VolunteerHistoryEntry[];
    totalHours?: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (person && dialog && !dialog.open) dialog.showModal();
    if (!person && dialog?.open) dialog.close();
    return () => { if (dialog?.open) dialog.close(); };
  }, [person]);

  useEffect(() => {
    if (!person || isMockDataMode) return;
    const selectedPerson = person;
    let cancelled = false;
    async function loadProfile() {
      try {
        if (!selectedPerson.email) throw new Error("This volunteer has no email address on their sign-up.");
        const result = await getVolunteerProfile(selectedPerson.email);
        const attendance = await getVolunteerHistory(result.id);
        if (!cancelled) setLoadedProfile({ personId: selectedPerson.id, profile: result, history: attendance.history, totalHours: attendance.totalHours });
      } catch (loadError) {
        if (!cancelled) setLoadedProfile({ personId: selectedPerson.id, error: loadError instanceof Error ? loadError.message : "Could not load this profile." });
      }
    }
    void loadProfile();
    return () => { cancelled = true; };
  }, [person]);

  if (!person) return null;
  const currentProfile = loadedProfile?.personId === person.id ? loadedProfile : null;
  const profile = currentProfile?.profile ?? null;
  const history = isMockDataMode ? mockHistory(person, events) : currentProfile?.history ?? [];
  const totalHours = isMockDataMode ? history.reduce((sum, item) => sum + Number(item.volunteer_hours), 0) : currentProfile?.totalHours ?? 0;
  const loading = !isMockDataMode && !currentProfile;
  const error = currentProfile?.error ?? null;
  const eventsAttended = profile ? Number(profile.events_attended) : history.length;
  const email = profile?.email ?? person.email;

  return <dialog ref={dialogRef} className="event-dialog" aria-labelledby="volunteer-profile-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-heading"><div><span className="eyebrow green-eyebrow">VOLUNTEER RECORD</span><h2 id="volunteer-profile-title">{person.name}</h2>{email && <p>{email}</p>}</div><button type="button" className="dialog-close" aria-label="Close profile" onClick={onClose}><X size={18} /></button></div>
    <div className="detail-dialog-content">
      {loading && <p role="status">Loading attendance history…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <>
        <div className="detail-meta"><span><UsersRound size={15} />{eventsAttended} events attended</span><span><Clock3 size={15} />{formatHours(totalHours)} hours given</span></div>
        <div className="detail-signups"><div><b>Attendance history</b><span>{history.length} events</span></div>{history.length ? history.map((entry) => <div className="detail-person" key={`${entry.id}-${entry.checked_in_at}`}><span><b>{entry.title}</b><small>{formatHistoryDate(entry.checked_in_at)} · {entry.kind === "volunteer" ? `${formatHours(Number(entry.volunteer_hours))} hours` : "Meeting"}</small></span><Check size={14} className="detail-check" /></div>) : <p className="no-signups">No attended events recorded yet.</p>}</div>
      </>}
      <div className="detail-actions"><Button variant="secondary" onClick={onClose}>Close</Button></div>
    </div>
  </dialog>;
}

export { AttendanceView, VolunteersView };
