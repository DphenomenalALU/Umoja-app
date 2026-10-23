"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowDownToLine, ArrowRight, CalendarDays, Check, CheckCheck,
  Clock3, HandHeart, MapPin, MoreHorizontal, Plus, UsersRound, X,
} from "lucide-react";
import Button from "@/components/dashboard/crm-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterMenu from "@/components/dashboard/filter-menu";
import EventsTable from "@/components/dashboard/events-table";
import EventsToolbar from "@/components/dashboard/events-toolbar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { initialNotifications } from "@/components/dashboard/notification-data";
import { initialsColor, KindPill } from "@/components/dashboard/event-visuals";
import type { Attendee, Kind, UmojaEvent, View } from "@/components/dashboard/types";
import { createEvent, createSignup, getEvents, isMockDataMode, toDashboardEvent } from "@/lib/events-api";
import type { CreateEventInput } from "@/lib/events-api";

type SortOrder = "Soonest first" | "Latest first";
type TypeFilter = "All types" | Kind;
type SignUpFilter = "Any sign-up status" | "Has spaces" | "Full";
type DateFilter = "Upcoming" | "All dates" | "Past";

const initialEvents: UmojaEvent[] = [
  { id: "garden", title: "Community garden clean-up", kind: "Volunteer day", date: "Oct 31, 2026", time: "9:00 AM", venue: "Riverside Gardens", agenda: "We’ll clear the overgrown beds, turn the soil, and plant the first seedlings together. Gloves and tools are welcome; water will be provided.", capacity: 20, attendees: [
    { name: "Joyce Moyo", initials: "JM", checkedIn: false, hours: 0 }, { name: "Amara Kunda", initials: "AK", checkedIn: false, hours: 0 }, { name: "Tendai Ncube", initials: "TN", checkedIn: false, hours: 0 }, { name: "Peter Sitoe", initials: "PS", checkedIn: false, hours: 0 }, { name: "Lina Matola", initials: "LM", checkedIn: false, hours: 0 },
  ] },
  { id: "baraza", title: "East Ward monthly baraza", kind: "Community meeting", date: "Nov 04, 2026", time: "5:30 PM", venue: "Umoja Hall · East Ward", agenda: "A monthly open meeting to share local updates, raise concerns, and agree the next steps for East Ward.", capacity: null, attendees: [
    { name: "Joyce Moyo", initials: "JM", checkedIn: false, hours: 0 }, { name: "Peter Sitoe", initials: "PS", checkedIn: false, hours: 0 }, { name: "Nandi Chirwa", initials: "NC", checkedIn: false, hours: 0 },
  ] },
  { id: "market", title: "Saturday market food drive", kind: "Volunteer day", date: "Nov 07, 2026", time: "8:00 AM", venue: "Old Market Square", agenda: "Help collect pantry staples and sort food parcels for local families. Meet beside the community noticeboard.", capacity: 16, attendees: [
    { name: "Amara Kunda", initials: "AK", checkedIn: false, hours: 0 }, { name: "Lina Matola", initials: "LM", checkedIn: false, hours: 0 }, { name: "David Mussa", initials: "DM", checkedIn: false, hours: 0 }, { name: "Joyce Moyo", initials: "JM", checkedIn: false, hours: 0 },
  ] },
  { id: "youth", title: "Youth group planning circle", kind: "Community meeting", date: "Nov 12, 2026", time: "4:00 PM", venue: "Riverside Learning Centre", agenda: "Bring one idea for a youth-led activity this term. We’ll choose a date, share roles, and make a simple plan.", capacity: null, attendees: [
    { name: "Tendai Ncube", initials: "TN", checkedIn: false, hours: 0 }, { name: "Nandi Chirwa", initials: "NC", checkedIn: false, hours: 0 },
  ] },
  { id: "creek", title: "Creekside clean-up", kind: "Volunteer day", date: "Oct 18, 2026", time: "7:30 AM", venue: "North Creek footbridge", agenda: "A morning walk along the creek to collect litter and flag spots that need follow-up.", capacity: 18, attendees: [
    { name: "Joyce Moyo", initials: "JM", checkedIn: true, hours: 2.5 }, { name: "Amara Kunda", initials: "AK", checkedIn: true, hours: 2.5 }, { name: "Peter Sitoe", initials: "PS", checkedIn: true, hours: 2.5 }, { name: "Lina Matola", initials: "LM", checkedIn: true, hours: 2.5 }, { name: "David Mussa", initials: "DM", checkedIn: true, hours: 2.5 },
  ] },
];

const noopSubscribe = () => () => {};
const getServerDay = () => null;
function getLocalDay() { const date = new Date(); date.setHours(0, 0, 0, 0); return date.getTime(); }
function formatHours(value: number) { return Number(value.toFixed(2)).toString(); }

function EventsView({ events, openDetails, openCreate, searchOpen, activeEventId }: { events: UmojaEvent[]; openDetails: (event: UmojaEvent) => void; openCreate: () => void; searchOpen: boolean; activeEventId: string | null }) {
  const [sort, setSort] = useState<SortOrder>("Soonest first");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All types");
  const [signUpFilter, setSignUpFilter] = useState<SignUpFilter>("Any sign-up status");
  const [dateFilter, setDateFilter] = useState<DateFilter>("Upcoming");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const today = useSyncExternalStore(noopSubscribe, getLocalDay, getServerDay);
  const visible = useMemo(() => events.filter((event) => {
    const isUpcoming = today === null || new Date(event.date).getTime() >= today;
    const signupCount = event.signupCount ?? event.attendees.length;
    const hasSpaces = event.capacity === null || signupCount < event.capacity;
    const matchesDate = dateFilter === "All dates" || (dateFilter === "Upcoming" ? isUpcoming : !isUpcoming);
    const matchesSignUps = signUpFilter === "Any sign-up status" || (signUpFilter === "Has spaces" ? hasSpaces : !hasSpaces);
    const matchesType = typeFilter === "All types" || typeFilter === event.kind;
    const matchesQuery = `${event.title} ${event.venue} ${event.kind}`.toLowerCase().includes(query.toLowerCase());
    return matchesDate && matchesSignUps && matchesType && matchesQuery;
  }).sort((a, b) => {
    const delta = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sort === "Soonest first" ? delta : -delta;
  }), [dateFilter, events, query, signUpFilter, sort, today, typeFilter]);
  const toggleAll = () => setSelectedIds((ids) => {
    const allSelected = visible.length > 0 && visible.every((event) => ids.includes(event.id));
    return allSelected ? ids.filter((id) => !visible.some((event) => event.id === id)) : [...new Set([...ids, ...visible.map((event) => event.id)])];
  });
  const toggleSelected = (eventId: string) => setSelectedIds((ids) => ids.includes(eventId) ? ids.filter((id) => id !== eventId) : [...ids, eventId]);

  return <section className="crm-workspace-view" aria-label="Events">
    <EventsToolbar sort={sort} setSort={setSort} typeFilter={typeFilter} setTypeFilter={setTypeFilter} signUpFilter={signUpFilter} setSignUpFilter={setSignUpFilter} dateFilter={dateFilter} setDateFilter={setDateFilter} resultCount={visible.length} searchOpen={searchOpen} query={query} setQuery={setQuery} openCreate={openCreate} />
    <EventsTable events={visible} selectedIds={selectedIds} activeEventId={activeEventId} onToggleAll={toggleAll} onToggle={toggleSelected} onOpen={openDetails} />
  </section>;
}

function AttendanceView({ events, onToggle }: { events: UmojaEvent[]; onToggle: (eventId: string, attendeeName: string, hours: number) => void }) {
  const volunteerEvents = events.filter((event) => event.kind === "Volunteer day");
  const [selectedId, setSelectedId] = useState(volunteerEvents[0]?.id ?? events[0]?.id);
  const [hoursByPerson, setHoursByPerson] = useState<Record<string, string>>({});
  const event = events.find((item) => item.id === selectedId) ?? volunteerEvents[0] ?? events[0];
  if (!event) return null;
  const checked = event.attendees.filter((person) => person.checkedIn).length;
  return <section className="crm-workspace-view">
    <div className="crm-view-toolbar"><div className="crm-filter-row"><FilterMenu label="Event" value={event.id} options={events.map((item) => ({ value: item.id, label: item.title }))} onChange={setSelectedId} /><span className="crm-inline-stat"><CheckCheck size={14} />{checked} / {event.attendees.length} checked in</span></div><div className="crm-actions"><Button variant="secondary" size="sm"><ArrowDownToLine size={13} />Export</Button></div></div>
    <ScrollArea orientation="both" className="crm-table-scroll"><Table role="table" className="crm-table crm-table-attendance grid min-w-max grid-cols-[repeat(5,max-content)] justify-between"><TableHeader role="rowgroup" className="contents"><TableRow role="row" className="crm-table-row"><TableHead role="columnheader">Volunteer</TableHead><TableHead role="columnheader">Sign-up</TableHead><TableHead role="columnheader">Hours given</TableHead><TableHead role="columnheader">Check-in</TableHead><TableHead role="columnheader">Action</TableHead></TableRow></TableHeader><TableBody role="rowgroup" className="contents">{event.attendees.map((person, index) => <TableRow role="row" className="crm-table-row" key={person.name}><TableCell role="cell"><span className="crm-volunteer-cell"><i className={`person-avatar ${initialsColor(index)}`}>{person.initials}</i><b>{person.name}</b></span></TableCell><TableCell role="cell">Signed up</TableCell><TableCell role="cell">{event.kind === "Volunteer day" ? person.checkedIn ? `${formatHours(person.hours)} hrs` : <label className="crm-hours-input"><input type="number" aria-label={`Hours for ${person.name}`} min="0.25" max="24" step="0.25" value={hoursByPerson[person.name] ?? "2"} onChange={(e) => setHoursByPerson((current) => ({ ...current, [person.name]: e.target.value }))} />hrs</label> : "—"}</TableCell><TableCell role="cell"><span className={`crm-check-status${person.checkedIn ? " is-checked" : ""}`}><i />{person.checkedIn ? "Present" : "Not checked in"}</span></TableCell><TableCell role="cell"><Button size="sm" variant={person.checkedIn ? "muted" : "primary"} onClick={() => onToggle(event.id, person.name, Number(hoursByPerson[person.name] ?? 2))}>{person.checkedIn ? <><Check size={13} />Checked in</> : "Mark present"}</Button></TableCell></TableRow>)}</TableBody></Table></ScrollArea>
    <footer className="crm-table-footer"><span><b>{event.attendees.length}</b> people signed up</span><span>Hours are recorded when an organizer confirms attendance.</span></footer>
  </section>;
}

function VolunteersView({ events }: { events: UmojaEvent[] }) {
  const people = useMemo(() => {
    const totals = new Map<string, { initials: string; events: number; hours: number; last: string }>();
    for (const event of events) for (const attendee of event.attendees) {
      const old = totals.get(attendee.name) ?? { initials: attendee.initials, events: 0, hours: 0, last: "—" };
      totals.set(attendee.name, { initials: attendee.initials, events: old.events + Number(attendee.checkedIn), hours: old.hours + (attendee.checkedIn ? attendee.hours : 0), last: attendee.checkedIn ? event.date : old.last });
    }
    return [...totals.entries()].map(([name, values]) => ({ name, ...values })).sort((a, b) => b.hours - a.hours);
  }, [events]);
  return <section className="crm-workspace-view"><div className="crm-view-toolbar"><div className="crm-filter-row"><span className="crm-inline-stat"><UsersRound size={14} />{people.length} volunteers</span><span className="crm-inline-stat"><Clock3 size={14} />{formatHours(people.reduce((sum, person) => sum + person.hours, 0))} hrs given</span></div><div className="crm-actions"><Button variant="secondary" size="sm"><ArrowDownToLine size={13} />Export</Button></div></div>
    <ScrollArea orientation="both" className="crm-table-scroll"><Table role="table" className="crm-table crm-table-volunteers grid min-w-max grid-cols-[repeat(5,max-content)] justify-between"><TableHeader role="rowgroup" className="contents"><TableRow role="row" className="crm-table-row"><TableHead role="columnheader">Volunteer</TableHead><TableHead role="columnheader">Events attended</TableHead><TableHead role="columnheader">Hours given</TableHead><TableHead role="columnheader">Last active</TableHead><TableHead role="columnheader">Action</TableHead></TableRow></TableHeader><TableBody role="rowgroup" className="contents">{people.map((person, index) => <TableRow role="row" className="crm-table-row" key={person.name}><TableCell role="cell"><span className="crm-volunteer-cell"><i className={`person-avatar ${initialsColor(index)}`}>{person.initials}</i><b>{person.name}</b></span></TableCell><TableCell role="cell">{person.events}</TableCell><TableCell role="cell" className="crm-hours-total">{formatHours(person.hours)} <small>hrs</small></TableCell><TableCell role="cell">{person.last}</TableCell><TableCell role="cell"><Button variant="ghost" size="icon-sm" aria-label={`View ${person.name} profile`}><MoreHorizontal size={14} /></Button></TableCell></TableRow>)}</TableBody></Table></ScrollArea>
    <footer className="crm-table-footer"><span><b>{people.length}</b> volunteer profiles</span><span><Clock3 size={13} /> <b>{formatHours(people.reduce((sum, person) => sum + person.hours, 0))}</b> total hours recorded</span></footer></section>;
}

function EventDialog({ event, onClose, onSave, onRsvp }: { event: UmojaEvent | null | "create"; onClose: () => void; onSave: (event: UmojaEvent) => Promise<void>; onRsvp: (eventId: string, fullName: string, email: string) => Promise<{ alreadyJoined: boolean }> }) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Kind>("Volunteer day");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("20");
  const [agenda, setAgenda] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = event !== null;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) { dialog.showModal(); dialog.querySelector<HTMLElement>("[autofocus]")?.focus(); }
    return () => { if (dialog?.open) dialog.close(); };
  }, [isOpen]);
  if (!event) return null;
  const dialogEvents = {
    onCancel: (e: React.SyntheticEvent<HTMLDialogElement>) => { e.preventDefault(); onClose(); },
    onClick: (e: React.MouseEvent<HTMLDialogElement>) => { if (e.target === e.currentTarget) onClose(); },
  };
  if (event === "create") {
    const submit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSaving(true);
      setFormError(null);
      try {
        const startsAt = new Date(`${date}T${time}:00`);
        if (!date || Number.isNaN(startsAt.getTime())) throw new Error("Choose a valid event date and time.");
        const input: CreateEventInput = {
          title: title.trim(),
          kind: kind === "Volunteer day" ? "volunteer" : "meeting",
          startsAt: startsAt.toISOString(),
          venue: venue.trim(),
          agenda: agenda.trim(),
          capacity: kind === "Volunteer day" ? Number(capacity) : null,
        };
        const created = isMockDataMode
          ? {
              id: `mock-${crypto.randomUUID()}`,
              title: input.title,
              kind: input.kind,
              starts_at: input.startsAt,
              venue: input.venue,
              agenda: input.agenda,
              capacity: input.capacity,
              created_at: new Date().toISOString(),
              signup_count: 0,
            }
          : await createEvent(input);
        await onSave(toDashboardEvent(created));
        onClose();
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Could not create the event.");
      } finally {
        setSaving(false);
      }
    };
    return <dialog ref={dialogRef} className="event-dialog" aria-labelledby="create-title" {...dialogEvents}><div className="dialog-heading"><div><span className="eyebrow green-eyebrow">MAKE A PLAN</span><h2 id="create-title">Create an event</h2><p>Share the details your community needs to show up.</p></div><button type="button" className="dialog-close" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div><form onSubmit={submit}><label>Event name<input required minLength={3} maxLength={120} autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Community garden day" /></label><label>Type<select value={kind} onChange={(e) => setKind(e.target.value as Kind)}><option>Volunteer day</option><option>Community meeting</option></select></label><div className="form-two"><label>Date<input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></label><label>Start time<input type="time" required value={time} onChange={(e) => setTime(e.target.value)} /></label></div><div className="form-two"><label>Venue<input required minLength={2} maxLength={180} value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Where should people meet?" /></label>{kind === "Volunteer day" && <label>Volunteer spaces<input type="number" min="1" max="5000" required value={capacity} onChange={(e) => setCapacity(e.target.value)} /></label>}</div><label>What’s the plan?<textarea rows={3} maxLength={4000} value={agenda} onChange={(e) => setAgenda(e.target.value)} placeholder="Share a short agenda or what volunteers will do." /></label>{formError && <p role="alert">{formError}</p>}<div className="dialog-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" disabled={saving}>{saving ? "Creating..." : <><Plus size={15} />Create event</>}</Button></div></form></dialog>;
  }
  const current = event.attendees.find((person) => person.name === "Joyce Moyo");
  const signupCount = event.signupCount ?? event.attendees.length;
  const eventIsFull = event.capacity !== null && signupCount >= event.capacity && !current;
  const submitRsvp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    try {
      const result = await onRsvp(event.id, fullName, email);
      setRsvpMessage(result.alreadyJoined ? "You are already signed up for this event." : "You are signed up. We look forward to seeing you there.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not join this event.");
    }
  };
  return <dialog ref={dialogRef} className="event-dialog event-detail-dialog" aria-labelledby="event-detail-title" {...dialogEvents}><div className="detail-cover"><span className="detail-illustration"><HandHeart size={30} /></span><button autoFocus type="button" className="dialog-close on-cover" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div><div className="detail-dialog-content"><KindPill kind={event.kind} /><h2 id="event-detail-title">{event.title}</h2><div className="detail-meta"><span><CalendarDays size={15} />{event.date} · {event.time}</span><span><MapPin size={15} />{event.venue}</span></div><div className="detail-agenda"><span className="eyebrow green-eyebrow">THE PLAN</span><p>{event.agenda || "The organizer will share more details soon."}</p></div><div className="detail-signups"><div><b>Who’s coming</b><span>{event.capacity === null ? `${signupCount} signed up` : `${signupCount} of ${event.capacity} spaces`}</span></div>{event.attendees.length ? event.attendees.map((person, index) => <div className="detail-person" key={person.name}><i className={`person-avatar ${initialsColor(index)}`}>{person.initials}</i><span><b>{person.name}</b><small>{person.checkedIn ? `Attended · ${formatHours(person.hours)} hours recorded` : "Signed up"}</small></span>{person.checkedIn && <Check size={14} className="detail-check" />}</div>) : <p className="no-signups">No attendee details are loaded for this event yet.</p>}</div><form onSubmit={submitRsvp}><label>Your name<input required minLength={2} maxLength={100} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" /></label><label>Your email<input required type="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>{formError && <p role="alert">{formError}</p>}{rsvpMessage && <p role="status">{rsvpMessage}</p>}<div className="detail-actions"><Button type="button" variant="secondary" onClick={onClose}>Close</Button><Button type="submit" variant="primary" disabled={eventIsFull}>{eventIsFull ? "Event full" : "I’m coming"}<ArrowRight size={14} /></Button></div></form><p className="preview-only-note">{isMockDataMode ? "Mock changes stay in this browser session and reset on reload." : "API-connected events and sign-ups are saved to PostgreSQL."}</p></div></dialog>;
}

export default function DashboardWorkspace() {
  const [events, setEvents] = useState(initialEvents);
  const [eventsLoading, setEventsLoading] = useState(!isMockDataMode);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [active, setActive] = useState<View>("Events");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dialog, setDialog] = useState<UmojaEvent | null | "create">(null);
  const mockSignups = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (isMockDataMode) return;
    let cancelled = false;
    async function loadEvents() {
      try {
        setEventsLoading(true);
        setEventsError(null);
        const apiEvents = await getEvents();
        if (!cancelled) setEvents(apiEvents.map(toDashboardEvent));
      } catch (error) {
        if (!cancelled) {
          setEventsError(error instanceof Error ? error.message : "Could not load events.");
        }
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    }
    void loadEvents();
    return () => { cancelled = true; };
  }, []);
  const updateAttendee = (eventId: string, attendeeName: string, updater: (person: Attendee) => Attendee) => setEvents((items) => items.map((event) => event.id !== eventId ? event : { ...event, attendees: event.attendees.map((person) => person.name === attendeeName ? updater(person) : person) }));
  const toggleCheckIn = (eventId: string, attendeeName: string, enteredHours: number) => {
    const event = events.find((item) => item.id === eventId);
    const hours = event?.kind === "Volunteer day" ? Math.min(24, Math.max(0.25, enteredHours || 2)) : 0;
    updateAttendee(eventId, attendeeName, (person) => ({ ...person, checkedIn: !person.checkedIn, hours: person.checkedIn ? 0 : hours }));
  };
  const toggleRsvp = async (eventId: string, fullName: string, email: string) => {
    const mockKey = `${eventId}:${email.trim().toLowerCase()}`;
    const alreadyJoined = isMockDataMode && mockSignups.current.has(mockKey);
    if (isMockDataMode && !alreadyJoined) mockSignups.current.add(mockKey);
    const signup = isMockDataMode
      ? { person: { full_name: fullName }, alreadyJoined }
      : await createSignup(eventId, { fullName, email });
    setEvents((items) => items.map((event) => {
      if (event.id !== eventId) return event;
      const person = {
        name: signup.person.full_name,
        initials: signup.person.full_name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        checkedIn: false,
        hours: 0,
      };
      const hasPerson = event.attendees.some((attendee) => attendee.name === person.name);
      return {
        ...event,
        signupCount: (event.signupCount ?? event.attendees.length) + (signup.alreadyJoined || hasPerson ? 0 : 1),
        attendees: signup.alreadyJoined || hasPerson ? event.attendees : [...event.attendees, person],
      };
    }));
    return { alreadyJoined: signup.alreadyJoined };
  };
  const saveEvent = async (event: UmojaEvent) => setEvents((items) => [event, ...items]);
  const markNotificationRead = (notificationId: string) => setNotifications((items) => items.map((item) => item.id === notificationId ? { ...item, unread: false } : item));
  const markAllNotificationsRead = () => setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
  const selectNotificationEvent = (eventId: string) => {
    const event = events.find((item) => item.id === eventId);
    if (event) setDialog(event);
  };
  const selectedEvent = typeof dialog === "object" && dialog !== null ? events.find((event) => event.id === dialog.id) ?? null : dialog;
  const activeEventId = typeof dialog === "object" && dialog !== null ? dialog.id : null;
  return <main className="crm-app-shell"><DashboardSidebar active={active} onNavigate={setActive} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="crm-main"><DashboardHeader active={active} setActive={setActive} onMenu={() => setSidebarOpen(true)} searchOpen={searchOpen} setSearchOpen={setSearchOpen} events={events} notifications={notifications} isMockDataMode={isMockDataMode} onReadNotification={markNotificationRead} onMarkAllNotificationsRead={markAllNotificationsRead} onSelectNotificationEvent={selectNotificationEvent} />{eventsLoading && <p role="status" className="px-4 py-3">Loading events...</p>}{eventsError && <p role="alert" className="px-4 py-3">Live events unavailable: {eventsError} Showing labeled sample data.</p>}{active === "Events" && <EventsView events={events} openDetails={setDialog} openCreate={() => setDialog("create")} searchOpen={searchOpen} activeEventId={activeEventId} />}{active === "Attendance" && <AttendanceView events={events} onToggle={toggleCheckIn} />}{active === "Volunteers" && <VolunteersView events={events} />}<EventDialog event={dialog === "create" ? "create" : selectedEvent} onClose={() => setDialog(null)} onSave={saveEvent} onRsvp={toggleRsvp} /></div></main>;
}
