<script lang="ts">
	import { Chart } from 'chart.js';
	import { transactions } from '../../stores/transaction';
	import type { Transaction } from '../../lib/types';
	import Select from '../common/Select.svelte';

	let pieChartCanvas: HTMLCanvasElement;
	let pieChart: Chart<'pie'>;
	let filteredTransactions: Transaction[];
	const dateRange = [
		'All Time',
		'Past 12 Months',
		'Past 6 Months',
		'Past Month',
		'Past Week',
	] as const;
	let selectedDateRange: (typeof dateRange)[number] = 'All Time';
	const spendingByCategories: { [key: string]: number } = {};

	Chart.overrides['pie'].plugins.legend.display = false;

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

	$: {
		pieChart?.destroy();
		if (pieChartCanvas) {
			pieChart = new Chart(pieChartCanvas, {
				type: 'pie',
				data: {
					labels: Object.keys(spendingByCategories),
					datasets: [
						{
							data: Object.values(spendingByCategories),
							hoverOffset: 4,
						},
					],
				},
				options: {
					layout: {
						padding: 10,
					},
				},
			});
		}
	}

	$: {
		filteredTransactions.forEach((transaction) => {
			const categoryName = transaction.category?.name ?? 'Uncategorized';
			if (categoryName in spendingByCategories) {
				spendingByCategories[categoryName] += -transaction.amount;
			} else {
				spendingByCategories[categoryName] = -transaction.amount;
			}
		});
	}
</script>

<div class="flex w-full justify-between">
	<h2 class="text-xl font-semibold">Spending By Category</h2>
	<Select bind:selected={selectedDateRange} values={[...dateRange]} />
</div>
{#if filteredTransactions.length == 0}
	<div class="flex h-full w-full items-center justify-center">
		<span class="my-4 text-2xl">No data available.</span>
	</div>
{:else}
	<canvas bind:this={pieChartCanvas} class="m-auto max-w-full" />
{/if}
