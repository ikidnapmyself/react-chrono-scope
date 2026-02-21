import type { Preview } from "@storybook/react-vite";
import { THEME_MAP, ThemeContext } from "./themes";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      description: "CSS preset theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "tailwindDark", title: "Tailwind Dark" },
          { value: "tailwindLight", title: "Tailwind Light" },
          { value: "bootstrapDark", title: "Bootstrap Dark" },
          { value: "bootstrapLight", title: "Bootstrap Light" },
          { value: "unstyled", title: "Unstyled" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "tailwindDark",
  },
  decorators: [
    (Story, context) => {
      const themeKey = context.globals.theme || "tailwindDark";
      const theme = THEME_MAP[themeKey];

      return (
        <ThemeContext.Provider value={theme}>
          <div
            style={{
              minHeight: "100%",
              padding: 24,
              background: theme.bg,
              color: theme.text,
              fontFamily: theme.font,
              transition: "all 0.3s",
            }}
          >
            <Story />
          </div>
        </ThemeContext.Provider>
      );
    },
  ],
};

export default preview;
