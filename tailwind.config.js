/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        vazirmatn: ['Vazirmatn', 'sans-serif'],
        arabic: ['Tajawal', 'Vazirmatn', 'sans-serif'],
      },
      colors: {
        // Brand Colors (consolidated and semantic)
        brand: {
          primary: '#26a306',           // was primary-color, green-2
          'primary-hover': '#2fb30c',   // was btn-hover  
          'primary-dark': '#186a02',    // was green-1
          success: '#58cc02',           // was btn
          'success-disabled': '#58cc10', // was disabeld-btn
          accent: '#13c867',            // was news-border
          whatsapp: '#077038',          // was whtssap-label
        },
        
        // Layout
        layout: {
          main: '#f8f8f8',              // was main
        },
        
        // Keep all existing shadcn/ui tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(272deg, .var(--tw-gradient-stops))',
        'gradient-footer': 'linear-gradient(350deg, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'option' : '0 8px 17px #0000000f',
        'btne' : '0 4px #4dac05'
      },
      keyframes: {
        spinner: {
          '100%': { transform: 'rotate(1turn)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        'spin': 'spinner 1s infinite linear',
        'spin-slow': 'spinner 2s infinite linear',
        'spin-slowest': 'spinner 3s infinite linear',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}