/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	themes: ['light', 'dark'],
	plugins: [require('daisyui')],
};

module.exports = config;
