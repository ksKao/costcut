import { derived } from 'svelte/store';
import { user } from './auth';
import { categories } from './category';
import type { ItemInsertedEvent, Transaction, TransactionWithCategoryId } from '../lib/types';
import { db } from '../lib/firebase';
import { query, collection, onSnapshot } from 'firebase/firestore';

export const transactions = derived<[typeof user, typeof categories], Transaction[] | null>(
	[user, categories],
	([$user, $categories], set) => {
		if ($user === undefined) {
			set(null);
		} else if ($user === null) {
			const localStorageSetHandler = (e: ItemInsertedEvent) => {
				if (e.key === 'transactions') {
					const localStorageTransactions: TransactionWithCategoryId[] = JSON.parse(
						e.value ?? '[]'
					);
					set(
						localStorageTransactions.map((t) => ({
							...t,
							category: $categories?.find((c) => c.id === t.categoryId) ?? undefined,
						}))
					);
				}
			};

			const localStorageTransactions: TransactionWithCategoryId[] = JSON.parse(
				localStorage.getItem('transactions') ?? '[]'
			);
			set(
				localStorageTransactions.map((t) => ({
					...t,
					category: $categories?.find((c) => c.id === t.categoryId) ?? undefined,
				}))
			);

			document.addEventListener('localStorageChanged', localStorageSetHandler, false);

			return () =>
				document.removeEventListener('localStorageChanged', localStorageSetHandler, false);
		} else if ($user) {
			const q = query(collection(db, `users/${$user.uid}/transactions`));
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const transactions: Transaction[] = snapshot.docs.map((doc) => {
					return {
						id: doc.id,
						description: doc.data().description as string,
						payee: doc.data().payee as string,
						amount: doc.data().amount as number,
						category:
							$categories?.find((c) => c.id === doc.data().categoryId) ?? undefined,
						date: doc.data().date as Date,
					};
				});
				set(transactions);
			});
			return unsubscribe;
		}
	}
);
