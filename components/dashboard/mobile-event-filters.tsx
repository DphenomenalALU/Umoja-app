"use client";

import { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import CRMButton from "./crm-button";
import CountBadge from "./count-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Kind } from "./types";

type SortOrder = "Soonest first" | "Latest first";
type TypeFilter = "All types" | Kind;
type SignUpFilter = "Any sign-up status" | "Has spaces" | "Full";
type DateFilter = "Upcoming" | "All dates" | "Past";

type MobileEventFiltersProps = {
  resultCount: number;
  sort: SortOrder;
  setSort: (value: SortOrder) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (value: TypeFilter) => void;
  signUpFilter: SignUpFilter;
  setSignUpFilter: (value: SignUpFilter) => void;
  dateFilter: DateFilter;
  setDateFilter: (value: DateFilter) => void;
};

const sortOptions: SortOrder[] = ["Soonest first", "Latest first"];
const typeOptions: TypeFilter[] = ["All types", "Volunteer day", "Community meeting"];
const signupOptions: SignUpFilter[] = ["Any sign-up status", "Has spaces", "Full"];
const dateOptions: DateFilter[] = ["Upcoming", "All dates", "Past"];

export default function MobileEventFilters({
  resultCount,
  sort,
  setSort,
  typeFilter,
  setTypeFilter,
  signUpFilter,
  setSignUpFilter,
  dateFilter,
  setDateFilter,
}: MobileEventFiltersProps) {
  const [open, setOpen] = useState(false);
  const activeCount =
    Number(sort !== "Soonest first") +
    Number(typeFilter !== "All types") +
    Number(signUpFilter !== "Any sign-up status") +
    Number(dateFilter !== "Upcoming");
  const resetFilters = () => {
    setSort("Soonest first");
    setTypeFilter("All types");
    setSignUpFilter("Any sign-up status");
    setDateFilter("Upcoming");
  };
  const resultLabel = useMemo(
    () => `${resultCount} ${resultCount === 1 ? "event" : "events"}`,
    [resultCount],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <CRMButton
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={activeCount > 0 ? `Filters, ${activeCount} active` : "Filters"}
        data-active={activeCount > 0}
        className="crm-mobile-filter-button"
      >
        <Filter size={13} aria-hidden="true" />
        Filters
        {activeCount > 0 && <CountBadge>{activeCount}</CountBadge>}
      </CRMButton>

      <SheetContent className="crm-filter-sheet" aria-describedby="event-filter-description">
        <SheetHeader>
          <div>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription id="event-filter-description" className="sr-only">
              Sort and filter the events list.
            </SheetDescription>
          </div>
          <SheetClose asChild>
            <CRMButton variant="ghost" size="icon-sm" aria-label="Close filters">
              <X size={16} aria-hidden="true" />
            </CRMButton>
          </SheetClose>
        </SheetHeader>

        <ScrollArea viewportClassName="max-h-[calc(85dvh-118px)]">
          <div className="crm-mobile-filter-fields">
            <label className="crm-mobile-filter-field">
              <span>Sort by</span>
              <Select value={sort} onValueChange={(value) => setSort(value as SortOrder)}>
                <SelectTrigger aria-label="Sort by"><SelectValue /></SelectTrigger>
                <SelectContent>{sortOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
              </Select>
            </label>
            <label className="crm-mobile-filter-field">
              <span>Type</span>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeFilter)}>
                <SelectTrigger aria-label="Type"><SelectValue /></SelectTrigger>
                <SelectContent>{typeOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
              </Select>
            </label>
            <label className="crm-mobile-filter-field">
              <span>Sign-ups</span>
              <Select value={signUpFilter} onValueChange={(value) => setSignUpFilter(value as SignUpFilter)}>
                <SelectTrigger aria-label="Sign-ups"><SelectValue /></SelectTrigger>
                <SelectContent>{signupOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
              </Select>
            </label>
            <label className="crm-mobile-filter-field">
              <span>Date</span>
              <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
                <SelectTrigger aria-label="Date"><SelectValue /></SelectTrigger>
                <SelectContent>{dateOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
              </Select>
            </label>
          </div>
        </ScrollArea>

        <SheetFooter>
          <CRMButton
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={activeCount === 0}
          >
            Reset
          </CRMButton>
          <SheetClose asChild>
            <CRMButton variant="primary" size="sm">Show {resultLabel}</CRMButton>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
