"use client";

import type { ComponentProps } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group peer inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-icon outline-none select-none transition-[color] duration-150 ease-power3-out hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-primary data-[state=indeterminate]:text-primary",
        className,
      )}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="size-4 group-data-[state=checked]:hidden group-data-[state=indeterminate]:hidden"
      >
        <path
          d="M2 5.2C2 4.08 2 3.52 2.22 3.09a2.5 2.5 0 0 1 .87-.87C3.52 2 4.08 2 5.2 2h5.6c1.12 0 1.68 0 2.11.22.38.19.69.5.87.87.22.43.22.99.22 2.11v5.6c0 1.12 0 1.68-.22 2.11-.19.38-.5.69-.87.87-.43.22-.99.22-2.11.22H5.2c-1.12 0-1.68 0-2.11-.22a2.5 2.5 0 0 1-.87-.87C2 12.48 2 11.92 2 10.8V5.2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="hidden size-4 group-data-[state=checked]:block"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.89 1.33H4.11c-.36 0-.66 0-.91.02-.26.02-.53.07-.78.2a2.67 2.67 0 0 0-1.17 1.17c-.13.25-.18.52-.2.78-.02.25-.02.55-.02.91v7.78c0 .36 0 .66.02.91.02.26.07.53.2.78a2.67 2.67 0 0 0 1.17 1.17c.25.13.52.18.78.2.25.02.55.02.91.02h7.78c.36 0 .66 0 .91-.02.26-.02.53-.07.78-.2a2.67 2.67 0 0 0 1.17-1.17c.13-.25.18-.52.2-.78.02-.25.02-.55.02-.91V4.11c0-.36 0-.66-.02-.91a2.67 2.67 0 0 0-.2-.78 2.67 2.67 0 0 0-1.17-1.17c-.25-.13-.52-.18-.78-.2-.25-.02-.55-.02-.91-.02ZM11.47 6.47a.67.67 0 0 0-.94-.94L7 9.06 5.47 7.53a.67.67 0 1 0-.94.94l2 2a.67.67 0 0 0 .94 0l4-4Z"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="hidden size-4 group-data-[state=indeterminate]:block"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.89 1.33H4.11c-.36 0-.66 0-.91.02-.26.02-.53.07-.78.2a2.67 2.67 0 0 0-1.17 1.17c-.13.25-.18.52-.2.78-.02.25-.02.55-.02.91v7.78c0 .36 0 .66.02.91.02.26.07.53.2.78a2.67 2.67 0 0 0 1.17 1.17c.25.13.52.18.78.2.25.02.55.02.91.02h7.78c.36 0 .66 0 .91-.02.26-.02.53-.07.78-.2a2.67 2.67 0 0 0 1.17-1.17c.13-.25.18-.52.2-.78.02-.25.02-.55.02-.91V4.11c0-.36 0-.66-.02-.91a2.67 2.67 0 0 0-.2-.78 2.67 2.67 0 0 0-1.17-1.17c-.25-.13-.52-.18-.78-.2-.25-.02-.55-.02-.91-.02ZM5.33 7.33a.67.67 0 0 0 0 1.34h5.34a.67.67 0 0 0 0-1.34H5.33Z"
        />
      </svg>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
