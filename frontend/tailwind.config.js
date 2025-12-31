module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#FCF6BA',
          DEFAULT: '#D4AF37',
          dark: '#AA771C',
        },
        romantic: {
          pink: '#FF69B4',
          deep: '#800020',
          glass: 'rgba(255, 192, 203, 0.15)',
        }
      },
      animation: {
        'slow-spin': 'spin 10s linear infinite',
        'float': 'floating 3s ease-in-out infinite',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}