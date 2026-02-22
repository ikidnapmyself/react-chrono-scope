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
  decorators: [
    (Story) => {
      const theme = THEME_MAP.tailwindDark;

      return (
        <ThemeContext.Provider value={theme}>
          <div
            style={{
              minHeight: "100%",
              padding: 24,
              background: theme.bg,
              color: theme.text,
              fontFamily: theme.font,
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
