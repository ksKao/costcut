import { writable } from 'svelte/store';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

const createUserStore = () => {
	const { subscribe, set } = writable<User | null | undefined>(undefined);

	onAuthStateChanged(auth, (user) => {
		set(user);
	});

	return {
		subscribe,
		reload: () => {
			set(auth.currentUser);
		},
	};
};

export const user = createUserStore();
