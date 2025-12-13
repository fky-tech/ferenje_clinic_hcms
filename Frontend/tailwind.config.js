/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#E6F2FF',
                    100: '#CCE5FF',
                    200: '#99CCFF',
                    300: '#66B2FF',
                    400: '#3399FF',
                    500: '#0066CC',
                    600: '#0052A3',
                    700: '#003D7A',
                    800: '#002952',
                    900: '#001429',
                },
                medical: {
                    blue: '#0066CC',
                    teal: '#14B8A6',
                },
                border: '#e5e7eb', // gray-200 equivalent
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
