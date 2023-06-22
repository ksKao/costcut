<script lang="ts">
	import Modal from '../components/Modal.svelte';
	import { user } from '../stores/auth';
	import AddTransactionForm from '../components/AddTransactionForm.svelte';
	import { transactionStore } from '../stores/transaction';
</script>

<h1>Dashboard</h1>
<p>{$user?.emailVerified}</p>
{#if $transactionStore !== null}
	{#each $transactionStore.transactions as t}
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
