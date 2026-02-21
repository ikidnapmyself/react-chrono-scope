import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════
//  ChronoScope v2 — Hook-first, Design-Agnostic Demo
//  Showcases: useChronoScope hook + preset switching
// ═══════════════════════════════════════════════════════════════════

const pad = (n) => String(n).padStart(2, "0");
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEK_DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const QUICK_RANGES = [
  { label: "Last 5 minutes", value: 5, unit: "m" },
  { label: "Last 15 minutes", value: 15, unit: "m" },
  { label: "Last 30 minutes", value: 30, unit: "m" },
  { label: "Last 1 hour", value: 1, unit: "h" },
  { label: "Last 3 hours", value: 3, unit: "h" },
  { label: "Last 6 hours", value: 6, unit: "h" },
  { label: "Last 12 hours", value: 12, unit: "h" },
  { label: "Last 24 hours", value: 24, unit: "h" },
  { label: "Last 2 days", value: 2, unit: "d" },
  { label: "Last 7 days", value: 7, unit: "d" },
  { label: "Last 30 days", value: 30, unit: "d" },
  { label: "Last 90 days", value: 90, unit: "d" },
  { label: "Last 6 months", value: 6, unit: "M" },
  { label: "Last 1 year", value: 1, unit: "y" },
  { label: "Last 2 years", value: 2, unit: "y" },
];
const TIME_UNITS = [
  { label: "Seconds", value: "s" }, { label: "Minutes", value: "m" },
  { label: "Hours", value: "h" }, { label: "Days", value: "d" },
  { label: "Weeks", value: "w" }, { label: "Months", value: "M" },
  { label: "Years", value: "y" },
];

function formatDT(d) {
  if (!d) return "";
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function formatShort(d) { return d ? `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${pad(d.getHours())}:${pad(d.getMinutes())}` : "..."; }
function applyRel(v, u) {
  const d = new Date(); const n = parseInt(v, 10); if (isNaN(n) || n <= 0) return d;
  switch (u) { case "s": d.setSeconds(d.getSeconds()-n); break; case "m": d.setMinutes(d.getMinutes()-n); break;
    case "h": d.setHours(d.getHours()-n); break; case "d": d.setDate(d.getDate()-n); break;
    case "w": d.setDate(d.getDate()-n*7); break; case "M": d.setMonth(d.getMonth()-n); break;
    case "y": d.setFullYear(d.getFullYear()-n); break; }
  return d;
}

// ─── useChronoScope Hook (pure logic, zero UI) ─────────────────
function useChronoScope(opts = {}) {
  const { defaultQuickLabel = "Last 6 hours", onChange, liveInterval = 5000 } = opts;
  const [from, setFrom] = useState(() => { const qr = QUICK_RANGES.find(r => r.label === defaultQuickLabel); return qr ? applyRel(qr.value, qr.unit) : (() => { const d = new Date(); d.setHours(d.getHours()-6); return d; })(); });
  const [to, setTo] = useState(() => new Date());
  const [quickLabel, setQL] = useState(defaultQuickLabel);
  const [isOpen, setOpen] = useState(false);
  const [mode, setMode] = useState("quick");
  const [isLive, setLive] = useState(false);
  const [relVal, setRelVal] = useState("5");
  const [relUnit, setRelUnit] = useState("m");
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      if (quickLabel) { const qr = QUICK_RANGES.find(r => r.label === quickLabel);
        if (qr) { const now = new Date(); const nf = applyRel(qr.value, qr.unit); setFrom(nf); setTo(now); onChange?.({ from: nf, to: now }, { source: "live", quickLabel }); }
      }
    }, liveInterval);
    return () => clearInterval(id);
  }, [isLive, quickLabel, liveInterval, onChange]);

  return {
    range: { from, to }, quickLabel, isOpen, mode, isLive, relVal, relUnit,
    displayLabel: quickLabel || `${formatShort(from)} → ${formatShort(to)}`,
    formattedFrom: formatDT(from), formattedTo: formatDT(to),
    toggle: () => setOpen(v => !v), setMode,
    selectQuickRange: (r) => { const now = new Date(); const nf = applyRel(r.value, r.unit); setFrom(nf); setTo(now); setQL(r.label); setOpen(false); onChange?.({ from: nf, to: now }, { source: "quick", quickLabel: r.label }); },
    setFrom, setTo,
    applyAbsolute: () => { setQL(null); setOpen(false); onChange?.({ from, to }, { source: "absolute" }); },
    setRelVal, setRelUnit,
    applyRelative: () => { const now = new Date(); const v = parseInt(relVal, 10); if (isNaN(v) || v <= 0) return;
      const nf = applyRel(v, relUnit); const label = `Last ${v} ${TIME_UNITS.find(u => u.value === relUnit)?.label.toLowerCase() || relUnit}`;
      setFrom(nf); setTo(now); setQL(label); setOpen(false); onChange?.({ from: nf, to: now }, { source: "relative", quickLabel: label }); },
    shiftBack: () => { const d = (to.getTime()-from.getTime())/2; setFrom(new Date(from.getTime()-d)); setTo(new Date(to.getTime()-d)); setQL(null); },
    shiftForward: () => { const d = (to.getTime()-from.getTime())/2; setFrom(new Date(from.getTime()+d)); setTo(new Date(to.getTime()+d)); setQL(null); },
    zoomOut: () => { const d = to.getTime()-from.getTime(); setFrom(new Date(from.getTime()-d/2)); setTo(new Date(to.getTime()+d/2)); setQL(null); },
    zoomIn: () => { const d = to.getTime()-from.getTime(); const q = d/4; const nf = new Date(from.getTime()+q); const nt = new Date(to.getTime()-q); if (nt <= nf) return; setFrom(nf); setTo(nt); setQL(null); },
    toggleLive: () => setLive(v => !v),
    containerRef: ref,
  };
}

// ─── useCalendar Hook ───────────────────────────────────────────
function useCalendar({ selected, onSelect, rangeStart, rangeEnd }) {
  const [vy, svy] = useState(() => (selected||new Date()).getFullYear());
  const [vm, svm] = useState(() => (selected||new Date()).getMonth());
  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => {
    const dim = new Date(vy, vm+1, 0).getDate();
    const fd = new Date(vy, vm, 1).getDay();
    const r = [];
    for (let i = 0; i < fd; i++) r.push({ date: 0, empty: true });
    for (let d = 1; d <= dim; d++) {
      const cell = new Date(vy, vm, d);
      const isToday = cell.toDateString() === today.toDateString();
      const isSel = selected && cell.toDateString() === selected.toDateString();
      let inRange = false;
      if (rangeStart && rangeEnd) { const c = new Date(cell); c.setHours(0,0,0,0); const s = new Date(rangeStart); s.setHours(0,0,0,0); const e = new Date(rangeEnd); e.setHours(0,0,0,0); inRange = c >= s && c <= e; }
      r.push({ date: d, isToday, isSelected: isSel, isInRange: inRange, empty: false });
    }
    return r;
  }, [vy, vm, selected, rangeStart, rangeEnd, today]);
  return {
    vy, vm, monthName: MONTHS[vm], days,
    prev: () => { if (vm === 0) { svm(11); svy(y => y-1); } else svm(m => m-1); },
    next: () => { if (vm === 11) { svm(0); svy(y => y+1); } else svm(m => m+1); },
    select: (day) => { const d = selected ? new Date(selected) : new Date(); d.setFullYear(vy, vm, day); onSelect(d); },
  };
}

// ─── Style Presets (classNames maps) ────────────────────────────
const cx = (...cls) => cls.filter(Boolean).join(" ");

// CSS-in-JS simulation for the demo (since we can't load Tailwind/Bootstrap)
// In real usage, these would be CSS class strings
const makeStyles = (preset) => {
  const t = presetThemes[preset];
  return {
    root: { display: "flex", alignItems: "center", gap: 8, fontFamily: t.font, fontSize: 13 },
    navGroup: { display: "flex", gap: 2 },
    navBtn: { display: "flex", alignItems: "center", justifyContent: "center", padding: "7px 10px", borderRadius: t.radius, border: `1px solid ${t.border}`, background: t.surface, color: t.textDim, cursor: "pointer", fontFamily: t.font, transition: "all 0.15s" },
    triggerWrap: { position: "relative", flex: 1, minWidth: 200 },
    trigger: (open) => ({ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: t.radius, border: `1px solid ${open ? t.accent : t.border}`, background: open ? `${t.accent}0F` : t.surface, color: t.text, cursor: "pointer", fontFamily: t.font, fontSize: 13, transition: "all 0.2s", boxShadow: open ? `0 0 0 1px ${t.accent}33` : "none" }),
    triggerLabel: { flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    liveBtn: (active) => ({ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: t.radius, border: `1px solid ${active ? t.success+"66" : t.border}`, background: active ? t.success+"1A" : t.surface, color: active ? t.success : t.textDim, fontSize: 11, fontWeight: 700, fontFamily: t.font, letterSpacing: "1px", cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase" }),
    liveDot: (active) => ({ width: 7, height: 7, borderRadius: "50%", background: active ? t.success : t.textMuted, boxShadow: active ? `0 0 8px ${t.success}99` : "none", transition: "all 0.2s" }),
    dropdown: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, minWidth: 520, background: t.dropBg, border: `1px solid ${t.border}`, borderRadius: t.radius + 4, boxShadow: `0 20px 60px ${t.shadow}`, zIndex: 999, overflow: "hidden" },
    tabBar: { display: "flex", borderBottom: `1px solid ${t.border}`, padding: "4px 4px 0" },
    tab: (active) => ({ flex: 1, padding: "10px 12px", background: active ? `${t.accent}0F` : "transparent", border: "none", borderBottom: `2px solid ${active ? t.accent : "transparent"}`, color: active ? t.accent : t.textDim, fontSize: 12, fontWeight: 600, fontFamily: t.font, cursor: "pointer", transition: "all 0.15s", borderRadius: `${t.radius}px ${t.radius}px 0 0` }),
    quickPanel: { padding: 12 },
    searchInput: { width: "100%", padding: "8px 12px", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: t.radius, color: t.text, fontSize: 12, fontFamily: t.font, outline: "none", marginBottom: 8, boxSizing: "border-box" },
    quickItem: (active) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: active ? t.accentDim : "transparent", border: "none", borderRadius: t.radius - 2, color: active ? t.accent : t.text, fontSize: 12, fontFamily: t.font, cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.1s" }),
    dot: { width: 6, height: 6, borderRadius: "50%", background: t.accent },
    calLabel: { fontSize: 10, color: t.textMuted, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 },
    calHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
    calNav: { background: "none", border: "none", color: t.textDim, cursor: "pointer", padding: 4, display: "flex", fontFamily: t.font, fontSize: 16 },
    calTitle: { fontSize: 12, fontWeight: 600, color: t.text },
    weekDay: { textAlign: "center", fontSize: 10, color: t.textMuted, padding: "4px 0", fontWeight: 600 },
    calDay: (day) => ({ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", background: day.isSelected ? t.accent : day.isInRange ? `${t.accent}14` : "transparent", border: day.isToday && !day.isSelected ? `1px solid ${t.accent}` : "none", borderRadius: t.radius - 2, color: day.isSelected ? t.bg : day.isToday ? t.accent : t.text, fontSize: 11, fontFamily: t.font, fontWeight: day.isSelected || day.isToday ? 700 : 400, cursor: "pointer", transition: "all 0.1s" }),
    timeFld: { width: 28, background: "transparent", border: "none", color: t.text, fontSize: 13, fontFamily: t.font, textAlign: "center", outline: "none", padding: "2px 0" },
    timeWrap: { display: "flex", alignItems: "center", gap: 2, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: t.radius - 2, padding: "4px 8px" },
    timeLbl: { fontSize: 10, color: t.textMuted, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", minWidth: 36 },
    applyBtn: { padding: "8px 20px", background: t.accent, border: "none", borderRadius: t.radius, color: t.bg, fontSize: 12, fontWeight: 700, fontFamily: t.font, cursor: "pointer", whiteSpace: "nowrap" },
    rangeCode: { background: `${t.text}0A`, padding: "3px 6px", borderRadius: 4, fontSize: 10, color: t.text },
    relInput: { width: 70, padding: "8px 12px", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: t.radius, color: t.text, fontSize: 13, fontFamily: t.font, outline: "none" },
    relSelect: { padding: "8px 12px", background: t.dropBg, border: `1px solid ${t.border}`, borderRadius: t.radius, color: t.text, fontSize: 13, fontFamily: t.font, outline: "none", cursor: "pointer" },
    preview: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 14px", background: t.accentDim, border: `1px solid ${t.accent}26`, borderRadius: t.radius },
    t,
  };
};

const presetThemes = {
  tailwindDark: {
    bg: "#0f172a", surface: "#1e293b", dropBg: "#0f172a", inputBg: "#1e293b",
    border: "#334155", accent: "#2dd4bf", accentDim: "rgba(45,212,191,0.1)",
    text: "#e2e8f0", textDim: "#94a3b8", textMuted: "#64748b",
    success: "#22c55e", shadow: "rgba(0,0,0,0.5)",
    font: "'JetBrains Mono',ui-monospace,monospace", radius: 8,
    label: "Tailwind Dark", badge: "bg-teal-500/15 text-teal-400",
  },
  tailwindLight: {
    bg: "#f8fafc", surface: "#ffffff", dropBg: "#ffffff", inputBg: "#f1f5f9",
    border: "#cbd5e1", accent: "#0d9488", accentDim: "rgba(13,148,136,0.08)",
    text: "#1e293b", textDim: "#64748b", textMuted: "#94a3b8",
    success: "#16a34a", shadow: "rgba(0,0,0,0.1)",
    font: "'JetBrains Mono',ui-monospace,monospace", radius: 8,
    label: "Tailwind Light", badge: "bg-teal-100 text-teal-700",
  },
  bootstrapDark: {
    bg: "#212529", surface: "#2b3035", dropBg: "#212529", inputBg: "#2b3035",
    border: "#495057", accent: "#0dcaf0", accentDim: "rgba(13,202,240,0.1)",
    text: "#f8f9fa", textDim: "#adb5bd", textMuted: "#6c757d",
    success: "#198754", shadow: "rgba(0,0,0,0.5)",
    font: "'SFMono-Regular',Menlo,monospace", radius: 6,
    label: "Bootstrap Dark", badge: "bg-info bg-opacity-10 text-info",
  },
  bootstrapLight: {
    bg: "#ffffff", surface: "#ffffff", dropBg: "#ffffff", inputBg: "#f8f9fa",
    border: "#dee2e6", accent: "#0d6efd", accentDim: "rgba(13,110,253,0.08)",
    text: "#212529", textDim: "#6c757d", textMuted: "#adb5bd",
    success: "#198754", shadow: "rgba(0,0,0,0.1)",
    font: "'SFMono-Regular',Menlo,monospace", radius: 6,
    label: "Bootstrap Light", badge: "bg-primary bg-opacity-10 text-primary",
  },
  unstyled: {
    bg: "#1a1a1a", surface: "#262626", dropBg: "#1a1a1a", inputBg: "#262626",
    border: "#404040", accent: "#e5e5e5", accentDim: "rgba(229,229,229,0.08)",
    text: "#e5e5e5", textDim: "#a3a3a3", textMuted: "#737373",
    success: "#86efac", shadow: "rgba(0,0,0,0.5)",
    font: "monospace", radius: 4,
    label: "Unstyled", badge: "bg-neutral text-neutral",
  },
};

// ─── Calendar Panel ─────────────────────────────────────────────
function CalPanel({ selected, onSelect, rangeStart, rangeEnd, label, s }) {
  const cal = useCalendar({ selected, onSelect, rangeStart, rangeEnd });
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={s.calLabel}>{label}</div>
      <div style={s.calHeader}>
        <button onClick={cal.prev} style={s.calNav}>‹</button>
        <span style={s.calTitle}>{cal.monthName} {cal.vy}</span>
        <button onClick={cal.next} style={s.calNav}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {WEEK_DAYS.map(d => <div key={d} style={s.weekDay}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cal.days.map((day, i) => {
          if (day.empty) return <div key={`e${i}`} style={{ aspectRatio: "1" }} />;
          return <button key={day.date} onClick={() => cal.select(day.date)} style={s.calDay(day)}>{day.date}</button>;
        })}
      </div>
    </div>
  );
}

// ─── Time Fields ────────────────────────────────────────────────
function TimeFlds({ value, onChange, label, s }) {
  const d = value || new Date();
  const setH = (v) => { const n = parseInt(v,10); if (!isNaN(n) && n >= 0 && n < 24) { const dd = new Date(d); dd.setHours(n); onChange(dd); }};
  const setM = (v) => { const n = parseInt(v,10); if (!isNaN(n) && n >= 0 && n < 60) { const dd = new Date(d); dd.setMinutes(n); onChange(dd); }};
  const setS = (v) => { const n = parseInt(v,10); if (!isNaN(n) && n >= 0 && n < 60) { const dd = new Date(d); dd.setSeconds(n); onChange(dd); }};
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={s.timeLbl}>{label}</span>
      <div style={s.timeWrap}>
        <input style={s.timeFld} value={pad(d.getHours())} onChange={e => setH(e.target.value)} maxLength={2} />
        <span style={{ color: s.t.textMuted }}>:</span>
        <input style={s.timeFld} value={pad(d.getMinutes())} onChange={e => setM(e.target.value)} maxLength={2} />
        <span style={{ color: s.t.textMuted }}>:</span>
        <input style={s.timeFld} value={pad(d.getSeconds())} onChange={e => setS(e.target.value)} maxLength={2} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [preset, setPreset] = useState("tailwindDark");
  const s = makeStyles(preset);
  const t = s.t;
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");

  const cs = useChronoScope({
    defaultQuickLabel: "Last 6 hours",
    onChange: (range, meta) => {
      setEvents(prev => [...prev.slice(-14), { source: meta.source, label: meta.quickLabel, from: range.from, to: range.to, ts: Date.now() }]);
    },
  });

  const filtered = QUICK_RANGES.filter(r => r.label.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: t.font, position: "relative", transition: "all 0.3s" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none", backgroundImage: `radial-gradient(${t.border} 1px, transparent 1px)`, backgroundSize: "18px 18px" }} />

      <div style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 800, background: `linear-gradient(135deg, ${t.accent}, ${t.accent}88)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px" }}>ChronoScope</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: t.accentDim, color: t.accent, fontWeight: 700 }}>v2.0</span>
          </div>
          <p style={{ fontSize: 12, color: t.textDim, margin: 0 }}>Hook-first · Design-agnostic · Zero default styles</p>
        </div>

        {/* Preset Selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center", marginRight: 4 }}>Preset:</span>
          {Object.entries(presetThemes).map(([key, theme]) => (
            <button key={key} onClick={() => setPreset(key)} style={{
              padding: "5px 12px", borderRadius: 16, fontSize: 11, fontWeight: 600,
              fontFamily: t.font, cursor: "pointer", transition: "all 0.2s",
              background: preset === key ? t.accent : t.surface,
              color: preset === key ? t.bg : t.textDim,
              border: `1px solid ${preset === key ? t.accent : t.border}`,
            }}>{theme.label}</button>
          ))}
        </div>

        {/* Architecture diagram */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {[
            { label: "useChronoScope()", desc: "Logic" },
            { label: "→" },
            { label: "<ChronoScope />", desc: "HTML" },
            { label: "→" },
            { label: "classNames={preset}", desc: "Styles" },
          ].map((item, i) => (
            item.desc ? (
              <div key={i} style={{ padding: "6px 12px", borderRadius: 8, background: t.surface, border: `1px solid ${t.border}`, textAlign: "center" }}>
                <code style={{ fontSize: 10, color: t.accent, fontWeight: 700 }}>{item.label}</code>
                <div style={{ fontSize: 9, color: t.textMuted, marginTop: 2 }}>{item.desc}</div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", alignItems: "center", color: t.textMuted, fontSize: 14 }}>{item.label}</div>
            )
          ))}
        </div>

        {/* Demo Card */}
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius + 6, padding: 24, marginBottom: 20, boxShadow: `0 8px 32px ${t.shadow}` }}>
          <div style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>Live Demo — {t.label}</div>

          {/* Toolbar */}
          <div style={s.root}>
            <div style={s.navGroup}>
              <button onClick={cs.shiftBack} style={s.navBtn}>‹</button>
              <button onClick={cs.zoomOut} style={s.navBtn}>−</button>
              <button onClick={cs.zoomIn} style={s.navBtn}>+</button>
              <button onClick={cs.shiftForward} style={s.navBtn}>›</button>
            </div>

            <div ref={cs.containerRef} style={s.triggerWrap}>
              <button onClick={cs.toggle} style={s.trigger(cs.isOpen)}>
                <span style={{ color: t.textDim }}>⏱</span>
                <span style={s.triggerLabel}>{cs.displayLabel}</span>
                <span style={{ color: t.textMuted }}>▾</span>
              </button>

              {cs.isOpen && (
                <div style={s.dropdown}>
                  <div style={s.tabBar}>
                    {["quick","absolute","relative"].map(tab => (
                      <button key={tab} onClick={() => cs.setMode(tab)} style={s.tab(cs.mode === tab)}>
                        {tab === "quick" ? "⚡ Quick" : tab === "absolute" ? "📅 Absolute" : "🔄 Relative"}
                      </button>
                    ))}
                  </div>

                  <div style={{ maxHeight: 400, overflowY: "auto" }}>
                    {cs.mode === "quick" && (
                      <div style={s.quickPanel}>
                        <input type="text" placeholder="Search quick ranges..." value={filter} onChange={e => setFilter(e.target.value)} style={s.searchInput} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {filtered.map(r => (
                            <button key={r.label} onClick={() => { cs.selectQuickRange(r); setFilter(""); }} style={s.quickItem(cs.quickLabel === r.label)}>
                              {r.label}
                              {cs.quickLabel === r.label && <span style={s.dot} />}
                            </button>
                          ))}
                          {filtered.length === 0 && <div style={{ padding: 20, textAlign: "center", color: t.textMuted, fontSize: 12 }}>No matches</div>}
                        </div>
                      </div>
                    )}

                    {cs.mode === "absolute" && (
                      <div style={{ padding: 16 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 16 }}>
                          <CalPanel selected={cs.range.from} onSelect={cs.setFrom} rangeStart={cs.range.from} rangeEnd={cs.range.to} label="From" s={s} />
                          <div style={{ display: "flex", alignItems: "center", paddingTop: 80, color: t.textMuted }}>→</div>
                          <CalPanel selected={cs.range.to} onSelect={cs.setTo} rangeStart={cs.range.from} rangeEnd={cs.range.to} label="To" s={s} />
                        </div>
                        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                          <TimeFlds value={cs.range.from} onChange={cs.setFrom} label="From" s={s} />
                          <TimeFlds value={cs.range.to} onChange={cs.setTo} label="To" s={s} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.textDim, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600 }}>Range:</span>
                            <code style={s.rangeCode}>{cs.formattedFrom}</code>
                            <span style={{ color: t.textMuted }}>to</span>
                            <code style={s.rangeCode}>{cs.formattedTo}</code>
                          </div>
                          <button onClick={cs.applyAbsolute} style={s.applyBtn}>Apply time range</button>
                        </div>
                      </div>
                    )}

                    {cs.mode === "relative" && (
                      <div style={{ padding: 20 }}>
                        <div style={{ fontSize: 12, color: t.textDim, marginBottom: 20 }}>
                          Select a time range relative to <strong style={{ color: t.accent }}>now</strong>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                          <label style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>Last</label>
                          <input type="number" value={cs.relVal} onChange={e => cs.setRelVal(e.target.value)} min="1" style={s.relInput} />
                          <select value={cs.relUnit} onChange={e => cs.setRelUnit(e.target.value)} style={s.relSelect}>
                            {TIME_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                          </select>
                        </div>
                        <div style={s.preview}>
                          <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Preview:</span>
                          <code style={{ fontSize: 11, color: t.accent }}>{formatDT(applyRel(cs.relVal, cs.relUnit))} → now</code>
                        </div>
                        <button onClick={cs.applyRelative} style={s.applyBtn}>Apply</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={cs.toggleLive} style={s.liveBtn(cs.isLive)}>
              <span style={s.liveDot(cs.isLive)} />
              {cs.isLive ? "LIVE" : "Live"}
            </button>
          </div>

          {/* Range cards */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 20 }}>
            <div style={{ flex: 1, background: `${t.text}05`, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "10px 14px", maxWidth: 280 }}>
              <div style={{ fontSize: 9, color: t.textMuted, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 3 }}>FROM</div>
              <div style={{ fontSize: 12, color: t.accent, fontWeight: 500, fontFamily: t.font }}>{cs.formattedFrom}</div>
            </div>
            <div style={{ color: t.textMuted }}>→</div>
            <div style={{ flex: 1, background: `${t.text}05`, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: "10px 14px", maxWidth: 280 }}>
              <div style={{ fontSize: 9, color: t.textMuted, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 3 }}>TO</div>
              <div style={{ fontSize: 12, color: t.accent, fontWeight: 500, fontFamily: t.font }}>{cs.formattedTo}</div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 3, background: `${t.text}0A`, borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: "100%", background: `linear-gradient(90deg, transparent, ${t.accent}44, ${t.accent}, ${t.accent}44, transparent)`, borderRadius: 2 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {Array.from({ length: 7 }).map((_, i) => {
                const diff = cs.range.to.getTime() - cs.range.from.getTime();
                const tick = new Date(cs.range.from.getTime() + (diff / 6) * i);
                return <span key={i} style={{ fontSize: 9, color: t.textMuted }}>{pad(tick.getHours())}:{pad(tick.getMinutes())}</span>;
              })}
            </div>
          </div>

          {/* Event log */}
          <div style={{ marginTop: 16, background: `${t.text}04`, border: `1px solid ${t.border}`, borderRadius: t.radius, overflow: "hidden" }}>
            <div style={{ padding: "8px 12px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", color: t.textMuted, textTransform: "uppercase" }}>onChange Events</span>
              <span style={{ fontSize: 10, color: t.textMuted }}>{events.length}</span>
            </div>
            <div style={{ maxHeight: 100, overflowY: "auto", padding: 6 }}>
              {events.length === 0 && <div style={{ padding: 10, textAlign: "center", color: t.textMuted, fontSize: 11 }}>Select a range to see events</div>}
              {events.slice().reverse().map((ev, i) => (
                <div key={i} style={{ padding: "4px 6px", fontSize: 10, color: t.textDim, display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: t.accent, fontWeight: 700, minWidth: 48 }}>{ev.source}</span>
                  <code style={{ color: t.text, fontSize: 10 }}>{ev.label || `${formatShort(ev.from)} → ${formatShort(ev.to)}`}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hook architecture */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginBottom: 20 }}>
          {[
            { hook: "useChronoScope()", desc: "Core state machine — range, mode, live, shift, zoom", layer: "Hook" },
            { hook: "useCalendar()", desc: "Month nav, day grid, range highlighting", layer: "Hook" },
            { hook: "useTimeInput()", desc: "HH:mm:ss editing, 12/24h, increment/decrement", layer: "Hook" },
            { hook: "<ChronoScope />", desc: "Semantic HTML, data-cs attributes, zero inline styles", layer: "Component" },
            { hook: "tailwindDark", desc: "Complete Tailwind utility class map for every slot", layer: "Preset" },
            { hook: "bootstrapDark", desc: "Complete Bootstrap 5 class map for every slot", layer: "Preset" },
          ].map(h => (
            <div key={h.hook} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <code style={{ fontSize: 11, color: t.accent, fontWeight: 700 }}>{h.hook}</code>
                <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 8, background: t.accentDim, color: t.accent, fontWeight: 700, textTransform: "uppercase" }}>{h.layer}</span>
              </div>
              <p style={{ fontSize: 10, color: t.textDim, margin: 0, lineHeight: 1.4 }}>{h.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <code style={{ display: "inline-block", padding: "10px 20px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: t.radius, fontSize: 12, color: t.accent }}>
            npm install chronoscope-react
          </code>
        </div>
      </div>
    </div>
  );
}
