/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          canvas: '#F5F3EB',
          subtle: '#EDEAE0',
          card: '#FAF9F5',
          white: '#FFFFFF',
        },
        forest: {
          950: '#0B2520',
          900: '#103D35',
          800: '#124B40',
          700: '#185D50',
          600: '#237B6B',
          200: '#C7DFD9',
          100: '#E4EFEA',
          50: '#F2F8F5',
        },
        copper: {
          700: '#8E4426',
          600: '#9F5131',
          500: '#B65F3D',
          400: '#C97755',
          300: '#D5B49A',
          200: '#E8D4C5',
          100: '#F5ECE4',
          50: '#FAF5F0',
        },
        ink: {
          950: '#0A1716',
          900: '#102322',
          800: '#1C3130',
          700: '#324543',
          500: '#53605B',
          400: '#7B8984',
          300: '#A4B0AC',
        },
        rule: {
          DEFAULT: '#D5D0C3',
          subtle: '#C9C9BC',
          light: '#E7E3D8',
        },
        // Backwards compatibility aliases if needed by subpages
        cyber: {
          400: '#124B40',
        },
        obsidian: {
          950: '#F5F3EB',
          900: '#EDEAE0',
          850: '#FAF9F5',
        }
      },
      fontFamily: {
        serif: [
          '"Newsreader"',
          '"DM Serif Display"',
          'Georgia',
          'Cambria',
          'serif',
        ],
        display: [
          '"Newsreader"',
          '"DM Serif Display"',
          'Georgia',
          'serif',
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
          '"IBM Plex Mono"',
          '"JetBrains Mono"',
          'ui-monospace',
          'monospace',
        ],
      },
      boxShadow: {
        'fine': '0 1px 3px rgba(16, 35, 34, 0.05), 0 1px 2px rgba(16, 35, 34, 0.03)',
        'card': '0 2px 8px rgba(16, 35, 34, 0.04), 0 1px 3px rgba(16, 35, 34, 0.02)',
        'elevated': '0 10px 30px -5px rgba(16, 35, 34, 0.08), 0 4px 12px -2px rgba(16, 35, 34, 0.04)',
      },
    },
  },
  plugins: [],
};
