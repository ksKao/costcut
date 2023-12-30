<script lang="ts">
	import { Chart } from 'chart.js';
	import type { Transaction, FilterDateRange } from '../../lib/types';
	import { onDestroy, onMount } from 'svelte';
	import { groupFilteredTransactionsByDate } from '../../lib/utils';

	let incomeVsExpense: {
		date: string;
		income: number;
		expense: number;
	}[] = [];
	let barChartCanvas: HTMLCanvasElement;
	let barChart: Chart<'bar'>;

	export let selectedDateRange: FilterDateRange;
	export let filteredTransactions: Transaction[];
	export let chartWrapper: HTMLDivElement;

	$: {
		incomeVsExpense = groupFilteredTransactionsByDate(
			filteredTransactions,
			selectedDateRange
		).map((group) => {
			return {
				date: group.date,
				income: group.transactions
					.filter((t) => t.amount > 0)
					.reduce((prev, curr) => (prev += curr.amount), 0),
				expense: group.transactions
					.filter((t) => t.amount < 0)
					.reduce((prev, curr) => (prev += curr.amount), 0),
			};
		});
	}

	$: {
		barChart?.destroy();
		if (barChartCanvas) {
			barChart = new Chart(barChartCanvas, {
				type: 'bar',
				data: {
					labels: incomeVsExpense.map((data) => data.date),
					datasets: [
						{
							label: 'Income',
							data: incomeVsExpense.map((data) => data.income),
						},
						{
							label: 'Expense',
							data: incomeVsExpense.map((data) => data.expense),
						},
					],
				},
				options: {
					scales: {
						y: { ...calculateMinMaxYAxisValues() },
					},
					maintainAspectRatio: false,
				},
			});
		}
	}

	const calculateMinMaxYAxisValues = () => {
		let maxIncome = -Infinity;
		let minExpense = Infinity;

		for (const data of incomeVsExpense) {
			if (data.income > maxIncome) {
				maxIncome = data.income;
			}

			if (data.expense < minExpense) {
				minExpense = data.expense;
			}
		}

		const maxValue = Math.max(maxIncome, -minExpense);
		const minValue = Math.min(minExpense, -maxIncome);

		return { max: maxValue, min: minValue };
	};

	const onResize = () => {
		barChartCanvas.width = chartWrapper.clientWidth;
		barChartCanvas.height = chartWrapper.clientHeight;
	};

	onMount(() => {
		addEventListener('resize', onResize);
	});

	onDestroy(() => {
		removeEventListener('resize', onResize);
	});
</script>

<canvas bind:this={barChartCanvas} class="m-auto h-full w-full max-w-full" />
