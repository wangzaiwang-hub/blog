/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAF8F1',
          100: '#F5F0E5',
          200: '#EBE0C9',
          300: '#DACBA6',
          400: '#C9B48C',
          500: '#B89F73',
          600: '#A78E5E',
          700: '#8B744B',
          800: '#6F5D3E',
          900: '#504430',
        },
        terracotta: {
          50: '#FBF0EE',
          100: '#F7E0DC',
          200: '#EFC1B9',
          300: '#E69D90',
          400: '#DC7867',
          500: '#D15A46',
          600: '#BF4935',
          700: '#A03C2D',
          800: '#803027',
          900: '#602720',
        },
        desert: {
          50: '#F9F5EB',
          100: '#F2EAD7',
          200: '#E5D5AF',
          300: '#D8C087',
          400: '#CBAA5F',
          500: '#BE9537',
          600: '#A37C2C',
          700: '#856523',
          800: '#68501C',
          900: '#4B3A15',
        },
        typora: {
          title: '#A03C2D', // terracotta-700 (was purple),
          text: '#444444',
          'light-text': '#666666',
          'lighter-text': '#888888',
          link: '#2aa899',
          code: '#504430',  // desert-900 (was purple),
          shadow: '#eee',
          border: '#e7e7e7',
          'link-bottom': '#bbb',
          'inline-code-bg': '#f4f2f9',
        }
      },
      fontFamily: {
        'title': ['"ZCOOL KuaiLe"', 'sans-serif'],
        'content': ['"Ma Shan Zheng"', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'article': ['"EB Garamond"', '"Source Sans Pro"', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      typography: ({ theme }) => ({
        sand: {
          css: {
            '--tw-prose-body': theme('colors.typora.text'),
            '--tw-prose-font-family': theme('fontFamily.article').join(', '),
            '--tw-prose-headings': theme('colors.terracotta.700'),
            '--tw-prose-links': theme('colors.typora.link'),
            // 直接为h1-h4标题设置字体
            h1: { fontFamily: theme('fontFamily.title').join(', ') },
            h2: { fontFamily: theme('fontFamily.title').join(', ') },
            h3: { fontFamily: theme('fontFamily.title').join(', ') },
            h4: { fontFamily: theme('fontFamily.title').join(', ') },
            '--tw-prose-bold': theme('colors.terracotta.700'),
            '--tw-prose-code': theme('colors.desert.900'),
            '--tw-prose-quotes': theme('colors.typora.light-text'),
            '--tw-prose-quote-borders': theme('colors.typora.border'),
            
            // Invert theme adjustments
            '--tw-prose-invert-body': theme('colors.sand.200'), // Lighter for dark mode body
            '--tw-prose-invert-headings': theme('colors.terracotta.400'), // Lighter terracotta for dark headings
            '--tw-prose-invert-links': theme('colors.terracotta.400'),
            '--tw-prose-invert-bold': theme('colors.terracotta.400'),
            '--tw-prose-invert-code': theme('colors.sand.300'), // Lighter code for dark mode
            '--tw-prose-invert-quotes': theme('colors.sand.300'),
            '--tw-prose-invert-quote-borders': theme('colors.desert.700'),
            // Font families remain the same for dark mode unless specified otherwise
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};