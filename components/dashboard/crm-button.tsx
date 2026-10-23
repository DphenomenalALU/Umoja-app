import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const crmButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium leading-none outline-none select-none transition-[background-color,color,box-shadow] duration-150 ease-power3-out focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_3px_6px_rgba(53,36,50,0.18),0_0_0_1px_var(--forest-dark),inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_0_0_1px_var(--line),inset_0_1px_0_rgba(255,255,255,0.75)] hover:bg-accent",
        muted:
          "bg-muted text-foreground shadow-[0_0_0_1px_var(--line),inset_0_1px_0_rgba(255,255,255,0.75)] hover:bg-accent",
        subtle: "bg-background text-foreground shadow-[0_0_0_1px_var(--line)] hover:bg-muted",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        nav: "w-full justify-start rounded-lg text-sidebar-foreground hover:text-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:shadow-[0_0_0_1px_var(--line),inset_0_1px_0_rgba(255,255,255,0.75)]",
        item: "w-full items-start justify-start gap-3 rounded-lg text-left font-normal whitespace-normal text-foreground hover:bg-accent",
        link: "rounded-none text-foreground underline decoration-from-font underline-offset-2 hover:text-soft",
      },
      size: {
        sm: "p-[9px] text-[12px] leading-none",
        md: "p-2 text-[14px] leading-none",
        icon: "size-[30px] p-0",
        "icon-sm": "size-6 p-0",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "sm",
    },
  },
);

type CRMButtonProps = VariantProps<typeof crmButtonVariants> &
  ComponentProps<"button"> & { href?: ComponentProps<typeof Link>["href"] };

export default function CRMButton({
  variant,
  size,
  className,
  href,
  children,
  type = "button",
  ...props
}: CRMButtonProps) {
  const classes = cn(crmButtonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link
        href={href}
        data-slot="button"
        data-variant={variant ?? "secondary"}
        className={classes}
        {...(props as Omit<ComponentProps<typeof Link>, "href" | "className">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      data-slot="button"
      data-variant={variant ?? "secondary"}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
