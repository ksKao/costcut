<script lang="ts">
	import ChartWrapper from '../components/ChartWrapper.svelte';
	import SpendingByCategoryChart from '../components/charts/SpendingByCategoryChart.svelte';
	import { filteredTransactions, transactions } from '../stores/transaction';
</script>

{#if $transactions == null}
	<div class="flex h-full w-full items-center justify-center">
		<span class="loading loading-spinner" />
	</div>
{:else if $transactions.transactions.length == 0}
	<div class="flex h-full w-full items-center justify-center">
		<span class="text-2xl">No transactions found. Add one to get started.</span>
	</div>
{:else}
	<h1 class="mb-4 text-2xl font-bold">Charts</h1>
	<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
		<ChartWrapper let:filteredTransactions title="Spending By Category">
			<SpendingByCategoryChart {filteredTransactions} />
		</ChartWrapper>
	</div>
{/if}
