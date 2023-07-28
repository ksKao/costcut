<script lang="ts">
	import { Chart } from 'chart.js';
	import type { FilterDateRange, Transaction } from '../../lib/types';
	import { transactions } from '../../stores/transaction';
	import { onDestroy, onMount } from 'svelte';

	const balanceOverTime: { date: string; balance: number }[] = [];
	const now = new Date();
	const dateMonthFormatter = new Intl.DateTimeFormat('en-UK', {
		month: 'short',
		year: 'numeric',
	});
	const dateDayFormatter = new Intl.DateTimeFormat('en-UK', {
		day: 'numeric',
		month: 'short',
	});

	let lineChartCanvas: HTMLCanvasElement;
	let lineChart: Chart<'line'>;

	export let selectedDateRange: FilterDateRange = 'Past Week';
	export let chartWrapper: HTMLDivElement;

	const calculateBalance = (date: Date, interval: 'month' | 'day'): number => {
		if (!$transactions) return 0;

		// get all transactions in that interval
		const transactionsInInterval = $transactions.transactions.filter((t) => {
			const sameMonth =
				t.date.getMonth() === date.getMonth() &&
				t.date.getFullYear() === date.getFullYear();
			const sameDay = sameMonth && t.date.getDate() == date.getDate();
			return interval === 'month' ? sameMonth : sameDay;
		});

		// if there are transaction in that interval, return the balance of the last transaction, sorted by time ascending
		if (transactionsInInterval.length !== 0) {
			return transactionsInInterval.sort((a, b) => a.date.getTime() - b.date.getTime())[
				transactionsInInterval.length - 1
			].balance;
		}

		// if there are no transactions in that interval, find the most recent transaction just before that
		let mostRecentTransaction: Transaction = $transactions.transactions?.[0];
		for (const transaction of $transactions.transactions) {
			if (transaction.date.getTime() > date.getTime()) continue;

			const oldTimeDifference = date.getTime() - mostRecentTransaction.date.getTime();
			const newTimeDifference = date.getTime() - transaction.date.getTime();
			if (newTimeDifference < oldTimeDifference) mostRecentTransaction = transaction;
		}

		return mostRecentTransaction.balance ?? 0;
	};

	$: {
		balanceOverTime.length = 0;
		switch (selectedDateRange) {
			case 'Past 12 Months':
			case 'Past 6 Months': {
				const numberOfIterations = selectedDateRange === 'Past 12 Months' ? 12 : 6;
				for (let i = 0; i < numberOfIterations; i++) {
					const newDate = new Date();
					newDate.setMonth(now.getMonth() - i);
					balanceOverTime.push({
						date: dateMonthFormatter.format(newDate),
						balance: calculateBalance(newDate, 'month'),
					});
				}
				break;
			}
			case 'Past 30 Days':
			case 'Past Week': {
				const numberOfIterations = selectedDateRange === 'Past 30 Days' ? 30 : 7;
				for (let i = 0; i < numberOfIterations; i++) {
					const newDate = new Date();
					newDate.setDate(now.getDate() - i);
					balanceOverTime.push({
						date: dateDayFormatter.format(newDate),
						balance: calculateBalance(newDate, 'day'),
					});
				}
				break;
			}
		}
	}

	$: {
		lineChart?.destroy();
		if (lineChartCanvas) {
			lineChart = new Chart(lineChartCanvas, {
				type: 'line',
				data: {
					labels: balanceOverTime.map((b) => b.date),
					datasets: [
						{
							label: 'Balance',
							data: balanceOverTime.map((b) => b.balance),
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

	const onResize = () => {
		lineChartCanvas.width = chartWrapper.clientWidth;
		lineChartCanvas.height = chartWrapper.clientHeight;
	};

	onMount(() => {
		addEventListener('resize', onResize);
	});
	1;
	onDestroy(() => {
		removeEventListener('resize', onResize);
	});
</script>

<canvas bind:this={lineChartCanvas} class="m-auto h-full w-full max-w-full" />
