/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-deep':    '#030509',
        'space-midnight':'#060912',
        'space-surface': 'rgba(14, 20, 32, 0.65)',
        'space-elevated':'rgba(20, 28, 45, 0.75)',
        'lunar-blue':    '#709be0',
        'lunar-glow':    'rgba(112, 155, 224, 0.22)',
        'lunar-ice':     '#d8e5ff',
        'tier-bronze':   '#cf9b72',
        'tier-silver':   '#c8d0db',
        'tier-gold':     '#f0dfa8',
      },
      fontFamily: {
        // Bebas Neue — countdown digits, rank labels, oversized display numbers
        bebas:   ['"Bebas Neue"', 'Impact', 'sans-serif'],
        // Syne — cinematic main headings, story beats, dramatic statements
        display: ['Syne', 'sans-serif'],
        // Space Grotesk — supporting text, descriptions, UI labels
        heading: ['"Space Grotesk"', 'sans-serif'],
        // Fallback body
        body:    ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"Space Grotesk"', 'monospace'],
      },
    },
  },
  plugins: [],
}
