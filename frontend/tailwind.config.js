/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Obsidian Cipher Palette from Google Stitch
        obsidian: {
          950: '#06080d',
          900: '#0a0d14',
          850: '#0f1420',
          800: '#151b2b',
          750: '#1b2336',
          700: '#222c42',
          600: '#2d3b58',
          500: '#415275',
        },
        cyber: {
          50: '#edfdff',
          100: '#d5fbfe',
          200: '#b0f7fd',
          300: '#75f1fb',
          400: '#00f2fe', // Primary Brand Cyber Cyan
          500: '#00d6e2',
          600: '#00abb8',
          700: '#038792',
          800: '#0b6c75',
          900: '#0e5961',
        },
        indigo: {
          400: '#818cf8',
          500: '#6366f1', // Secondary Electric Indigo
          600: '#4f46e5',
        },
        mint: {
          400: '#34d399',
          500: '#00c9a7', // Cryptographic Valid Mint
          600: '#059669',
        },
      },
      fontFamily: {
        display: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'sans-serif',
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        'cyber-sm': '0 0 12px rgba(0, 242, 254, 0.25)',
        'cyber': '0 0 24px rgba(0, 242, 254, 0.35)',
        'cyber-lg': '0 0 45px rgba(0, 242, 254, 0.45)',
        'indigo-glow': '0 0 25px rgba(99, 102, 241, 0.3)',
        'mint-glow': '0 0 20px rgba(0, 201, 167, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.55)',
        'glass-card': '0 4px 24px -1px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'modal': '0 24px 60px -12px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 242, 254, 0.15)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
        'glass-radial': 'radial-gradient(circle at 50% 0%, rgba(0, 242, 254, 0.08) 0%, transparent 70%)',
        'mesh-glow': 'radial-gradient(at 0% 0%, rgba(0, 242, 254, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.15) 0px, transparent 50%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 242, 254, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
