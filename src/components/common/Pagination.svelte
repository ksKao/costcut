<script lang="ts">
	import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-svelte';
	import { filter } from '../../stores/filter';
	import { transactions } from '../../stores/transaction';

	const displayedPageNumbers: number[] = [];

	$: currentPage = Math.floor($filter.skip / $filter.itemsPerPage + 1);
	$: numberOfPages = Math.ceil(($transactions?.count ?? 0) / $filter.itemsPerPage);
	$: {
		displayedPageNumbers.length = 0;
		for (let i = currentPage - 2; i <= currentPage + 2; i++) {
			if (i > 0 && i <= numberOfPages) displayedPageNumbers.push(i);
		}
	}
</script>

{#if $transactions && $transactions.count > $filter.itemsPerPage}
	<div class="flex flex-wrap justify-center gap-1">
		<button
			class={`btn-circle btn ${currentPage === 1 ? 'btn-disabled' : ''}`}
			on:click={() => ($filter.skip = 0)}
			disabled={currentPage === 1}
		>
			<ChevronsLeft class="h-4 w-4" />
		</button>
		<button
			class={`btn-circle btn ${currentPage === 1 ? 'btn-disabled' : ''}`}
			on:click={() => {
				$filter.skip -= $filter.itemsPerPage;
			}}
			disabled={currentPage === 1}
		>
			<ChevronLeft class="h-4 w-4" />
		</button>
		{#each displayedPageNumbers as i}
			<button
				class={`btn-circle btn ${currentPage === i ? 'btn-primary' : ''}`}
				on:click={() => ($filter.skip = (i - 1) * $filter.itemsPerPage)}
			>
				{i}
			</button>
		{/each}
		<button
			class={`btn-circle btn ${currentPage >= numberOfPages ? 'btn-disabled' : ''}`}
			on:click={() => {
				$filter.skip += $filter.itemsPerPage;
			}}
			disabled={currentPage >= numberOfPages}
		>
			<ChevronRight class="h-4 w-4" />
		</button>

		<button
			class="btn-circle btn"
			on:click={() => ($filter.skip = (numberOfPages - 1) * $filter.itemsPerPage)}
			disabled={currentPage >= numberOfPages}
		>
			<ChevronsRight class="h-4 w-4" />
		</button>
	</div>
{/if}
