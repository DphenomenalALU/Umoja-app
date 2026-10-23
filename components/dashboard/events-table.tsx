"use client";

import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import EventRow from "./event-row";
import {
  EVENT_TABLE_CELL_CLASS,
  EVENT_TABLE_COLUMNS,
  EVENT_TABLE_GRID_CLASS,
  EVENT_TABLE_ROW_CLASS,
  eventColumnClass,
} from "./event-table-columns";
import type { UmojaEvent } from "./types";

type EventsTableProps = {
  events: UmojaEvent[];
  selectedIds: string[];
  activeEventId: string | null;
  onToggleAll: () => void;
  onToggle: (eventId: string) => void;
  onOpen: (event: UmojaEvent) => void;
};

export default function EventsTable({ events, selectedIds, activeEventId, onToggleAll, onToggle, onOpen }: EventsTableProps) {
  const selectedVisible = events.filter((event) => selectedIds.includes(event.id));
  const allSelected = events.length > 0 && selectedVisible.length === events.length;
  const someSelected = selectedVisible.length > 0 && !allSelected;
  const openSpots = events
    .filter((event) => event.kind === "Volunteer day")
    .reduce((sum, event) => sum + Math.max(0, (event.capacity ?? 0) - event.attendees.length), 0);

  return (
    <div className="crm-table-container">
      <ScrollArea orientation="both" className="crm-table-scroll">
        <Table role="table" className={cn(EVENT_TABLE_GRID_CLASS, "w-full crm-table crm-table-events")}>
          <TableHeader role="rowgroup" className="contents">
            <TableRow role="row" className={EVENT_TABLE_ROW_CLASS}>
              {EVENT_TABLE_COLUMNS.map((column) => (
                <TableHead
                  key={column.key}
                  role="columnheader"
                  className={cn(EVENT_TABLE_CELL_CLASS, eventColumnClass(column.key))}
                >
                  {column.key === "event" ? (
                    <span className="flex items-center gap-5">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                        onCheckedChange={onToggleAll}
                        aria-label="Select all events"
                      />
                      {column.label}
                    </span>
                  ) : column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody role="rowgroup" className="contents">
            {events.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                selected={selectedIds.includes(event.id)}
                active={activeEventId === event.id}
                onToggle={() => onToggle(event.id)}
                onOpen={() => onOpen(event)}
              />
            ))}
            {events.length === 0 && (
              <TableRow role="row" className={EVENT_TABLE_ROW_CLASS}>
                <td
                  role="cell"
                  className={cn(EVENT_TABLE_CELL_CLASS, "crm-empty col-span-full justify-center")}
                >
                  No events match the selected filters.
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <footer className="caption-style crm-table-footer grid shrink-0 grid-cols-2 gap-px border-b border-border bg-background p-px sm:grid-cols-4">
        <div className="flex items-center gap-2 p-3 outline-1 outline-border">
          <span className="text-foreground">{events.length}</span>
          <span className="text-muted-foreground">Events in view</span>
        </div>
        {[
          `${openSpots} volunteer spaces open`,
          "Attendance check-ins",
          "Volunteer hours",
        ].map((label) => (
          <div key={label} className="flex items-center gap-2 p-3 text-muted-foreground outline-1 outline-border">
            <Plus aria-hidden size={12} />
            {label}
          </div>
        ))}
      </footer>
    </div>
  );
}
