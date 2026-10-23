"use client";

import {
  CalendarCheck,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  CircleHelp,
  Clock3,
  HandHeart,
  Settings2,
  UserPlus,
  X,
} from "lucide-react";
import CRMButton from "./crm-button";
import BrandMark from "@/components/brand-mark";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarNavItem from "./sidebar-nav-item";
import SidebarSection from "./sidebar-section";
import type { View } from "./types";

type DashboardSidebarProps = {
  active: View;
  onNavigate: (view: View) => void;
  open: boolean;
  onClose: () => void;
};

function SidebarContent({ active, onNavigate, onClose }: Omit<DashboardSidebarProps, "open">) {
  const go = (view: View) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="crm-sidebar-brand">
        <BrandMark />
        <div><b>umoja</b><small>Community workspace</small></div>
        <button className="crm-sidebar-close" aria-label="Close navigation" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <ScrollArea className="crm-side-scroll">
        <nav aria-label="Primary">
          <SidebarSection title="COMMUNITY">
            <SidebarNavItem label="Events" icon={CalendarDays} active={active === "Events"} count="12" onClick={() => go("Events")} />
            <SidebarNavItem label="Attendance" icon={CheckCheck} active={active === "Attendance"} onClick={() => go("Attendance")} />
            <SidebarNavItem label="Volunteers" icon={HandHeart} active={active === "Volunteers"} count="38" onClick={() => go("Volunteers")} />
          </SidebarSection>
          <SidebarSection title="YOUR GROUPS">
            <SidebarNavItem label="Riverside residents" />
            <SidebarNavItem label="Youth for Riverside" />
            <SidebarNavItem label="Garden collective" />
          </SidebarSection>
          <SidebarSection title="RECORDS">
            <SidebarNavItem label="Volunteer hours" icon={Clock3} active={active === "Volunteers"} onClick={() => go("Volunteers")} />
            <SidebarNavItem label="Event attendance" icon={CalendarCheck} active={active === "Attendance"} onClick={() => go("Attendance")} />
          </SidebarSection>
        </nav>
      </ScrollArea>

      <SidebarSection className="crm-side-actions">
        <SidebarNavItem label="Invite neighbors" icon={UserPlus} tone="quiet" />
        <SidebarNavItem label="Help & guidance" icon={CircleHelp} tone="quiet" />
        <SidebarNavItem label="Workspace settings" icon={Settings2} tone="quiet" />
      </SidebarSection>

      <div className="crm-sidebar-footer">
        <div className="crm-community-summary">
          <span><b>3 groups</b><small>Riverside community</small></span>
          <CRMButton variant="secondary" size="sm">Invite</CRMButton>
        </div>
        <button className="crm-user-row">
          <span className="user-avatar">JM</span>
          <span><b>Joyce Moyo</b><small>Community organiser</small></span>
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}

export default function DashboardSidebar(props: DashboardSidebarProps) {
  const { active, onNavigate, open, onClose } = props;
  return (
    <>
      {open && <button className="crm-sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`crm-sidebar${open ? " is-open" : ""}`}>
        <SidebarContent active={active} onNavigate={onNavigate} onClose={onClose} />
      </aside>
    </>
  );
}
