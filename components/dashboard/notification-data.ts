import type { CommunityNotification } from "./types";

export const initialNotifications: CommunityNotification[] = [
  {
    id: "signup-garden",
    kind: "signup",
    actor: "Amara Kunda",
    initials: "AK",
    message: "joined the volunteer list for",
    eventId: "garden",
    time: "8 min ago",
    unread: true,
  },
  {
    id: "attendance-creek",
    kind: "attendance",
    actor: "Peter Sitoe",
    initials: "PS",
    message: "was checked in for",
    eventId: "creek",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "hours-creek",
    kind: "hours",
    actor: "Lina Matola",
    initials: "LM",
    message: "recorded 2.5 volunteer hours at",
    eventId: "creek",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "signup-baraza",
    kind: "signup",
    actor: "Nandi Chirwa",
    initials: "NC",
    message: "RSVP’d to",
    eventId: "baraza",
    time: "Yesterday",
    unread: false,
  },
];
