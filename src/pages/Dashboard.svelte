<script lang="ts">
	import Modal from '../components/Modal.svelte';
	import { user } from '../stores/auth';
	import AddTransactionForm from '../components/AddTransactionForm.svelte';
	import { transactions } from '../stores/transaction';

	// await setDoc(doc(db, `users/${$user?.uid}/transactions/randomId`), {
	// 	...parsedInput.data,
	// 	date: new Date(parsedInput.data.date),
	// });

	// const test = async () => {
	// 	if (!$user) return;

	// 	setDoc(doc(db, `users/${$user.uid}/transactions/randomId`), {
	// 		name: 'Movie Tickets',
	// 		date: serverTimestamp(),
	// 		amount: 20,
	// 		category: 'Entertainment',
	// 	});
	// };

	// let data = '';

	// onMount(async () => {
	// 	const transaction = await getDoc(doc(db, `users/${$user?.uid}/transactions/randomId`));
	// 	data = JSON.stringify(transaction.data());
	// });
</script>

<h1>Dashboard</h1>
<p>{$user?.emailVerified}</p>
{#if $transactions !== null}
	{#each $transactions as t}
		<p>{t.description}</p>
	{:else}
		<p>No transactions</p>
	{/each}
{:else}
	<p>Loading...</p>
{/if}
<Modal key="addTransactionModal">
	<svelte:fragment slot="button">Add Transaction</svelte:fragment>
	<AddTransactionForm />
</Modal>
