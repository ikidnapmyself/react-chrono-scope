import { useState, useCallback, useEffect } from "react";
import type { UseRangeStateReturn, UseLiveRefreshOptions, UseLiveRefreshReturn } from "../types";
import { DEFAULT_LIVE_INTERVAL } from "../constants";

export function useLiveRefresh(
  rangeState: UseRangeStateReturn,
  options: UseLiveRefreshOptions = {},
): UseLiveRefreshReturn {
  const { interval = DEFAULT_LIVE_INTERVAL, onToggle, refreshFn } = options;
  const [isLive, setIsLiveState] = useState(false);

  const toggle = useCallback(() => {
    setIsLiveState(v => {
      const next = !v;
      onToggle?.(next);
      return next;
    });
  }, [onToggle]);

  const setLive = useCallback(
    (live: boolean) => {
      setIsLiveState(live);
      onToggle?.(live);
    },
    [onToggle],
  );

  useEffect(() => {
    if (!isLive || !refreshFn) return;
    const id = setInterval(() => {
      const { from, to } = refreshFn();
      rangeState.setRange({ from, to });
      rangeState.fireChange(from, to, { source: "live" });
    }, interval);
    return () => clearInterval(id);
  }, [isLive, interval, refreshFn, rangeState]);

  return { isLive, toggle, setLive };
}
