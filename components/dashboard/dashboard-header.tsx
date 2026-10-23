"use client";

import { Menu, Search } from "lucide-react";
import CRMButton from "./crm-button";
import NotificationFeed from "./notification-feed";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CommunityNotification, UmojaEvent, View } from "./types";

type DashboardHeaderProps = {
  active: View;
  setActive: (view: View) => void;
  onMenu: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  events: UmojaEvent[];
  notifications: CommunityNotification[];
  onReadNotification: (notificationId: string) => void;
  onMarkAllNotificationsRead: () => void;
  onSelectNotificationEvent: (eventId: string) => void;
};

export default function DashboardHeader({
  active,
  setActive,
  onMenu,
  searchOpen,
  setSearchOpen,
  events,
  notifications,
  onReadNotification,
  onMarkAllNotificationsRead,
  onSelectNotificationEvent,
}: DashboardHeaderProps) {
  return (
    <header className="crm-header shrink-0">
      <div className="crm-header-top flex items-center justify-between gap-2 px-4 py-[14px]">
        <div className="crm-heading-line flex min-w-0 items-center gap-2">
          <CRMButton variant="secondary" size="icon" className="crm-mobile-menu lg:hidden" aria-label="Open navigation" onClick={onMenu}>
            <Menu size={15} />
          </CRMButton>
          <h1>{active}</h1>
          <span className="crm-status"><i />Sample workspace</span>
        </div>
        <div className="crm-header-actions flex shrink-0 items-center gap-2">
          <CRMButton variant="secondary" size="icon" aria-label="Search events" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={14} />
          </CRMButton>
          <NotificationFeed
            events={events}
            notifications={notifications}
            onRead={onReadNotification}
            onMarkAllRead={onMarkAllNotificationsRead}
            onSelectEvent={onSelectNotificationEvent}
          />
          <CRMButton variant="secondary" size="none" className="crm-profile-button caption-style h-[30px] gap-1.5 py-[5px] pr-[7px] pl-[5px] font-normal" aria-label="Open Joyce Moyo profile">
            <span className="user-avatar">JM</span><span>Joyce Moyo</span>
          </CRMButton>
        </div>
      </div>
      <Tabs value={active} onValueChange={(view) => setActive(view as View)}>
        <TabsList className="border-border crm-tabs border-b px-4" aria-label="Workspace views">
          {(["Events", "Attendance", "Volunteers"] as View[]).map((view) => (
            <TabsTrigger key={view} value={view}>{view}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  );
}
