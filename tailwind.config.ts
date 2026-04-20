import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#f5f0e8',
          100: '#e8ddc8',
          200: '#c9b99a',
          300: '#a08060',
          400: '#6b5040',
          500: '#3d2b1f',
          800: '#241510',
          900: '#1a0f09',  // slightly brighter than original #0f0a07
        },
        paper: {
          DEFAULT: '#f2e4c0',  // 米白色宣纸
          light:   '#f8f0da',
          warm:    '#e8d4a8',
        },
        cinnabar: {
          DEFAULT: '#c0392b',
          light:   '#e74c3c',
          dark:    '#922b21',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light:   '#f0c040',
          dark:    '#8b6914',
        },
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'STSong', 'SimSun', 'serif'],
        sans:  ['Noto Sans SC', 'PingFang SC', 'sans-serif'],
      },
      keyframes: {
        'ink-spread': {
          '0%':   { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'ink-spread':  'ink-spread 1.8s ease-out infinite',
        'fade-in-up':  'fade-in-up 0.6s ease-out forwards',
        'fade-in':     'fade-in 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
