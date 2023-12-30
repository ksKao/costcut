<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		filterDateRange,
		type Category,
		type FilterDateRange,
		type Transaction,
	} from '../../lib/types';
	import { categories } from '../../stores/category';
	import { Chart } from 'chart.js';
	import { groupFilteredTransactionsByDate } from '../../lib/utils';

	export let filteredTransactions: Transaction[];
	export let selectedDateRange: FilterDateRange;
	export let chartWrapper: HTMLDivElement;

	let stackedLineChart: Chart<'line'>;
	let lineChartCanvas: HTMLCanvasElement;

	$: {
		stackedLineChart?.destroy();
		if (lineChartCanvas && $categories) {
			stackedLineChart = new Chart(lineChartCanvas, {
				type: 'line',
				data: {
					// labels: groupedFilteredTransactions.map((t) => t.date),
					labels: getDateLabels(selectedDateRange),
					datasets: groupFilteredTransactionsByCategories(
						filteredTransactions,
						$categories
					),
				},
				options: {
					maintainAspectRatio: false,
				},
			});
		}
	}

	const getDateLabels = (dateRange: FilterDateRange) => {
		let labels: string[] = [];
		const now = new Date();
		const dateMonthFormatter = new Intl.DateTimeFormat('en-UK', {
			month: 'short',
			year: 'numeric',
		});
		const dateDayFormatter = new Intl.DateTimeFormat('en-UK', {
			day: 'numeric',
			month: 'short',
		});

		switch (dateRange) {
			case 'Past 12 Months':
			case 'Past 6 Months':
				const numberOfMonths = dateRange === 'Past 12 Months' ? 12 : 6;
				for (let i = 0; i < numberOfMonths; i++) {
					const newDate = new Date();
					newDate.setMonth(now.getMonth() - i);
					labels.push(dateMonthFormatter.format(newDate));
				}
				break;
			case 'Past 30 Days':
			case 'Past Week':
				const numberOfDays = dateRange === 'Past 30 Days' ? 30 : 7;
				for (let i = 0; i < numberOfDays; i++) {
					const newDate = new Date();
					newDate.setDate(now.getDate() - i);
					labels.push(dateDayFormatter.format(newDate));
				}
				break;
		}
		return labels;
	};

	const groupFilteredTransactionsByCategories = (
		filteredTransactions: Transaction[],
		categories: Category[]
	) => {
		const dataset: {
			label: string;
			data: number[];
			fill: true;
		}[] = [];
		for (const category of categories) {
			const transactionsInCategory = filteredTransactions.filter(
				(t) => t.category?.id === category.id
			);
			const transactionsGroupedByDate = groupFilteredTransactionsByDate(
				transactionsInCategory,
				selectedDateRange
			).map((data) => data.transactions);
			let amountGroupedByDate: number[] = [];
			for (const dateGroup of transactionsGroupedByDate) {
				amountGroupedByDate.push(
					dateGroup.reduce((prev, curr) => {
						return (prev += curr.amount);
					}, 0)
				);
			}
			dataset.push({
				label: category.name,
				data: amountGroupedByDate,
				fill: true,
			});
		}
		return dataset;
	};

	const onResize = () => {
		lineChartCanvas.width = chartWrapper.clientWidth;
		lineChartCanvas.height = chartWrapper.clientHeight;
	};

	onMount(() => {
		addEventListener('resize', onResize);
	});

	onDestroy(() => {
		removeEventListener('resize', onResize);
	});
</script>

<canvas bind:this={lineChartCanvas} class="m-auto h-full w-full max-w-full" />
