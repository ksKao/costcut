<script lang="ts">
	import { Chart } from 'chart.js';
	import type { Transaction } from '../../lib/types';

	let pieChartCanvas: HTMLCanvasElement;
	let pieChart: Chart<'pie'>;
	const spendingByCategories: { [key: string]: number } = {};

	export let filteredTransactions: Transaction[];

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

<canvas bind:this={pieChartCanvas} class="m-auto max-w-full" />
