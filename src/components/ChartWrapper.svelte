<script lang="ts">
	import { type FilterDateRange, type Transaction, filterDateRange } from '../lib/types';
	import { transactions } from '../stores/transaction';
	import Select from './common/Select.svelte';

	export let title: string;

	let selectedDateRange: FilterDateRange = 'All Time';
	let filteredTransactions: Transaction[] = [];

	$: {
		filteredTransactions =
			$transactions?.transactions.filter((transaction) => {
				if (transaction.amount >= 0) return false;
				if (selectedDateRange === 'All Time') {
					return true;
				} else if (transaction.date > new Date()) return false;
				else if (selectedDateRange === 'Past 12 Months') {
					return transaction.date >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);
				} else if (selectedDateRange === 'Past 6 Months') {
					return (
						transaction.date >= new Date(Date.now() - (1000 * 60 * 60 * 24 * 365) / 2)
					);
				} else if (selectedDateRange === 'Past Month') {
					return transaction.date >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
				} else if (selectedDateRange === 'Past Week') {
					return transaction.date >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
				}
			}) ?? [];
	}
</script>

<div class="h-fit min-h-[40vh] rounded-md border-2 border-gray-500 p-4 lg:rounded-lg">
	<div class="flex w-full justify-between">
		<h2 class="text-xl font-semibold">{title}</h2>
		<Select bind:selected={selectedDateRange} values={[...filterDateRange]} />
	</div>
	{#if filteredTransactions.length == 0}
		<div class="flex h-full w-full items-center justify-center">
			<span class="my-4 text-2xl">No data available.</span>
		</div>
	{:else}
		<div class="h-auto w-auto">
			<slot {filteredTransactions} />
		</div>
	{/if}
</div>
