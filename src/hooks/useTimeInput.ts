import { useCallback, useMemo } from "react";
import type { UseTimeInputOptions, UseTimeInputReturn } from "../types";
import { pad } from "../utils/date";

export function useTimeInput(options: UseTimeInputOptions = {}): UseTimeInputReturn {
  const { value = null, onChange, hourFormat = 24, secondStep = 1 } = options;

  const getDate = useCallback((): Date => value ? new Date(value) : new Date(), [value]);

  const hours = useMemo(() => {
    const d = getDate();
    if (hourFormat === 12) { const h = d.getHours() % 12; return pad(h === 0 ? 12 : h); }
    return pad(d.getHours());
  }, [getDate, hourFormat]);

  const minutes = useMemo(() => pad(getDate().getMinutes()), [getDate]);
  const seconds = useMemo(() => pad(getDate().getSeconds()), [getDate]);
  const period = useMemo<"AM" | "PM">(() => getDate().getHours() < 12 ? "AM" : "PM", [getDate]);

  const emit = useCallback((d: Date) => { if (onChange) onChange(d); }, [onChange]);

  const setHours = useCallback((val: string) => {
    const n = parseInt(val, 10); if (isNaN(n)) return;
    const d = getDate();
    if (hourFormat === 24 && n >= 0 && n < 24) { d.setHours(n); emit(d); }
    else if (hourFormat === 12 && n >= 1 && n <= 12) {
      let h = n;
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      d.setHours(h); emit(d);
    }
  }, [getDate, hourFormat, period, emit]);

  const setMinutes = useCallback((val: string) => { const n = parseInt(val, 10); if (!isNaN(n) && n >= 0 && n < 60) { const d = getDate(); d.setMinutes(n); emit(d); }}, [getDate, emit]);
  const setSeconds = useCallback((val: string) => { const n = parseInt(val, 10); if (!isNaN(n) && n >= 0 && n < 60) { const d = getDate(); d.setSeconds(n); emit(d); }}, [getDate, emit]);

  const setPeriod = useCallback((p: "AM" | "PM") => {
    if (hourFormat !== 12) return;
    const d = getDate(); const h = d.getHours();
    if (p === "AM" && h >= 12) d.setHours(h - 12);
    if (p === "PM" && h < 12) d.setHours(h + 12);
    emit(d);
  }, [getDate, hourFormat, emit]);

  const incrementHours = useCallback(() => { const d = getDate(); d.setHours((d.getHours() + 1) % 24); emit(d); }, [getDate, emit]);
  const decrementHours = useCallback(() => { const d = getDate(); d.setHours((d.getHours() - 1 + 24) % 24); emit(d); }, [getDate, emit]);
  const incrementMinutes = useCallback(() => { const d = getDate(); d.setMinutes((d.getMinutes() + 1) % 60); emit(d); }, [getDate, emit]);
  const decrementMinutes = useCallback(() => { const d = getDate(); d.setMinutes((d.getMinutes() - 1 + 60) % 60); emit(d); }, [getDate, emit]);
  const incrementSeconds = useCallback(() => { const d = getDate(); d.setSeconds((d.getSeconds() + secondStep) % 60); emit(d); }, [getDate, secondStep, emit]);
  const decrementSeconds = useCallback(() => { const d = getDate(); d.setSeconds((d.getSeconds() - secondStep + 60) % 60); emit(d); }, [getDate, secondStep, emit]);

  return {
    hours, minutes, seconds, period,
    setHours, setMinutes, setSeconds, setPeriod,
    incrementHours, decrementHours, incrementMinutes, decrementMinutes,
    incrementSeconds, decrementSeconds,
  };
}
