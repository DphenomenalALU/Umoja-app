export const EVENT_TABLE_COLUMNS = [
  { key: "event", label: "Event", className: "justify-start" },
  { key: "type", label: "Type", className: "justify-start" },
  { key: "people", label: "People", className: "justify-start" },
  { key: "spaces", label: "Spaces left", className: "justify-start tabular-nums" },
  { key: "date", label: "Date & time", className: "justify-start" },
  { key: "venue", label: "Venue", className: "justify-start" },
  { key: "action", label: "Action", className: "justify-center" },
] as const;

export type EventTableColumnKey = (typeof EVENT_TABLE_COLUMNS)[number]["key"];

export const EVENT_TABLE_GRID_CLASS =
  "grid min-w-max grid-cols-[repeat(7,max-content)] justify-between";

export const EVENT_TABLE_ROW_CLASS = "col-span-full grid grid-cols-subgrid";

export const EVENT_TABLE_CELL_CLASS = "flex items-center";

export function eventColumnClass(key: EventTableColumnKey) {
  return EVENT_TABLE_COLUMNS.find((column) => column.key === key)?.className ?? "";
}
