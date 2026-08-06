"use client";

import { useEffect } from "react";

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sanity Studio Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="space-y-4 max-w-md text-center">
        <h2 className="text-2xl font-bold">Something went wrong in the Studio</h2>
        <p className="text-muted-foreground text-sm">
          {error.message || "An unexpected error occurred while loading Sanity Studio."}
        </p>
        <button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
