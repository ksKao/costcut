import { derived } from 'svelte/store';
import type { Category, Transaction } from '../lib/types';
import { user } from './auth';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ItemInsertedEvent extends Event {
	key?: string;
	value?: string;
}

interface TransactionStore {
	transactions: Transaction[];
	categories: Category[];
}

export const transactionStore = derived<typeof user, TransactionStore | null>(
	user,
	($user, set) => {
		let transactions: Transaction[] = [];
		let categories: Category[] = [];
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

				originalSetItem.apply(this, [...arguments] as [key: string, value: string]);
			};

			const localStorageSetHandler = (e: ItemInsertedEvent) => {
				if (e.key === 'transactions') transactions = JSON.parse(e.value ?? '[]');
				else if (e.key === 'categories') categories = JSON.parse(e.value ?? '[]');
				set({
					transactions,
					categories,
				});
			};

			document.addEventListener('localStorageChanged', localStorageSetHandler, false);

			transactions = JSON.parse(localStorage.getItem('transactions') ?? '[]');
			categories = JSON.parse(localStorage.getItem('categories') ?? '[]');
			set({
				transactions,
				categories,
			});

			return () =>
				document.removeEventListener('localStorageChanged', localStorageSetHandler, false);
		} else if ($user) {
			const transactionQuery = query(collection(db, `users/${$user.uid}/transactions`));
			const categoryQuery = query(collection(db, `users/${$user.uid}/categories`));
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
			const unsubscribeCategories = onSnapshot(categoryQuery, (querySnapshot) => {
				categories = querySnapshot.docs.map((doc) => {
					let category = doc.data() as Category;
					category.id = doc.id;
					return category;
				});
				set({
					transactions,
					categories,
				});
			});
			return () => {
				unsubscribeTransaction();
				unsubscribeCategories();
			};
		}
	},
	null
);
