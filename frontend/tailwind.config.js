/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    peach: '#FFD2C2',
                    teal: '#789A99',
                    dark: '#1A2C2C', // Deep teal-black for background contrast
                    light: '#F4F9F9', // Very light teal-white
                }
            },
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
