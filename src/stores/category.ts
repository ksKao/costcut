import { derived } from 'svelte/store';
import { user } from './auth';
import type { Category, ItemInsertedEvent } from '../lib/types';
import { query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const categories = derived<typeof user, Category[] | null>(
	user,
	($user, set) => {
		if ($user === undefined) {
			set(null);
		} else if ($user === null) {
			const localStorageSetHandler = (e: ItemInsertedEvent) => {
				if (e.key === 'categories') set(JSON.parse(e.value ?? '[]'));
			};

			set(JSON.parse(localStorage.getItem('categories') ?? '[]'));

			document.addEventListener('localStorageChanged', localStorageSetHandler, false);

			return () => {
				document.removeEventListener('localStorageChanged', localStorageSetHandler, false);
				set(null);
			};
		} else if ($user) {
			const q = query(collection(db, `users/${$user.uid}/categories`));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const categories: Category[] = snapshot.docs.map((doc) => {
					return {
						id: doc.id,
						name: doc.data().name,
					};
				});
				set(categories);
			});

			return () => {
				unsubscribe();
				set(null);
			};
		}
	},
	null
);
