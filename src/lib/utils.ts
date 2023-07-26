import type { FilterDateRange, ResultResponse, Transaction, TransactionInDb } from './types';
import { auth, db } from './firebase';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	setDoc,
	where,
	writeBatch,
} from 'firebase/firestore';
import { filteredTransactions, transactions } from '../stores/transaction';
import { get } from 'svelte/store';
import { categories } from '../stores/category';
import type { User } from 'firebase/auth';

const dbOperations = async ({
	prefunctionCheck,
	fireStoreOperation,
	localStorageOperation,
}: {
	prefunctionCheck?: () => { success: false; errorMessage: string } | undefined;
	fireStoreOperation: (currentUser: User) => Promise<void>;
	localStorageOperation: () => void;
}): Promise<ResultResponse> => {
	if (prefunctionCheck) {
		const prefunctionCheckResult = prefunctionCheck();
		if (prefunctionCheckResult) return prefunctionCheckResult;
	}
	try {
		if (auth.currentUser) {
			if (!auth.currentUser.emailVerified)
				return {
					success: false,
					errorMessage:
						'Please verify your email first. Go to the settings page to resend the verification email.',
				};
			await fireStoreOperation(auth.currentUser);
			return {
				success: true,
			};
		} else {
			localStorageOperation();
			return {
				success: true,
			};
		}
	} catch (e: any) {
		return {
			success: false,
			errorMessage: e?.message ?? 'Something went wrong. Please try again later.',
		};
	}
};

export const generateFirestoreId = () => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const length = 20;

	let autoId = '';

	for (let i = 0; i < length; i++) {
		autoId += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return autoId;
};

export const parseLocalStorageTransactions = (localStorageValue: string | undefined) => {
	if (!localStorageValue) return [];

	const localStorageTransactions: TransactionInDb[] = JSON.parse(localStorageValue);
	const transactions: Transaction[] = localStorageTransactions.map((t) => ({
		...t,
		date: new Date(t.date),
		category: get(categories)?.find((c) => c.id === t.categoryId) ?? null,
		balance: 0,
	}));
	return transactions;
};

export const recalculateBalances = (transactions: Transaction[]) => {
	transactions = transactions.sort((a, b) => a.date.getTime() - b.date.getTime());
	let balance = 0;
	return transactions.map((t) => {
		balance += t.amount;
		return {
			...t,
			balance,
		};
	});
};

export const groupFilteredTransactionsByDate = (
	filteredTransactions: Transaction[],
	dateRange: FilterDateRange
) => {
	let grouped: { date: string; transactions: Transaction[] }[] = [];
	const now = new Date();
	const dateMonthFormatter = new Intl.DateTimeFormat('en-UK', {
		month: 'short',
		year: 'numeric',
	});
	const dateDayFormatter = new Intl.DateTimeFormat('en-UK', {
		day: 'numeric',
		month: 'short',
	});

	switch (dateRange) {
		case 'Past 12 Months':
		case 'Past 6 Months':
			const numberOfMonths = dateRange === 'Past 12 Months' ? 12 : 6;
			for (let i = 0; i < numberOfMonths; i++) {
				const newDate = new Date();
				newDate.setMonth(now.getMonth() - i);
				grouped.push({
					date: dateMonthFormatter.format(newDate),
					transactions: filteredTransactions.filter(
						(t) =>
							t.date.getMonth() === newDate.getMonth() &&
							t.date.getFullYear() === newDate.getFullYear()
					),
				});
			}
			break;
		case 'Past 30 Days':
		case 'Past Week':
			const numberOfDays = dateRange === 'Past 30 Days' ? 30 : 7;
			for (let i = 0; i < numberOfDays; i++) {
				const newDate = new Date();
				newDate.setDate(now.getDate() - i);
				grouped.push({
					date: dateDayFormatter.format(newDate),
					transactions: filteredTransactions.filter(
						(t) =>
							t.date.getDate() === newDate.getDate() &&
							t.date.getMonth() === newDate.getMonth() &&
							t.date.getFullYear() === newDate.getFullYear()
					),
				});
			}
			break;
	}

	return grouped;
};

export const addTransaction = async (
	transaction: Omit<TransactionInDb, 'id'>
): Promise<ResultResponse> => {
	return dbOperations({
		fireStoreOperation: async (currentUser) => {
			const batch = writeBatch(db);
			batch.set(
				doc(db, `users/${currentUser.uid}/transactions/${generateFirestoreId()}`),
				transaction
			);
			await batch.commit();
		},
		localStorageOperation: () => {
			const currentTransactionsInLocalStorage = localStorage.getItem('transactions');
			const newTransaction: TransactionInDb = {
				...transaction,
				id: generateFirestoreId(),
			};
			if (currentTransactionsInLocalStorage) {
				localStorage.setItem(
					'transactions',
					JSON.stringify([
						...(get(transactions)?.transactions.map((t) => {
							return {
								id: t.id,
								description: t.description,
								payee: t.payee,
								amount: t.amount,
								categoryId: t.category?.id ?? '',
								date: t.date,
							};
						}) ?? []),
						newTransaction,
					])
				);
			} else {
				localStorage.setItem('transactions', JSON.stringify([newTransaction]));
			}
		},
	});
};

export const addCategory = async (category: string): Promise<ResultResponse> => {
	return dbOperations({
		prefunctionCheck: () => {
			if (get(categories)?.find((c) => c.name.toLowerCase() === category.toLowerCase())) {
				return {
					success: false,
					errorMessage: 'Category already exists.',
				};
			}
		},
		fireStoreOperation: async (currentUser) => {
			await setDoc(doc(db, `users/${currentUser.uid}/categories/${generateFirestoreId()}`), {
				name: category,
			});
		},
		localStorageOperation: () => {
			const currentCategoriesInLocalStorage = localStorage.getItem('categories');
			if (currentCategoriesInLocalStorage) {
				localStorage.setItem(
					'categories',
					JSON.stringify([
						...(get(categories) ?? []),
						{ id: generateFirestoreId(), name: category },
					])
				);
			} else {
				localStorage.setItem(
					'categories',
					JSON.stringify([{ id: generateFirestoreId(), name: category }])
				);
			}
		},
	});
};

export const editCategory = async (
	categoryId: string,
	newName: string
): Promise<ResultResponse> => {
	return dbOperations({
		prefunctionCheck: () => {
			// if category doesn't exist
			if (!get(categories)?.find((c) => c.id === categoryId)) {
				return {
					success: false,
					errorMessage: 'The category you are trying to edit does not exist.',
				};
			}
		},
		fireStoreOperation: async (currentUser) => {
			await setDoc(doc(db, `users/${currentUser.uid}/categories/${categoryId}`), {
				name: newName,
			});
		},
		localStorageOperation: () => {
			let newCategories = get(categories);
			let indexToEdit = newCategories?.findIndex((c) => c.id === categoryId);
			if (indexToEdit === undefined || newCategories === null)
				throw new Error('The category you are trying to edit does not exist.');
			newCategories[indexToEdit].name = newName;
			localStorage.setItem('categories', JSON.stringify(newCategories));
		},
	});
};

export const deleteCategory = async (categoryId: string): Promise<ResultResponse> => {
	return dbOperations({
		fireStoreOperation: async (currentUser) => {
			const batch = writeBatch(db);
			batch.delete(doc(db, `users/${currentUser.uid}/categories/${categoryId}`));
			const transactionsWithCategory = await getDocs(
				query(
					collection(db, `users/${currentUser.uid}/transactions`),
					where('categoryId', '==', categoryId)
				)
			);
			transactionsWithCategory.forEach((doc) => {
				batch.update(doc.ref, {
					categoryId: null,
				});
			});
			await batch.commit();
		},
		localStorageOperation: () => {
			const categoriesStore = get(categories);
			if (!categoriesStore) return { success: false, errorMessage: 'Something went wrong.' };
			let newCategories = categoriesStore.filter((c) => c.id !== categoryId);
			localStorage.setItem('categories', JSON.stringify(newCategories));
			const transactionStore = get(transactions);
			if (!transactionStore) return { success: false, errorMessage: 'Something went wrong.' };
			let newTransactions = transactionStore.transactions.map((t) => {
				return {
					id: t.id,
					amount: t.amount,
					date: t.date,
					description: t.description,
					payee: t.payee,
					categoryId: t.category?.id === categoryId ? null : t.category?.id,
				};
			});
			localStorage.setItem('transactions', JSON.stringify(newTransactions));
		},
	});
};

export const editTransaction = async (
	id: string,
	transaction: TransactionInDb
): Promise<ResultResponse> => {
	return dbOperations({
		fireStoreOperation: async (currentUser) => {
			await setDoc(doc(db, `users/${currentUser.uid}/transactions/${id}`), transaction);
		},
		localStorageOperation: () => {
			const localStorageTransactions: TransactionInDb[] = JSON.parse(
				localStorage.getItem('transactions') ?? '[]'
			);
			if (!localStorageTransactions)
				return {
					success: false,
					errorMessage: 'The transaction you are trying to edit does not exist.',
				};

			const indexToEdit = localStorageTransactions.findIndex((t) => t.id === id);
			if (indexToEdit === undefined || indexToEdit === -1)
				throw new Error('The transaction you are trying to edit does not exist.');
			localStorageTransactions[indexToEdit] = {
				...transaction,
			};
			localStorage.setItem('transactions', JSON.stringify(localStorageTransactions));
		},
	});
};

export const deleteTransaction = async (id: string): Promise<ResultResponse> => {
	return dbOperations({
		fireStoreOperation: async (currentUser) => {
			await deleteDoc(doc(db, `users/${currentUser.uid}/transactions/${id}`));
		},
		localStorageOperation: () => {
			const localStorageTransactions: TransactionInDb[] = JSON.parse(
				localStorage.getItem('transactions') ?? '[]'
			);
			if (!localStorageTransactions) throw new Error('There are no transactions to delete');
			localStorage.setItem(
				'transactions',
				JSON.stringify(localStorageTransactions.filter((t) => t.id !== id))
			);
		},
	});
};
