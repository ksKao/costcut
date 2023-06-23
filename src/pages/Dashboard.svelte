<script lang="ts">
	import Modal from '../components/Modal.svelte';
	import { user } from '../stores/auth';
	import AddTransactionForm from '../components/AddTransactionForm.svelte';
	import { transactions } from '../stores/transaction';
	import ManageCategoryForm from '../components/ManageCategoryForm.svelte';
</script>

<h1>Dashboard</h1>
<p>{$user?.emailVerified}</p>
{#if $transactions !== null}
	{#each $transactions as t}
		<p>
			{t.description}, {t.category?.name ?? 'Uncategorized'}
		</p>
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
<Modal key="manageCategoryModal">
	<svelte:fragment slot="button">Manage Category</svelte:fragment>
	<ManageCategoryForm />
</Modal>
