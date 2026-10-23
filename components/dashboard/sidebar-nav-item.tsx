import type { LucideIcon } from "lucide-react";
import CRMButton from "./crm-button";
import CountBadge from "./count-badge";
import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  icon?: LucideIcon;
  label: string;
  count?: number | string;
  active?: boolean;
  tone?: "default" | "quiet";
  onClick?: () => void;
};

function GroupDot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className={className}>
      <circle cx="7" cy="7" r="3" fill="currentColor" />
    </svg>
  );
}

export default function SidebarNavItem({
  icon: Icon,
  label,
  count,
  active = false,
  tone = "default",
  onClick,
}: SidebarNavItemProps) {
  return (
    <li className={cn(active && "mb-0.75")}>
      <CRMButton
        type="button"
        variant="nav"
        size="md"
        data-active={active}
        aria-current={active ? "page" : undefined}
        className={cn(
          "crm-side-link group h-[30px] gap-1.5 py-0 data-[active=true]:h-8",
          tone === "quiet" && "text-subtle",
        )}
        onClick={onClick}
      >
        {Icon ? (
          <Icon
            aria-hidden
            className="text-subtle ease-power3-out group-hover:text-icon group-data-[active=true]:text-icon size-3.5 shrink-0 transition-colors duration-150"
          />
        ) : (
          <GroupDot className="crm-group-dot text-subtle ease-power3-out group-hover:text-icon group-data-[active=true]:text-icon size-3.5 shrink-0 transition-colors duration-150" />
        )}
        <span className="min-w-0 flex-1 truncate text-left">{label}</span>
        {count !== undefined && <CountBadge>{count}</CountBadge>}
      </CRMButton>
    </li>
  );
}
