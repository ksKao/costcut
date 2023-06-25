import type { ResultResponse, TransactionWithCategoryId } from './types';
import { auth, db } from './firebase';
import {
	collection,
	deleteField,
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

export const addTransaction = async (
	transaction: Omit<TransactionWithCategoryId, 'id'>
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
			batch.update(doc(db, `users/${auth.currentUser.uid}`), {
				balance: increment(transaction.amount),
			});
			await batch.commit();
			return {
				success: true,
			};
		} else {
			const currentTransactionsInLocalStorage = localStorage.getItem('transactions');
			if (currentTransactionsInLocalStorage) {
				localStorage.setItem(
					'transactions',
					JSON.stringify([
						...(get(transactions)?.map((t) => {
							return {
								id: t.id,
								description: t.description,
								payee: t.payee,
								amount: t.amount,
								categoryId: t.category?.id ?? '',
								date: t.date,
							};
						}) ?? []),
						transaction,
					])
				);
				localStorage.setItem(
					'balance',
					(
						parseFloat(localStorage.getItem('balance') ?? '0') + transaction.amount
					).toString()
				);
			} else {
				localStorage.setItem('transactions', JSON.stringify([transaction]));
				localStorage.setItem('balance', transaction.amount.toString());
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
			let newTransactions = transactionStore.map((t) => {
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
