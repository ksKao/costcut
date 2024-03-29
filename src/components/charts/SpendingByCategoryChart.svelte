<script lang="ts">
	import { Chart } from 'chart.js';
	import type { Transaction } from '../../lib/types';
	import { onDestroy, onMount } from 'svelte';

	let pieChartCanvas: HTMLCanvasElement;
	let pieChart: Chart<'pie'>;
	const spendingByCategories: { [key: string]: number } = {};

	export let filteredTransactions: Transaction[];
	export let chartWrapper: HTMLDivElement;

	Chart.overrides['pie'].plugins.legend.display = false;

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
					// maintainAspectRatio: false,
					// responsive: false,
				},
			});
		}
	}

	$: {
		filteredTransactions = filteredTransactions.filter((t) => t.amount < 0);
		filteredTransactions.forEach((transaction) => {
			const categoryName = transaction.category?.name ?? 'Uncategorized';
			if (categoryName in spendingByCategories) {
				spendingByCategories[categoryName] += -transaction.amount;
			} else {
				spendingByCategories[categoryName] = -transaction.amount;
			}
		});
	}

	const onResize = () => {
		pieChartCanvas.width = chartWrapper.clientWidth;
		pieChartCanvas.height = chartWrapper.clientHeight;
	};

	onMount(() => {
		addEventListener('resize', onResize);
	});

	onDestroy(() => {
		removeEventListener('resize', onResize);
	});
</script>

{#if filteredTransactions.length === 0}
	<div class="flex min-h-full min-w-full flex-grow items-center justify-center">
		<span class="text-2xl">No data available.</span>
	</div>
{:else}
	<canvas bind:this={pieChartCanvas} class="m-auto h-[40vh] max-h-[40vh] max-w-full" />
{/if}
