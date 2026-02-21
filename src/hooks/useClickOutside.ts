import { useRef, useEffect, type RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  enabled: boolean = true,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [callback, enabled]);

  return ref;
}
