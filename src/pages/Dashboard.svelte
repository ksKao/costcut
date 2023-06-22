<script lang="ts">
	import Modal from '../components/Modal.svelte';
	import { user } from '../stores/auth';
	import AddTransactionForm from '../components/AddTransactionForm.svelte';
	import { transactionStore } from '../stores/transaction';
	import ManageCategoryForm from '../components/ManageCategoryForm.svelte';
	import { getCategoryNameById } from '../lib/utils';
</script>

<h1>Dashboard</h1>
<p>{$user?.emailVerified}</p>
{#if $transactionStore !== null}
	{#each $transactionStore.transactions as t}
		<p>
			{t.description}, {getCategoryNameById(t.categoryId) ?? 'Uncategorized'}
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
