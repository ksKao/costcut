<script lang="ts">
	import Modal from '../components/Modal.svelte';
	import AddTransactionForm from '../components/AddTransactionForm.svelte';
	import { filteredTransactions, transactions } from '../stores/transaction';
	import ManageCategoryForm from '../components/ManageCategoryForm.svelte';
	import { onMount } from 'svelte';
	import { filter } from '../stores/filter';

	$: netIncomeThisMonth = $transactions?.transactions
		.filter((t) => t.date.getMonth() === new Date().getMonth())
		.reduce((acc, t) => acc + t.amount, 0);

	onMount(() => {
		$filter.order = 'desc';
		$filter.sort = 'date';
	});
</script>

{#if $filteredTransactions === null}
	<div class="flex h-full w-full items-center justify-center">
		<span class="loading loading-spinner" />
	</div>
{:else}
	<div class="flex h-full flex-col gap-4 lg:flex-row-reverse">
		<div class="flex h-full flex-col justify-between gap-6 lg:w-72 2xl:w-96">
			<h1 class="text-2xl font-bold lg:hidden">Dashboard</h1>
			<div>
				<Modal key="addTransactionModal" buttonClassName="w-full btn btn-primary my-2">
					<svelte:fragment slot="button">Add Transaction</svelte:fragment>
					<AddTransactionForm />
				</Modal>
				<Modal key="manageCategoryModal" buttonClassName="w-full btn btn-primary my-2">
					<svelte:fragment slot="button">Manage Category</svelte:fragment>
					<ManageCategoryForm />
				</Modal>
			</div>
			{#if netIncomeThisMonth !== undefined && $transactions?.transactions && $transactions.transactions.length > 0}
				<div class="rounded-md border-2 border-gray-500 p-4">
					<h2 class="text-xl font-bold">
						Net Income ({new Date().toLocaleString('en-US', {
							month: 'short',
							year: 'numeric',
						})})
					</h2>
					<p
						class={`mt-2 text-6xl ${
							netIncomeThisMonth > 0
								? 'text-success'
								: netIncomeThisMonth < 0
								? 'text-error'
								: ''
						} overflow-hidden overflow-ellipsis`}
					>
						{netIncomeThisMonth.toFixed(2)}
					</p>
				</div>
				<div class="h-96 w-full flex-grow bg-red-500">Piechart</div>
			{/if}
		</div>
		<div class="flex flex-grow flex-col justify-between gap-4">
			<h1 class="hidden text-2xl font-bold lg:block">Dashboard</h1>
			{#if $transactions !== null}
				{#if $transactions.transactions.length === 0}
					<div class="flex h-full items-center justify-center">
						You have no transactions. Add one to get started.
					</div>
				{:else}
					<div class="h-200 w-full flex-grow bg-red-500">Chart</div>
					<div class="max-w-[100vw] overflow-x-auto">
						<h2 class="text-xl font-bold">Recent Transactions</h2>
						<table class="table-zebra table max-w-full">
							<tr>
								<th>Date</th>
								<th>Description</th>
								<th>Category</th>
								<th>Payee</th>
								<th>Amount</th>
								<th>Balance</th>
							</tr>
							{#each $filteredTransactions.slice(0, 5) as transaction}
								<tr>
									<td
										>{new Intl.DateTimeFormat('en-UK').format(
											transaction.date
										)}</td
									>
									<td>{transaction.description}</td>
									<td>{transaction.category?.name ?? 'Uncategorized'}</td>
									<td>{transaction.payee}</td>
									<td>{transaction.amount}</td>
									<td>{transaction.balance}</td>
								</tr>
							{/each}
						</table>
					</div>
				{/if}
			{:else}
				<span class="loading loading-spinner" />
			{/if}
		</div>
	</div>
{/if}
