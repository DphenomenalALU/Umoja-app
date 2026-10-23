"use client";

import { ArrowDownToLine, Plus, Search } from "lucide-react";
import CRMButton from "./crm-button";
import FilterMenu from "@/components/dashboard/filter-menu";
import MobileEventFilters from "./mobile-event-filters";

type SortOrder = "Soonest first" | "Latest first";
type TypeFilter = "All types" | "Volunteer day" | "Community meeting";
type SignUpFilter = "Any sign-up status" | "Has spaces" | "Full";
type DateFilter = "Upcoming" | "All dates" | "Past";

type EventsToolbarProps = {
  sort: SortOrder;
  setSort: (value: SortOrder) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (value: TypeFilter) => void;
  signUpFilter: SignUpFilter;
  setSignUpFilter: (value: SignUpFilter) => void;
  dateFilter: DateFilter;
  setDateFilter: (value: DateFilter) => void;
  resultCount: number;
  searchOpen: boolean;
  query: string;
  setQuery: (value: string) => void;
  openCreate: () => void;
};

const menuOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

export default function EventsToolbar({
  sort,
  setSort,
  typeFilter,
  setTypeFilter,
  signUpFilter,
  setSignUpFilter,
  dateFilter,
  setDateFilter,
  resultCount,
  searchOpen,
  query,
  setQuery,
  openCreate,
}: EventsToolbarProps) {
  return (
    <div className="crm-view-toolbar">
      <div className="crm-filter-row crm-desktop-filter-row">
        <FilterMenu label="Sort by" value={sort} options={menuOptions(["Soonest first", "Latest first"])} onChange={(value) => setSort(value as SortOrder)} />
        <FilterMenu label="Type" value={typeFilter} options={menuOptions(["All types", "Volunteer day", "Community meeting"])} onChange={(value) => setTypeFilter(value as TypeFilter)} />
        <FilterMenu label="Sign-ups" value={signUpFilter} options={menuOptions(["Any sign-up status", "Has spaces", "Full"])} onChange={(value) => setSignUpFilter(value as SignUpFilter)} />
        <FilterMenu label="Date" value={dateFilter} options={menuOptions(["Upcoming", "All dates", "Past"])} onChange={(value) => setDateFilter(value as DateFilter)} />
      </div>
      <div className="crm-mobile-filter-row">
        <MobileEventFilters
          resultCount={resultCount}
          sort={sort}
          setSort={setSort}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          signUpFilter={signUpFilter}
          setSignUpFilter={setSignUpFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      </div>
      <div className="crm-actions">
        {searchOpen && (
          <label className="crm-search-input">
            <Search size={13} />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" aria-label="Search events" />
          </label>
        )}
        <CRMButton variant="secondary" size="sm"><ArrowDownToLine size={13} />Export</CRMButton>
        <CRMButton variant="primary" size="sm" onClick={openCreate}><Plus size={13} />New event</CRMButton>
      </div>
    </div>
  );
}
