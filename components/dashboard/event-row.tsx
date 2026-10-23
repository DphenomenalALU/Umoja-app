"use client";

import type { MouseEvent } from "react";
import { MapPin, MoreHorizontal } from "lucide-react";
import CRMButton from "./crm-button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AvatarStack, KindPill } from "./event-visuals";
import {
  EVENT_TABLE_CELL_CLASS,
  EVENT_TABLE_ROW_CLASS,
  eventColumnClass,
  type EventTableColumnKey,
} from "./event-table-columns";
import type { UmojaEvent } from "./types";

type EventRowProps = {
  event: UmojaEvent;
  selected: boolean;
  active: boolean;
  onToggle: () => void;
  onOpen: () => void;
};

function cellClass(key: EventTableColumnKey) {
  return cn(EVENT_TABLE_CELL_CLASS, eventColumnClass(key));
}

function stop(event: MouseEvent) {
  event.stopPropagation();
}

export default function EventRow({ event, selected, active, onToggle, onOpen }: EventRowProps) {
  const signupCount = event.signupCount ?? event.attendees.length;
  const spacesLeft = event.capacity === null
    ? null
    : Math.max(0, event.capacity - signupCount);

  return (
    <TableRow
      role="row"
      onClick={onOpen}
      data-active={selected || active}
      className={cn(
        EVENT_TABLE_ROW_CLASS,
        "cursor-pointer",
      )}
    >
      <TableCell role="cell" className={cellClass("event")}>
        <span className="crm-event-row-name flex items-center gap-5">
          <Checkbox
            checked={selected}
            onCheckedChange={onToggle}
            onClick={stop}
            aria-label={`Select ${event.title}`}
          />
          <button className="crm-event-name" onClick={(e) => { stop(e); onOpen(); }}>
            {event.title}
            <small>{event.agenda}</small>
          </button>
        </span>
      </TableCell>
      <TableCell role="cell" className={cellClass("type")}>
        <KindPill kind={event.kind} />
      </TableCell>
      <TableCell role="cell" className={cellClass("people")}>
        <span className="crm-people-cell">
          <AvatarStack people={event.attendees} />
          <span>{signupCount}</span>
        </span>
      </TableCell>
      <TableCell role="cell" className={cellClass("spaces")}>
        {spacesLeft === null ? (
          <span className="crm-no-capacity">Open sign-up</span>
        ) : (
          <span className="crm-capacity-cell">
            <i>
              <b style={{ width: `${Math.min(100, (signupCount / (event.capacity ?? 1)) * 100)}%` }} />
            </i>
            <span>{spacesLeft} / {event.capacity}</span>
          </span>
        )}
      </TableCell>
      <TableCell role="cell" className={cn(cellClass("date"), "crm-date-cell")}>
        <span><b>{event.date}</b><small>{event.time}</small></span>
      </TableCell>
      <TableCell role="cell" className={cellClass("venue")}>
        <span className="crm-venue"><MapPin size={13} />{event.venue}</span>
      </TableCell>
      <TableCell role="cell" className={cellClass("action")}>
        <CRMButton
          variant="ghost"
          size="icon-sm"
          aria-label={`Open ${event.title} details`}
          onClick={(e) => { stop(e); onOpen(); }}
        >
          <MoreHorizontal size={14} />
        </CRMButton>
      </TableCell>
    </TableRow>
  );
}
