<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { categories, demoData, generateRandomDate } from '../lib/demoData';
	import type { createDialog } from 'svelte-headlessui';
	import { Check, X } from 'lucide-svelte';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth, db } from '../lib/firebase';
	import toast from 'svelte-french-toast';
	import { user } from '../stores/auth';
	import { collection, getDocs, DocumentReference, writeBatch, doc } from 'firebase/firestore';
	import { generateFirestoreId } from '../lib/utils';

	type Status = 'success' | 'error' | 'pending';
	const authModal = getContext<ReturnType<typeof createDialog>>('authModal');

	const setupExampleAccount = async () => {
		// log in with example credentials
		try {
			await signInWithEmailAndPassword(
				auth,
				import.meta.env.VITE_EXAMPLE_ACCOUNT_EMAIL,
				import.meta.env.VITE_EXAMPLE_ACCOUNT_PASSWORD
			);
			status.loggingIn = 'success';
		} catch {
			toast.error('Something went wrong. Please try again later.');
			status.loggingIn = 'error';
			return;
		}

		if (!$user) {
			toast.error('Could not login in with example account. Please try again.');
			return;
		}

		// clear existing data
		try {
			// delete all transactions
			const collectionRef = await getDocs(collection(db, 'users', $user.uid, 'transactions'));
			const batchSize = 500;

			// Split documents into chunks of batchSize
			const chunks: DocumentReference[][] = [];
			collectionRef.forEach((doc) => {
				if (chunks.length > 0 && chunks[chunks.length - 1].length < batchSize) {
					chunks[chunks.length - 1].push(doc.ref);
				} else {
					chunks.push([doc.ref]);
				}
			});

			// Delete documents in batches
			const deletePromises = chunks.map(async (chunk) => {
				const batch = writeBatch(db);
				chunk.forEach((documentRef) => {
					batch.delete(documentRef);
				});
				await batch.commit();
			});

			// Wait for all batches to complete
			await Promise.all(deletePromises);

			// delete all categories
			const categoriesRef = await getDocs(collection(db, 'users', $user.uid, 'categories'));

			// Split documents into chunks of batchSize
			const categoriesChunks: DocumentReference[][] = [];
			categoriesRef.forEach((doc) => {
				if (
					categoriesChunks.length > 0 &&
					categoriesChunks[categoriesChunks.length - 1].length < batchSize
				) {
					categoriesChunks[categoriesChunks.length - 1].push(doc.ref);
				} else {
					categoriesChunks.push([doc.ref]);
				}
			});

			// Delete documents in batches
			const deletePromisesCategories = categoriesChunks.map(async (chunk) => {
				const batch = writeBatch(db);
				chunk.forEach((documentRef) => {
					batch.delete(documentRef);
				});
				await batch.commit();
			});

			// Wait for all batches to complete
			await Promise.all(deletePromisesCategories);
			status.clearingData = 'success';
		} catch (e) {
			toast.error('Something went wrong. Please try again later.');
			status.clearingData = 'error';
			return;
		}

		// insert new demo data
		try {
			// insert categories
			const batch = writeBatch(db);
			categories.forEach((c) => {
				batch.set(doc(db, `users/${$user?.uid}/categories/${c.id}`), {
					name: c.name,
				});
			});
			demoData.forEach((d) => {
				batch.set(doc(db, `users/${$user?.uid}/transactions/${generateFirestoreId()}`), {
					description: d.description,
					payee: d.payee,
					amount: d.amount,
					categoryId: d.categoryId,
					date: generateRandomDate(),
				});
			});
			await batch.commit();
			status.insertingData = 'success';
			authModal.close();
		} catch {
			toast.error('Something went wrong. Please try again later.');
			status.insertingData = 'error';
			return;
		}
	};

	let status: {
		loggingIn: Status;
		clearingData: Status;
		insertingData: Status;
	} = {
		loggingIn: 'pending',
		clearingData: 'pending',
		insertingData: 'pending',
	};

	onMount(setupExampleAccount);
</script>

<div class="mx-4 mt-4 flex max-w-full flex-col items-center gap-4">
	<div class="flex items-center gap-2">
		{#if status.loggingIn === 'pending'}
			<span class="loading loading-spinner h-6" />
		{:else if status.loggingIn === 'success'}
			<Check class="text-success" />
		{:else}
			<X class="text-error" />
		{/if}
		<p>Logging In</p>
	</div>
	<div class="flex items-center gap-2">
		{#if status.clearingData === 'pending'}
			<span class="loading loading-spinner h-6" />
		{:else if status.clearingData === 'success'}
			<Check class="text-success" />
		{:else}
			<X class="text-error" />
		{/if}
		<p>Clearing Existing Data</p>
	</div>
	<div class="flex items-center gap-2">
		{#if status.insertingData === 'pending'}
			<span class="loading loading-spinner h-6" />
		{:else if status.insertingData === 'success'}
			<Check class="text-success" />
		{:else}
			<X class="text-error" />
		{/if}
		<p>Inserting New Demo Data</p>
	</div>
</div>
