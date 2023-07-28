<script lang="ts">
	import ChartWrapper from '../components/ChartWrapper.svelte';
	import BalanceOverTimeChart from '../components/charts/BalanceOverTimeChart.svelte';
	import IncomeVsExpense from '../components/charts/IncomeVsExpense.svelte';
	import SpendingByCategoryChart from '../components/charts/SpendingByCategoryChart.svelte';
	import StackedCategories from '../components/charts/StackedCategories.svelte';
	import { transactions } from '../stores/transaction';
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
		<ChartWrapper
			let:filteredTransactions
			let:chartWrapper
			title="Spending By Category"
			hasAllTime
		>
			<SpendingByCategoryChart {filteredTransactions} {chartWrapper} />
		</ChartWrapper>
		<ChartWrapper let:selectedDateRange let:chartWrapper title="Balance Over Time">
			<BalanceOverTimeChart {selectedDateRange} {chartWrapper} />
		</ChartWrapper>
		<ChartWrapper
			let:filteredTransactions
			let:selectedDateRange
			let:chartWrapper
			title="Income Vs Expense"
		>
			<IncomeVsExpense {filteredTransactions} {selectedDateRange} {chartWrapper} />
		</ChartWrapper>
		<ChartWrapper
			let:filteredTransactions
			let:selectedDateRange
			let:chartWrapper
			title="Spending By Category Over Time"
		>
			<StackedCategories {filteredTransactions} {selectedDateRange} {chartWrapper} />
		</ChartWrapper>
	</div>
{/if}
