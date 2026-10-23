export type Kind = "Volunteer day" | "Community meeting";
export type Attendee = {
  name: string;
  initials: string;
  checkedIn: boolean;
  hours: number;
};
export type UmojaEvent = {
  id: string;
  title: string;
  kind: Kind;
  date: string;
  time: string;
  venue: string;
  agenda: string;
  capacity: number | null;
  signupCount?: number;
  attendees: Attendee[];
};
export type View = "Events" | "Attendance" | "Volunteers";

export type CommunityNotification = {
  id: string;
  kind: "signup" | "attendance" | "hours";
  actor: string;
  initials: string;
  message: string;
  eventId: string;
  time: string;
  unread: boolean;
};
