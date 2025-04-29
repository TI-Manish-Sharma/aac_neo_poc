/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00A3B4',
                    light: '#1cbfcf',
                    dark: '#008a99',
                },
            },
        },
    },
    plugins: [],
}