<script lang="ts">
	import Modal from '../components/Modal.svelte';
	import AddTransactionForm from '../components/AddTransactionForm.svelte';
	import { filteredTransactions, transactions } from '../stores/transaction';
	import ManageCategoryForm from '../components/ManageCategoryForm.svelte';
	import { onMount } from 'svelte';
	import { filter } from '../stores/filter';
	import Chart from 'chart.js/auto';

	let pieChartCanvas: HTMLCanvasElement;
	let barChartCanvas: HTMLCanvasElement;

	Chart.overrides['pie'].plugins.legend.display = false;

	$: pieChartCanvas &&
		new Chart(pieChartCanvas, {
			type: 'pie',
			data: {
				labels: ['Red', 'Blue', 'Yellow'],
				datasets: [
					{
						data: [300, 50, 100],
						backgroundColor: [
							'rgb(255, 99, 132)',
							'rgb(54, 162, 235)',
							'rgb(255, 205, 86)',
						],
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

	$: barChartCanvas &&
		new Chart(barChartCanvas, {
			type: 'bar',
			data: {
				labels: ['Red', 'Blue', 'Yellow'],
				datasets: [
					{
						label: '',
						data: [300, 50, 100],
						backgroundColor: [
							'rgb(255, 99, 132)',
							'rgb(54, 162, 235)',
							'rgb(255, 205, 86)',
						],
					},
				],
			},
			options: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false,
					},
				},
			},
		});

	$: netIncomeThisMonth = $transactions?.transactions
		.filter((t) => t.date.getMonth() === new Date().getMonth())
		.reduce((acc, t) => acc + t.amount, 0);

	onMount(() => {
		$filter.order = 'desc';
		$filter.sort = 'date';
	});
</script>

{#if $filteredTransactions === null}
	<div class="flex h-full w-full items-center justify-center">
		<span class="loading loading-spinner" />
	</div>
{:else}
	<div class="flex h-full flex-col gap-4 lg:flex-row-reverse">
		<div class="flex flex-col justify-between gap-6 lg:w-72 2xl:w-96">
			<h1 class="text-2xl font-bold lg:hidden">Dashboard</h1>
			<div>
				<Modal key="addTransactionModal" buttonClassName="w-full btn btn-primary my-2">
					<svelte:fragment slot="button">Add Transaction</svelte:fragment>
					<AddTransactionForm />
				</Modal>
				<Modal key="manageCategoryModal" buttonClassName="w-full btn btn-primary my-2">
					<svelte:fragment slot="button">Manage Category</svelte:fragment>
					<ManageCategoryForm />
				</Modal>
			</div>
			{#if netIncomeThisMonth !== undefined && $transactions?.transactions && $transactions.transactions.length > 0}
				<div class="rounded-md border-2 border-gray-500 p-4">
					<h2 class="text-xl font-bold">
						Net Income ({new Date().toLocaleString('en-US', {
							month: 'short',
							year: 'numeric',
						})})
					</h2>
					<p
						class={`mt-2 text-6xl ${
							netIncomeThisMonth > 0
								? 'text-success'
								: netIncomeThisMonth < 0
								? 'text-error'
								: ''
						} overflow-hidden overflow-ellipsis`}
					>
						{netIncomeThisMonth.toFixed(2)}
					</p>
				</div>
				<div class="flex w-full flex-grow flex-col items-center justify-center">
					<h2 class="my-4 text-center text-xl font-bold">Spendings by Categories</h2>
					<canvas bind:this={pieChartCanvas} class="max-h-[450px] max-w-[450px]" />
				</div>
			{/if}
		</div>
		<div class="flex flex-grow flex-col justify-between gap-4">
			<h1 class="hidden text-2xl font-bold lg:block">Dashboard</h1>
			{#if $transactions !== null}
				{#if $transactions.transactions.length === 0}
					<div class="flex h-full items-center justify-center">
						You have no transactions. Add one to get started.
					</div>
				{:else}
					<div class="max-h-[50vh] w-full">
						<h2 class="text-center text-xl font-bold">Savings past 12 months</h2>
						<canvas bind:this={barChartCanvas} class="my-6" />
					</div>
					<div class="max-w-[100vw] overflow-x-auto">
						<h2 class="my-2 text-xl font-bold">Recent Transactions</h2>
						<table class="table-zebra table">
							<thead>
								<tr>
									<th>Date</th>
									<th>Description</th>
									<th>Category</th>
									<th>Payee</th>
									<th>Amount</th>
									<th>Balance</th>
								</tr></thead
							>
							<tbody>
								{#each $filteredTransactions.slice(0, 5) as transaction}
									<tr>
										<td
											>{new Intl.DateTimeFormat('en-UK').format(
												transaction.date
											)}</td
										>
										<td>{transaction.description}</td>
										<td>{transaction.category?.name ?? 'Uncategorized'}</td>
										<td>{transaction.payee}</td>
										<td
											class={`${
												transaction.amount > 0
													? 'text-success'
													: 'text-error'
											}`}
										>
											{transaction.amount}
										</td>
										<td>{transaction.balance}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			{:else}
				<span class="loading loading-spinner" />
			{/if}
		</div>
	</div>
{/if}
