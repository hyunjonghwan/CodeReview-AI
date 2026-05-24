import type { Preview } from '@storybook/nextjs-vite';
import { ThemeProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';
import '../app/globals.css';

/**
 * Storybook preview — design token 통합 (Week 2.6)
 *
 * - app/globals.css를 직접 import해서 Tailwind v4 토큰 + .dark 셀렉터 활성화
 * - toolbar에서 light/dark 전환 → next-themes의 forcedTheme로 강제 적용
 * - 캔버스 배경/글자색은 시맨틱 토큰을 그대로 사용 (앱과 동일한 톤)
 */

const ThemeSync = ({ theme }: { theme: 'light' | 'dark' }) => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);
  return null;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: { test: 'todo' },
  },
  globalTypes: {
    theme: {
      description: 'Color scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as 'light' | 'dark';
      return (
        <ThemeProvider
          attribute="class"
          defaultTheme={theme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeSync theme={theme} />
          <div className="bg-bg-default text-fg-default min-h-screen p-6 font-sans">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
