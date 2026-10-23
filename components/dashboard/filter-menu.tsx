"use client";

import CRMButton from "./crm-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

type FilterMenuProps = {
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  align?: "start" | "end";
  className?: string;
};

export default function FilterMenu({ label, value, options, onChange, align = "start", className }: FilterMenuProps) {
  const current = options.find((option) => option.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CRMButton
          variant="secondary"
          size="none"
          className={cn(
            "crm-filter-menu group h-[30px] gap-0 overflow-hidden text-[12px] data-[state=open]:bg-muted",
            className,
          )}
        >
          {label && (
            <>
              <span className="px-[9px] font-normal text-subtle">{label}</span>
              <span aria-hidden className="h-full w-px bg-border" />
            </>
          )}
          <span className={cn("flex items-center px-[9px]", label ? "gap-1.5" : "gap-1")}>
            {current?.label ?? value}
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="size-3 text-subtle transition-transform duration-200 ease-power3-out group-data-[state=open]:rotate-180"
            >
              <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
        </CRMButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
