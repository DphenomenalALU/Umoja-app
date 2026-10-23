"use client";

import { useState } from "react";
import { Bell, CalendarCheck2, Clock3, UserPlus } from "lucide-react";
import CRMButton from "./crm-button";
import CountBadge from "./count-badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CommunityNotification, UmojaEvent } from "./types";

type NotificationFeedProps = {
  events: UmojaEvent[];
  notifications: CommunityNotification[];
  onRead: (notificationId: string) => void;
  onMarkAllRead: () => void;
  onSelectEvent: (eventId: string) => void;
};

type Filter = "all" | "unread";

const notificationIcons = {
  signup: UserPlus,
  attendance: CalendarCheck2,
  hours: Clock3,
};

export default function NotificationFeed({
  events,
  notifications,
  onRead,
  onMarkAllRead,
  onSelectEvent,
}: NotificationFeedProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const unreadCount = notifications.filter((item) => item.unread).length;
  const visible = notifications.filter(
    (item) => filter === "all" || item.unread,
  );

  function selectNotification(item: CommunityNotification) {
    onRead(item.id);
    setOpen(false);
    onSelectEvent(item.eventId);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CRMButton
          variant="secondary"
          size="icon"
          aria-label={
            unreadCount > 0
              ? "Notifications, " + unreadCount + " unread"
              : "Notifications"
          }
          aria-expanded={open}
          className="crm-notification-trigger"
        >
          <Bell size={14} aria-hidden="true" />
          {unreadCount > 0 && <i className="crm-notification-dot" aria-hidden="true" />}
        </CRMButton>
      </PopoverTrigger>

      <PopoverContent className="crm-notification-popover">
        <div className="crm-notification-heading">
          <div>
            <h2>Notifications</h2>
            {unreadCount > 0 && <CountBadge>{unreadCount}</CountBadge>}
          </div>
          <CRMButton
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0}
            onClick={onMarkAllRead}
          >
            Mark all as read
          </CRMButton>
        </div>

        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as Filter)}
        >
          <TabsList className="crm-notification-tabs" aria-label="Filter notifications">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>

        {visible.length > 0 ? (
          <ScrollArea className="crm-notification-scroll" viewportClassName="max-h-[min(420px,60dvh)]">
            <ul className="crm-notification-items">
              {visible.map((item) => {
                const event = events.find((candidate) => candidate.id === item.eventId);
                if (!event) return null;
                const Icon = notificationIcons[item.kind];

                return (
                  <li key={item.id}>
                    <CRMButton
                      variant="item"
                      size="none"
                      data-unread={item.unread}
                      className="crm-notification-item"
                      onClick={() => selectNotification(item)}
                    >
                      <span className="crm-notification-avatar">
                        {item.initials}
                        <span className={"crm-notification-kind is-" + item.kind}>
                          <Icon size={9} aria-hidden="true" />
                        </span>
                      </span>
                      <span className="crm-notification-copy">
                        <span className="crm-notification-message">
                          <b>{item.actor}</b> {item.message} <b>{event.title}</b>
                        </span>
                        <span className="crm-notification-time">
                          {item.time} <span aria-hidden="true">·</span> {event.kind}
                        </span>
                      </span>
                      {item.unread && (
                        <>
                          <span className="crm-notification-unread" aria-hidden="true" />
                          <span className="sr-only">Unread</span>
                        </>
                      )}
                    </CRMButton>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        ) : (
          <div className="crm-notification-empty">
            <span className="crm-notification-empty-icon">
              <Bell size={16} aria-hidden="true" />
            </span>
            <b>You’re all caught up</b>
            <span>New sign-ups, check-ins, and volunteer hours will show up here.</span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
