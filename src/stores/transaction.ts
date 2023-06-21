import { derived } from 'svelte/store';
import type { Transaction } from '../lib/types';
import { user } from './auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ItemInsertedEvent extends Event {
	key?: string;
	value?: string;
}

export const transactions = derived<typeof user, Transaction[] | null>(
	user,
	($user, set) => {
		let transactions: Transaction[] = [];
		if ($user === undefined) {
			set(null);
		} else if ($user === null) {
			// listen to localstorage
			const originalSetItem = localStorage.setItem;

			localStorage.setItem = function (key, value) {
				const event: ItemInsertedEvent = new Event('itemInserted');

				event.value = value;
				event.key = key;

				document.dispatchEvent(event);

				originalSetItem.apply(this, [...arguments] as [key: string, value: any]);
			};

			const localStorageSetHandler = (e: ItemInsertedEvent) => {
				if (e.key === 'transactions') {
					transactions = JSON.parse(e.value as string);
					set(transactions);
				}
			};

			document.addEventListener('itemInserted', localStorageSetHandler, false);

			transactions = JSON.parse(localStorage.getItem('transactions') ?? '[]');
			set(transactions);

			return () => {
				document.removeEventListener('itemInserted', localStorageSetHandler, false);
			};
		} else if ($user) {
			const q = query(collection(db, `users/${$user.uid}/transactions`));
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				transactions = querySnapshot.docs.map((doc) => {
					let transaction = doc.data() as Transaction;
					transaction.id = doc.id;
					return transaction;
				});
				set(transactions);
			});
			return () => unsubscribe();
		}
	},
	null
);
