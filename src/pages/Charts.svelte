<script lang="ts">
	import SpendingByCategoryChart from '../components/charts/SpendingByCategoryChart.svelte';
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
		<div class="h-fit rounded-md border-2 border-gray-500 p-4 lg:rounded-lg">
			<SpendingByCategoryChart />
		</div>
	</div>
{/if}
