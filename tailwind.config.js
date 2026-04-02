/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        lab: {
          bg: '#0c0e12',
          surface: '#12161c',
          elevated: '#181d26',
          border: '#2a3240',
          muted: '#6b7280',
          accent: '#3d9a8c',
          'accent-dim': '#2d7a6f',
          highlight: '#e8ecf2',
        },
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
}
