import { derived } from 'svelte/store';
import { user } from './auth';
import { categories } from './category';
import type { ItemInsertedEvent, Transaction, TransactionInDb } from '../lib/types';
import { db } from '../lib/firebase';
import { query, collection, onSnapshot, getCountFromServer, Timestamp } from 'firebase/firestore';
import { filter } from './filter';
import { parseLocalStorageTransactions, recalculateBalances } from '../lib/utils';

type TransactionStore = {
	transactions: Transaction[];
	count: number;
};

export const transactions = derived<[typeof user, typeof categories], TransactionStore | null>(
	[user, categories],
	([$user, $categories], set) => {
		if ($user === undefined) {
			set(null);
		} else if ($user === null) {
			const localStorageSetHandler = (e: ItemInsertedEvent) => {
				if (e.key === 'transactions') {
					const transactions = parseLocalStorageTransactions(e.value);
					set({
						transactions: recalculateBalances(transactions),
						count: transactions.length,
					});
				}
			};

			const transactions = parseLocalStorageTransactions(
				localStorage.getItem('transactions') ?? undefined
			);
			set({
				transactions: recalculateBalances(transactions),
				count: transactions.length,
			});

			document.addEventListener('localStorageChanged', localStorageSetHandler, false);

			return () => {
				document.removeEventListener('localStorageChanged', localStorageSetHandler, false);
				set(null);
			};
		} else if ($user) {
			const q = query(collection(db, `users/${$user.uid}/transactions`));
			const unsubscribe = onSnapshot(q, async (snapshot) => {
				let transactions: Transaction[] = snapshot.docs.map((doc) => {
					return {
						id: doc.id,
						description: doc.data().description as string,
						payee: doc.data().payee as string,
						amount: doc.data().amount as number,
						category: $categories?.find((c) => c.id === doc.data().categoryId) ?? null,
						date: (doc.data().date as Timestamp).toDate(),
						balance: 0,
					};
				});
				const count = (await getCountFromServer(q)).data().count;
				set({
					transactions: recalculateBalances(transactions),
					count,
				});
			});
			return () => {
				unsubscribe();
				set(null);
			};
		}
	}
);

export const filteredTransactions = derived<
	[typeof transactions, typeof filter],
	Transaction[] | null
>(
	[transactions, filter],
	([$transactions, $filter]) => {
		if ($transactions === null) return null;

		const sorted = $transactions.transactions.sort((a, b) => {
			const bigger = $filter.order === 'asc' ? a : b;
			const smaller = $filter.order === 'asc' ? b : a;

			switch ($filter.sort) {
				case 'category':
					const aCategory = a.category?.name ?? 'Uncategorized';
					const bCategory = b.category?.name ?? 'Uncategorized';
					return aCategory.localeCompare(bCategory);
				case 'date':
					return bigger.date.getTime() - smaller.date.getTime();
				case 'description':
					return bigger.description.localeCompare(smaller.description);
				case 'payee':
					return bigger.payee.localeCompare(smaller.payee);
				case 'amount':
					return bigger.amount - smaller.amount;
				default:
					return 0;
			}
		});

		return sorted.slice($filter.skip, $filter.skip + $filter.itemsPerPage);
	},
	null
);
