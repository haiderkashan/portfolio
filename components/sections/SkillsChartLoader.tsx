"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

interface Skill {
  name: string;
  category: string;
  proficiency: number;
  iconName?: string;
}

const SkillsChart = dynamic(() =>
  import("./SkillsChart").then((module) => ({ default: module.SkillsChart }))
);

export function SkillsChartLoader({ skills }: { skills: Skill[] }) {
  const [isMounted, setIsMounted] = useState(false);

  // 1. Wait until the browser is ready
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. While waiting (or on server), show the Skeleton
  if (!isMounted) {
    return <SkillsChartSkeleton />;
  }

  // 3. Once ready, load the chart
  return (
    <Suspense fallback={<SkillsChartSkeleton />}>
      <SkillsChart skills={skills} />
    </Suspense>
  );
}

function SkillsChartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-[300px] rounded-xl border bg-muted/10 animate-pulse" />
      <div className="h-[300px] rounded-xl border bg-muted/10 animate-pulse" />
    </div>
  );
}