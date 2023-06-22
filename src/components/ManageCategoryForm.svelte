<script lang="ts">
	import { transactionStore } from '../stores/transaction';
	import { Plus } from 'lucide-svelte';
	import Button from './Button.svelte';
	import { addCategory } from '../lib/utils';
	import toast from 'svelte-french-toast';

	let newCategory = '';
	let isLoading = false;

	const handleSubmit = async () => {
		isLoading = true;
		const res = await addCategory(newCategory);
		if (!res.success) toast.error(res.errorMessage);
		else newCategory = '';
		isLoading = false;
	};
</script>

<h1 class="mb-4 text-xl font-bold">Manage Category</h1>
{#if $transactionStore === null}
	<p>Loading...</p>
{:else}
	<form class="flex gap-2" on:submit|preventDefault={handleSubmit}>
		<input
			placeholder="New Category"
			class="input-bordered input flex-grow"
			bind:value={newCategory}
		/>
		<Button {isLoading}><Plus /></Button>
	</form>
	{#each $transactionStore.categories as category}
		<p>{category.name}</p>
	{/each}
{/if}
