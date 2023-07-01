<script lang="ts">
	import { ChevronDown, ChevronUp, ChevronsUpDown, Pencil, Trash2 } from 'lucide-svelte';
	import Pagination from '../components/Pagination.svelte';
	import { filteredTransactions } from '../stores/transaction';
	import { filter } from '../stores/filter';
	import type { Transaction } from '../lib/types';
	import Modal from '../components/Modal.svelte';
	import AddTransactionForm from '../components/AddTransactionForm.svelte';
	import ConfirmDeleteTransaction from '../components/ConfirmDeleteTransaction.svelte';

	const headers: {
		name: string;
		sortKey: keyof Transaction;
	}[] = [
		{
			name: 'Date',
			sortKey: 'date',
		},
		{
			name: 'Description',
			sortKey: 'description',
		},
		{
			name: 'Payee',
			sortKey: 'payee',
		},
		{
			name: 'Category',
			sortKey: 'category',
		},
		{
			name: 'Amount',
			sortKey: 'amount',
		},
		{
			name: 'Balance',
			sortKey: 'balance',
		},
	];
</script>

<h1 class="mb-4 text-xl font-bold lg:text-2xl">Transactions</h1>
{#if $filteredTransactions === null}
	<div class="flex w-full items-center justify-center">
		<span class="loading loading-spinner" />
	</div>
{:else}
	<div class="overflow-x-auto">
		<table class="table-zebra table">
			<thead>
				<tr>
					{#each headers as header}
						<th>
							<button
								class="flex w-full justify-between"
								on:click={() => {
									if ($filter.sort === header.sortKey) {
										$filter.order = $filter.order === 'asc' ? 'desc' : 'asc';
									} else {
										$filter.sort = header.sortKey;
										$filter.order = 'desc';
									}
								}}
							>
								<span>{header.name}</span>
								{#if $filter.sort === header.sortKey}
									{#if $filter.order === 'asc'}
										<ChevronUp class="h-4 w-4" />
									{:else}
										<ChevronDown class="h-4 w-4" />
									{/if}
								{:else}
									<ChevronsUpDown class="h-4 w-4" />
								{/if}
							</button>
						</th>
					{/each}
					<th />
				</tr>
			</thead>
			<tbody>
				{#each $filteredTransactions as transaction}
					<tr>
						<td>{new Intl.DateTimeFormat('en-UK').format(transaction.date)}</td>
						<td>{transaction.description}</td>
						<td>{transaction.payee}</td>
						<td>{transaction.category?.name ?? 'Uncategorized'}</td>
						<td class={`${transaction.amount > 0 ? 'text-success' : 'text-error'}`}>
							{transaction.amount.toFixed(2)}
						</td>
						<td>{transaction.balance.toFixed(2)}</td>
						<td class="flex gap-3">
							<Modal key="addTransactionModal" buttonClassName="h-4 w-4">
								<Pencil slot="button" />
								<AddTransactionForm {transaction} />
							</Modal>

							<Modal key="confirmDeleteModal" buttonClassName="h-4 w-4">
								<Trash2 slot="button" />
								<ConfirmDeleteTransaction transactionId={transaction.id} />
							</Modal>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="mx-auto my-2 w-max">
			<Pagination />
		</div>
	</div>
{/if}
