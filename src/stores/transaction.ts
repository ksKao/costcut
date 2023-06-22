import { derived } from 'svelte/store';
import type { Transaction } from '../lib/types';
import { user } from './auth';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ItemInsertedEvent extends Event {
	key?: string;
	value?: string;
}

interface TransactionStore {
	transactions: Transaction[];
	categories: string[];
}

export const transactionStore = derived<typeof user, TransactionStore | null>(
	user,
	($user, set) => {
		let transactions: Transaction[] = [];
		let categories: string[] = [];
		if ($user === undefined) {
			set(null);
		} else if ($user === null) {
			// listen to localstorage
			const originalSetItem = localStorage.setItem;

			localStorage.setItem = function (key, value) {
				const event: ItemInsertedEvent = new Event('localStorageChanged');

				event.value = value;
				event.key = key;

				document.dispatchEvent(event);

				originalSetItem.apply(this, [...arguments] as [key: string, value: any]);
			};

			const localStorageSetHandler = (e: ItemInsertedEvent) => {
				if (e.key === 'transactions' || e.key === 'categories') {
					transactions = JSON.parse(localStorage.getItem('transactions') ?? '[]');
					categories = JSON.parse(localStorage.getItem('categories') ?? '[]');
					set({
						transactions,
						categories,
					});
				}
			};

			document.addEventListener('localStorageChanged', localStorageSetHandler, false);

			transactions = JSON.parse(localStorage.getItem('transactions') ?? '[]');
			set({
				transactions,
				categories,
			});

			return () =>
				document.removeEventListener('localStorageChanged', localStorageSetHandler, false);
		} else if ($user) {
			const transactionQuery = query(collection(db, `users/${$user.uid}/transactions`));
			const unsubscribeTransaction = onSnapshot(transactionQuery, (querySnapshot) => {
				transactions = querySnapshot.docs.map((doc) => {
					let transaction = doc.data() as Transaction;
					transaction.id = doc.id;
					return transaction;
				});
				set({
					transactions,
					categories,
				});
			});
			const unsubscribeCategories = onSnapshot(
				doc(db, `users/${$user.uid}`),
				(querySnapshot) => {
					categories = querySnapshot.data()?.categories ?? [];
					set({
						transactions,
						categories,
					});
				}
			);
			return () => {
				unsubscribeTransaction();
				unsubscribeCategories();
			};
		}
	},
	null
);
