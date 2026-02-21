# ⏱ ChronoScope Date/Time Range Picker

**Hooks-first · Design-agnostic · Zero default styles**

A headless, fully customizable Grafana-style date-time range selector for React. Ships with **zero CSS** — bring your own styles, or use the included Tailwind CSS and Bootstrap 5 presets.

```
npm install chronoscope-react
```

---

## Philosophy

ChronoScope follows a strict separation of concerns:

| Layer | What it does | What it doesn't do |
|-------|-------------|-------------------|
| **Hooks** | All state, logic, actions | Zero UI, zero styling |
| **Components** | Semantic HTML + `data-cs-*` attributes | Zero inline styles, zero CSS |
| **Presets** | CSS class maps (Tailwind, Bootstrap) | Zero logic, zero HTML |

You choose how deep to go:

```
Level 1: useChronoScope()          ← Hook only, build everything yourself
Level 2: <ChronoScope />           ← Unstyled semantic HTML
Level 3: <ChronoScope classNames={tailwindDark} />  ← Styled via preset
```

---

## Quick Start

### With Tailwind CSS

```tsx
import { ChronoScope } from "chronoscope-react";
import { tailwindDark } from "chronoscope-react/presets/tailwind";

function Dashboard() {
  return (
    <ChronoScope
      classNames={tailwindDark}
      options={{
        defaultQuickLabel: "Last 1 hour",
        onChange: (range, meta) => {
          console.log(range.from, "→", range.to, meta.source);
        },
      }}
    />
  );
}
```

### With Bootstrap 5

```tsx
import { ChronoScope } from "chronoscope-react";
import { bootstrapDark } from "chronoscope-react/presets/bootstrap";

<ChronoScope classNames={bootstrapDark} options={{ onChange: handleChange }} />
```

### Unstyled (bring your own CSS)

```tsx
import { ChronoScope } from "chronoscope-react";

// Components render with data-cs="..." attributes you can target:
// [data-cs="trigger"] { ... }
// [data-cs="dropdown"] { ... }
// [data-cs="calendar-day"][data-selected] { ... }

<ChronoScope options={{ onChange: handleChange }} />
```

### Hook Only (fully headless)

```tsx
import { useChronoScope } from "chronoscope-react";

function MyPicker() {
  const cs = useChronoScope({
    onChange: (range) => fetchData(range),
  });

  return (
    <div ref={cs.containerRef}>
      <button onClick={cs.toggle}>{cs.displayLabel}</button>
      {cs.isOpen && (
        <ul>
          {cs.quickRanges.map(qr => (
            <li key={qr.label} onClick={() => cs.selectQuickRange(qr)}>
              {qr.label} {cs.quickLabel === qr.label && "✓"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Architecture

```
chronoscope-react/
│
├── hooks/                      ← Pure logic, zero UI
│   ├── useChronoScope          Core state machine + actions
│   ├── useCalendar             Calendar navigation + day grid
│   ├── useTimeInput            Time field editing (HH:mm:ss)
│   └── useClickOutside         Outside click detection
│
├── components/                 ← Semantic HTML, zero styles
│   ├── ChronoScope             Composed picker (uses classNames)
│   ├── CalendarPanel           Month calendar grid
│   ├── TimeInputPanel          Time fields
│   ├── QuickRangesPanel        Searchable quick range list
│   └── RelativeRangePanel      Relative time form
│
├── presets/                    ← Class maps only, zero logic
│   ├── tailwind/               tailwindDark, tailwindLight
│   ├── bootstrap/              bootstrapDark, bootstrapLight
│   └── unstyled/               Empty map (default)
│
└── utils/                      ← Shared utilities
    ├── date                    Date math + formatting
    └── classnames              mergeClassNames, resolveClassNames
```

---

## The ClassNames Contract

Every visual element in ChronoScope maps to a named slot in the `ChronoScopeClassNames` interface. Presets provide complete maps. You can override any slot.

```ts
interface ChronoScopeClassNames {
  root: string;
  trigger: string;
  triggerOpen: string;
  dropdown: string;
  tab: string;
  tabActive: string;
  calendarDay: string;
  calendarDaySelected: string;
  calendarDayToday: string;
  applyButton: string;
  liveButton: string;
  liveButtonActive: string;
  // ... 50+ slots total
}
```

### Merging & Overriding

```tsx
import { tailwindDark } from "chronoscope-react/presets/tailwind";
import { mergeClassNames } from "chronoscope-react";

// Append classes to specific slots
const myTheme = mergeClassNames(tailwindDark, {
  trigger: "my-custom-trigger",       // appended
  applyButton: "!btn btn-primary",    // "!" prefix = replace entirely
});

<ChronoScope classNames={myTheme} />
```

### Targeting with CSS (unstyled mode)

Every element has a `data-cs` attribute + state attributes:

```css
[data-cs="trigger"] { border: 1px solid #ccc; padding: 8px; }
[data-cs="trigger"][data-open] { border-color: blue; }
[data-cs="calendar-day"] { width: 32px; height: 32px; }
[data-cs="calendar-day"][data-selected] { background: blue; color: white; }
[data-cs="calendar-day"][data-today] { font-weight: bold; }
[data-cs="calendar-day"][data-disabled] { opacity: 0.3; }
[data-cs="quick-item"][data-active] { background: rgba(0,0,255,0.1); }
[data-cs="live"][data-active] { color: green; }
```

---

## Available Presets

| Import | Framework | Theme |
|--------|-----------|-------|
| `chronoscope-react/presets/tailwind` | Tailwind CSS 3+ | `tailwindDark`, `tailwindLight` |
| `chronoscope-react/presets/bootstrap` | Bootstrap 5.3+ | `bootstrapDark`, `bootstrapLight` |
| `chronoscope-react/presets/unstyled` | None | `unstyledPreset` (empty) |

---

## Hooks API

### `useChronoScope(options?)`

The core hook. Returns everything needed for a complete picker.

```ts
const cs = useChronoScope({
  defaultQuickLabel: "Last 6 hours",
  quickRanges: [...],          // Custom quick ranges
  onChange: (range, meta) => {},
  onLiveToggle: (isLive) => {},
  liveInterval: 5000,          // Auto-refresh ms
  minDate: new Date("2024-01-01"),
  maxDate: new Date(),
  clampToLimits: true,
  formatDate: (d) => d.toISOString(),
});

// State
cs.range           // { from: Date, to: Date }
cs.quickLabel       // "Last 6 hours" | null
cs.isOpen           // boolean
cs.mode             // "quick" | "absolute" | "relative"
cs.isLive           // boolean
cs.displayLabel     // Formatted string for trigger
cs.formattedFrom    // Full formatted "from" date
cs.formattedTo      // Full formatted "to" date

// Actions
cs.toggle()
cs.selectQuickRange(range)
cs.setFrom(date)
cs.setTo(date)
cs.applyAbsolute()
cs.applyRelative()
cs.shiftBack()
cs.shiftForward()
cs.zoomIn()
cs.zoomOut()
cs.toggleLive()
cs.setRange({ from, to }, "label")

// Ref (attach to container for outside-click)
cs.containerRef
```

### `useCalendar(options?)`

Standalone calendar logic.

```tsx
const cal = useCalendar({
  selected: myDate,
  onSelect: setMyDate,
  rangeStart: fromDate,
  rangeEnd: toDate,
  weekStartsOn: 1,   // Monday
});

cal.days         // CalendarDay[] — { date, isToday, isSelected, isInRange, isDisabled }
cal.monthName    // "February"
cal.viewYear     // 2026
cal.prevMonth()
cal.nextMonth()
cal.selectDay(15)
```

### `useTimeInput(options?)`

Standalone time field logic.

```tsx
const time = useTimeInput({
  value: myDate,
  onChange: setMyDate,
  hourFormat: 12,    // or 24
});

time.hours       // "02"
time.minutes     // "30"
time.seconds     // "00"
time.period      // "PM"
time.setHours("14")
time.incrementHours()
```

---

## Component Props

### `<ChronoScope />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `controller` | `UseChronoScopeReturn` | — | External hook (shared state) |
| `options` | `UseChronoScopeOptions` | `{}` | Hook config (ignored if controller set) |
| `classNames` | `Partial<ClassNames>` | empty | Styling classes |
| `className` | `string` | — | Root element class |
| `style` | `CSSProperties` | — | Root inline styles (escape hatch) |
| `showToolbar` | `boolean` | `true` | Show nav buttons |
| `showLiveToggle` | `boolean` | `true` | Show live toggle |
| `tabs` | `SelectionMode[]` | all 3 | Which tabs to show |
| `tabLabels` | `object` | — | Override tab text |
| `hourFormat` | `12 \| 24` | `24` | Time display format |
| `showSeconds` | `boolean` | `true` | Show seconds field |
| `weekStartsOn` | `number` | `0` | Week start (0=Sun) |
| `renderTrigger` | `(api, cn) => ReactNode` | — | Custom trigger |
| `renderQuickItem` | `(range, active, onSelect, cn) => ReactNode` | — | Custom quick item |
| `renderDay` | `(day, onSelect, cn) => ReactNode` | — | Custom calendar day |
| `renderToolbar` | `(api, cn) => ReactNode` | — | Custom toolbar |
| `renderLiveToggle` | `(api, cn) => ReactNode` | — | Custom live toggle |
| `children` | `(api, cn) => ReactNode` | — | Full headless render |

---

## Advanced Patterns

### Shared Controller

```tsx
const cs = useChronoScope({ onChange });

// Two pickers sharing state
<ChronoScope controller={cs} classNames={tailwindDark} />
<ChronoScope controller={cs} classNames={bootstrapLight} />

// Other components reading the range
<Chart from={cs.range.from} to={cs.range.to} />
```

### Render Prop (headless with classNames)

```tsx
<ChronoScope classNames={tailwindDark} options={opts}>
  {(api, cn) => (
    <div className={cn.root}>
      <button className={cn.trigger} onClick={api.toggle}>
        {api.displayLabel}
      </button>
      {/* Build completely custom dropdown UI */}
    </div>
  )}
</ChronoScope>
```

### Custom Preset

```tsx
const myPreset: ChronoScopeClassNames = {
  root: "picker-root",
  trigger: "picker-trigger",
  triggerOpen: "picker-trigger--open",
  dropdown: "picker-dropdown",
  // ... fill all 50+ slots
};

<ChronoScope classNames={myPreset} />
```

### Partial Override on a Preset

```tsx
import { tailwindDark } from "chronoscope-react/presets/tailwind";
import { mergeClassNames } from "chronoscope-react";

const custom = mergeClassNames(tailwindDark, {
  applyButton: "!bg-blue-600 text-white px-4 py-2 rounded font-bold",
  calendarDaySelected: "!bg-blue-500 text-white",
});
```

---

## Tree Shaking

Every export is independently importable:

```tsx
// Only hooks — no component code in your bundle
import { useChronoScope } from "chronoscope-react/hooks";

// Only the preset — no hooks or components
import { tailwindDark } from "chronoscope-react/presets/tailwind";

// Only utils
import { formatDateTime, applyRelativeTime } from "chronoscope-react/utils";
```

---

## Browser Support

React 16.8+ (hooks). All modern browsers.

## License

MIT © ChronoScope Contributors
