import { liveQuery } from "dexie";
import { useEffect, useState } from "react";

export function useLiveQuery<T>(
  query: () => Promise<T>,
  initialValue: T,
  deps: readonly unknown[] = []
): T {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const subscription = liveQuery(query).subscribe({
      next: setValue,
      error: (error) => {
        console.error("IndexedDB query failed", error);
      }
    });

    return () => subscription.unsubscribe();
  }, deps);

  return value;
}
