"use client";

import dynamic from "next/dynamic";
import { IconQuestionMark } from "@tabler/icons-react";

interface DynamicIconProps {
  iconName: string;
  className?: string;
}

export function DynamicIcon({
  iconName,
  className = "h-full w-full text-neutral-500 dark:text-neutral-300",
}: DynamicIconProps) {
  // Lazily load the icon module to prevent shipping all ~4700 icons in the initial bundle
  const Icon = dynamic(
    () =>
      import("@tabler/icons-react").then((mod) => {
        const Comp = mod[iconName as keyof typeof mod];
        return {
          default: (Comp as React.ComponentType<{ className?: string }>) || IconQuestionMark,
        };
      }),
    {
      ssr: false, // Prevents SSR hydration mismatch and huge server bundle parsing
    }
  );

  return <Icon className={className} />;
}
