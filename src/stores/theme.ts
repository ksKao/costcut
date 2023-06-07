import { writable } from 'svelte/store';

const storageTheme = localStorage.getItem('theme');

const getDefaultTheme = () => {
	if (storageTheme === 'light') {
		return 'light';
	} else if (storageTheme === 'dark') {
		return 'dark';
	}

	const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	if (darkModeMediaQuery.matches) {
		return 'dark';
	} else {
		return 'light';
	}
};

export const theme = writable<'light' | 'dark'>(getDefaultTheme());

theme.subscribe((value) => {
	localStorage.setItem('theme', value);
	document.querySelector('html').setAttribute('data-theme', value);
})
