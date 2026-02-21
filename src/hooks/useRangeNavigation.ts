import { useCallback } from "react";
import type { UseRangeStateReturn, UseRangeNavigationReturn } from "../types";

export function useRangeNavigation(rangeState: UseRangeStateReturn): UseRangeNavigationReturn {
  const shiftBack = useCallback(() => {
    const { from, to, clamp, fireChange } = rangeState;
    const offset = (to.getTime() - from.getTime()) / 2;
    const nf = clamp(new Date(from.getTime() - offset));
    const nt = clamp(new Date(to.getTime() - offset));
    rangeState.setRange({ from: nf, to: nt });
    fireChange(nf, nt, { source: "shift" });
  }, [rangeState]);

  const shiftForward = useCallback(() => {
    const { from, to, clamp, fireChange } = rangeState;
    const offset = (to.getTime() - from.getTime()) / 2;
    const nf = clamp(new Date(from.getTime() + offset));
    const nt = clamp(new Date(to.getTime() + offset));
    rangeState.setRange({ from: nf, to: nt });
    fireChange(nf, nt, { source: "shift" });
  }, [rangeState]);

  const zoomOut = useCallback(() => {
    const { from, to, clamp, fireChange } = rangeState;
    const diff = to.getTime() - from.getTime();
    const nf = clamp(new Date(from.getTime() - diff / 2));
    const nt = clamp(new Date(to.getTime() + diff / 2));
    rangeState.setRange({ from: nf, to: nt });
    fireChange(nf, nt, { source: "zoom" });
  }, [rangeState]);

  const zoomIn = useCallback(() => {
    const { from, to, clamp, fireChange } = rangeState;
    const diff = to.getTime() - from.getTime();
    const q = diff / 4;
    const nf = clamp(new Date(from.getTime() + q));
    const nt = clamp(new Date(to.getTime() - q));
    if (nt.getTime() <= nf.getTime()) return;
    rangeState.setRange({ from: nf, to: nt });
    fireChange(nf, nt, { source: "zoom" });
  }, [rangeState]);

  return { shiftBack, shiftForward, zoomIn, zoomOut };
}
