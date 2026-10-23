"use client";

import type { ComponentProps } from "react";
import { Tabs as Primitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: ComponentProps<typeof Primitive.List>) {
  return (
    <Primitive.List
      data-slot="tabs-list"
      className={cn("flex items-center gap-4", className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, children, ...props }: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group caption-style -mb-px grid cursor-pointer text-center border-b border-transparent py-4 text-subtle outline-none select-none transition-[color,border-color] duration-150 ease-power3-out hover:text-soft focus-visible:text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">
        {children}
      </span>
      <span className="col-start-1 row-start-1 group-data-[state=active]:font-medium">
        {children}
      </span>
    </Primitive.Trigger>
  );
}

function TabsContent({ className, ...props }: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
