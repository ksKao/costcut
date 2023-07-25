<script lang="ts">
	import { type FilterDateRange, type Transaction, filterDateRange } from '../lib/types';
	import { transactions } from '../stores/transaction';
	import Select from './common/Select.svelte';

	export let title: string;
	export let hasAllTime: boolean = false;
	let filteredTransactions: Transaction[] = [];
	let selectedDateRange: FilterDateRange = filterDateRange[hasAllTime ? 0 : 1];

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
				} else if (selectedDateRange === 'Past 30 Days') {
					return transaction.date >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
				} else if (selectedDateRange === 'Past Week') {
					return transaction.date >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
				}
			}) ?? [];
	}
</script>

<div class="flex h-fit min-h-[40vh] flex-col rounded-md border-2 border-gray-500 p-4 lg:rounded-lg">
	<div class="flex w-full justify-between">
		<h2 class="text-xl font-semibold">{title}</h2>
		<Select
			bind:selected={selectedDateRange}
			values={hasAllTime ? [...filterDateRange] : filterDateRange.slice(1)}
		/>
	</div>
	{#if filteredTransactions.length == 0}
		<div class="flex min-h-full min-w-full flex-grow items-center justify-center">
			<span class="text-2xl">No data available.</span>
		</div>
	{:else}
		<div class="h-[40vh] max-h-[40vh] max-w-full">
			<slot {filteredTransactions} {selectedDateRange} />
		</div>
	{/if}
</div>
