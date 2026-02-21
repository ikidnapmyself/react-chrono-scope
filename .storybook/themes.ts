import { createContext, useContext } from "react";
import { tailwindDark, tailwindLight } from "../src/presets/tailwind/index";
import { bootstrapDark, bootstrapLight } from "../src/presets/bootstrap/index";
import { unstyledPreset } from "../src/presets/unstyled/index";
import type { ChronoScopeClassNames } from "../src/types";

export interface ThemeMeta {
  label: string;
  classNames: ChronoScopeClassNames;
  bg: string;
  text: string;
  surface: string;
  border: string;
  accent: string;
  textDim: string;
  textMuted: string;
  font: string;
  radius: number;
  shadow: string;
}

export const ThemeContext = createContext<ThemeMeta>(null!);
export const useTheme = () => useContext(ThemeContext);

export const THEME_MAP: Record<string, ThemeMeta> = {
  tailwindDark: {
    label: "Tailwind Dark",
    classNames: tailwindDark,
    bg: "#0f172a", surface: "#1e293b", border: "#334155", accent: "#2dd4bf",
    text: "#e2e8f0", textDim: "#94a3b8", textMuted: "#64748b",
    font: "'JetBrains Mono',ui-monospace,monospace", radius: 8, shadow: "rgba(0,0,0,0.5)",
  },
  tailwindLight: {
    label: "Tailwind Light",
    classNames: tailwindLight,
    bg: "#f8fafc", surface: "#ffffff", border: "#cbd5e1", accent: "#0d9488",
    text: "#1e293b", textDim: "#64748b", textMuted: "#94a3b8",
    font: "'JetBrains Mono',ui-monospace,monospace", radius: 8, shadow: "rgba(0,0,0,0.1)",
  },
  bootstrapDark: {
    label: "Bootstrap Dark",
    classNames: bootstrapDark,
    bg: "#212529", surface: "#2b3035", border: "#495057", accent: "#0dcaf0",
    text: "#f8f9fa", textDim: "#adb5bd", textMuted: "#6c757d",
    font: "'SFMono-Regular',Menlo,monospace", radius: 6, shadow: "rgba(0,0,0,0.5)",
  },
  bootstrapLight: {
    label: "Bootstrap Light",
    classNames: bootstrapLight,
    bg: "#ffffff", surface: "#ffffff", border: "#dee2e6", accent: "#0d6efd",
    text: "#212529", textDim: "#6c757d", textMuted: "#adb5bd",
    font: "'SFMono-Regular',Menlo,monospace", radius: 6, shadow: "rgba(0,0,0,0.1)",
  },
  unstyled: {
    label: "Unstyled",
    classNames: unstyledPreset,
    bg: "#1a1a1a", surface: "#262626", border: "#404040", accent: "#e5e5e5",
    text: "#e5e5e5", textDim: "#a3a3a3", textMuted: "#737373",
    font: "monospace", radius: 4, shadow: "rgba(0,0,0,0.5)",
  },
};
