import type { ResultResponse, Transaction, TransactionInDb } from './types';
import { auth, db } from './firebase';
import {
	collection,
	doc,
	getDocs,
	increment,
	query,
	setDoc,
	where,
	writeBatch,
} from 'firebase/firestore';
import { transactions } from '../stores/transaction';
import { get } from 'svelte/store';
import { categories } from '../stores/category';

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

export const addTransaction = async (
	transaction: Omit<TransactionInDb, 'id'>
): Promise<ResultResponse> => {
	try {
		if (auth.currentUser) {
			if (!auth.currentUser.emailVerified)
				return {
					success: false,
					errorMessage:
						'Please verify your email first. Go to the settings page to resend the verification email.',
				};
			const batch = writeBatch(db);
			batch.set(
				doc(db, `users/${auth.currentUser.uid}/transactions/${generateFirestoreId()}`),
				transaction
			);
			await batch.commit();
			return {
				success: true,
			};
		} else {
			const currentTransactionsInLocalStorage = localStorage.getItem('transactions');
			const newTransaction: TransactionInDb = {
				...transaction,
				id: generateFirestoreId(),
			};
			console.log(newTransaction);
			console.log(transaction);
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
			return {
				success: true,
			};
		}
	} catch (e) {
		return {
			success: false,
			errorMessage: 'Something went wrong. Please try again later.',
		};
	}
};

export const addCategory = async (category: string): Promise<ResultResponse> => {
	if (get(categories)?.find((c) => c.name.toLowerCase() === category.toLowerCase())) {
		return {
			success: false,
			errorMessage: 'Category already exists.',
		};
	}
	try {
		if (auth.currentUser) {
			if (!auth.currentUser.emailVerified)
				return {
					success: false,
					errorMessage:
						'Please verify your email first. Go to the settings page to resend the verification email.',
				};
			await setDoc(
				doc(db, `users/${auth.currentUser.uid}/categories/${generateFirestoreId()}`),
				{ name: category }
			);
			return {
				success: true,
			};
		} else {
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
			return {
				success: true,
			};
		}
	} catch (e) {
		return {
			success: false,
			errorMessage: 'Something went wrong. Please try again later.',
		};
	}
};

export const editCategory = async (
	categoryId: string,
	newName: string
): Promise<ResultResponse> => {
	// if category doesn't exist
	if (!get(categories)?.find((c) => c.id === categoryId)) {
		return {
			success: false,
			errorMessage: 'The category you are trying to edit does not exist.',
		};
	}
	try {
		if (auth.currentUser) {
			if (!auth.currentUser.emailVerified)
				return {
					success: false,
					errorMessage:
						'Please verify your email first. Go to the settings page to resend the verification email.',
				};
			await setDoc(doc(db, `users/${auth.currentUser.uid}/categories/${categoryId}`), {
				name: newName,
			});
			return {
				success: true,
			};
		} else {
			let newCategories = get(categories);
			let indexToEdit = newCategories?.findIndex((c) => c.id === categoryId);
			if (indexToEdit === undefined || newCategories === null)
				return {
					success: false,
					errorMessage: 'The category you are trying to edit does not exist.',
				};
			newCategories[indexToEdit].name = newName;
			localStorage.setItem('categories', JSON.stringify(newCategories));
			return {
				success: true,
			};
		}
	} catch (e) {
		return {
			success: false,
			errorMessage: 'Something went wrong. Please try again later.',
		};
	}
};

export const deleteCategory = async (categoryId: string): Promise<ResultResponse> => {
	try {
		if (auth.currentUser) {
			if (!auth.currentUser.emailVerified)
				return {
					success: false,
					errorMessage:
						'Please verify your email first. Go to the settings page to resend the verification email.',
				};
			const batch = writeBatch(db);
			batch.delete(doc(db, `users/${auth.currentUser.uid}/categories/${categoryId}`));
			const transactionsWithCategory = await getDocs(
				query(
					collection(db, `users/${auth.currentUser.uid}/transactions`),
					where('categoryId', '==', categoryId)
				)
			);
			transactionsWithCategory.forEach((doc) => {
				batch.update(doc.ref, {
					categoryId: null,
				});
			});
			await batch.commit();
			return {
				success: true,
			};
		} else {
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
			return {
				success: true,
			};
		}
	} catch (e) {
		return {
			success: false,
			errorMessage: 'Something went wrong. Please try again later.',
		};
	}
};

export const editTransaction = async (
	id: string,
	transaction: TransactionInDb
): Promise<ResultResponse> => {
	try {
		if (auth.currentUser) {
			if (!auth.currentUser.emailVerified)
				return {
					success: false,
					errorMessage:
						'Please verify your email first. Go to the settings page to resend the verification email.',
				};
			await setDoc(doc(db, `users/${auth.currentUser.uid}/transactions/${id}`), transaction);
			return {
				success: true,
			};
		} else {
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
				return {
					success: false,
					errorMessage: 'The transaction you are trying to edit does not exist.',
				};
			localStorageTransactions[indexToEdit] = {
				...transaction,
			};
			localStorage.setItem('transactions', JSON.stringify(localStorageTransactions));
			return {
				success: true,
			};
		}
	} catch (e) {
		return {
			success: false,
			errorMessage: 'Something went wrong. Please try again later.',
		};
	}
};
