<script lang="ts">
	import { filteredTransactions } from '../stores/transaction';
</script>

<h1 class="text-xl font-bold lg:text-2xl">Transactions</h1>
{#if $filteredTransactions === null}
	<div class="flex w-full items-center justify-center">
		<span class="loading loading-spinner" />
	</div>
{:else}
	<div class="overflow-x-auto">
		<table class="table-zebra table">
			<thead>
				<tr>
					<th>Date</th>
					<th>Description</th>
					<th>Category</th>
					<th>Amount</th>
					<th>Balance</th>
				</tr>
			</thead>
			<tbody>
				{#each $filteredTransactions as transaction}
					<tr>
						<td>{new Intl.DateTimeFormat('en-UK').format(transaction.date)}</td>
						<td>{transaction.description}</td>
						<td>{transaction.category?.name ?? 'Uncategorized'}</td>
						<td class={`${transaction.amount > 0 ? 'text-success' : 'text-error'}`}>
							{transaction.amount.toFixed(2)}
						</td>
						<td>{transaction.balance.toFixed(2)}</td>
					</tr>
				{/each}</tbody
			>
		</table>
	</div>
{/if}
