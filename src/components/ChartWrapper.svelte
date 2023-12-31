<script lang="ts">
	import { type FilterDateRange, type Transaction, filterDateRange } from '../lib/types';
	import { transactions } from '../stores/transaction';
	import Select from './common/Select.svelte';

	export let title: string;
	export let hasAllTime: boolean = false;
	let filteredTransactions: Transaction[] = [];
	let selectedDateRange: FilterDateRange = filterDateRange[hasAllTime ? 0 : 1];
	let chartWrapper: HTMLDivElement;

	$: {
		filteredTransactions =
			$transactions?.transactions.filter((transaction) => {
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

<div class="flex h-fit min-h-full flex-col rounded-md border-2 border-gray-500 p-4 lg:rounded-lg">
	<div class="flex w-full justify-between">
		<h2 class="text-xl font-semibold">{title}</h2>
		<Select
			bind:selected={selectedDateRange}
			values={hasAllTime ? [...filterDateRange] : filterDateRange.slice(1)}
		/>
	</div>
	<div class="h-[35vh] max-h-[35vh] max-w-full" bind:this={chartWrapper}>
		<slot {filteredTransactions} {selectedDateRange} {chartWrapper} />
	</div>
</div>
