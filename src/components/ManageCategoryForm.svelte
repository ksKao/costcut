<script lang="ts">
	import { Plus, Trash2, Pencil, Check, X } from 'lucide-svelte';
	import Button from './Button.svelte';
	import { addCategory, deleteCategory, editCategory } from '../lib/utils';
	import toast from 'svelte-french-toast';
	import { categories } from '../stores/category';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let newCategory = '';
	let isLoading = {
		addCategory: false,
		editCategory: false,
		deleteCategory: false,
	};
	let inputElements: Record<string, HTMLInputElement> = {};

	const handleAddCategory = async () => {
		if (!newCategory) return;
		isLoading.addCategory = true;
		const res = await addCategory(newCategory);
		if (!res.success) toast.error(res.errorMessage);
		else newCategory = '';
		isLoading.addCategory = false;
	};

	const handleEditCategory = async (id: string) => {
		if (!inputElements[id].value) {
			toast.error('Category name cannot be empty');
			return;
		} else if ($categories?.find((category) => category.name === inputElements[id].value)) {
			toast.error('Category name already exists');
			return;
		}
		isLoading.editCategory = true;
		const res = await editCategory(id, inputElements[id].value);
		if (!res.success) {
			toast.error(res.errorMessage);
		} else {
			inputElements[id].disabled = true;
			toast.success('Category name updated');
		}
		isLoading.editCategory = false;
	};

	const handleDeleteCategory = async (id: string) => {
		isLoading.deleteCategory = true;
		const res = await deleteCategory(id);
		if (!res.success) toast.error(res.errorMessage);
		else toast.success('Category deleted');
		isLoading.deleteCategory = false;
	};
</script>

<h1 class="mb-4 text-xl font-bold">Manage Category</h1>
{#if $categories === null}
	<div class="flex w-full items-center justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else}
	<form class="flex gap-2" on:submit|preventDefault={handleAddCategory}>
		<input
			placeholder="New Category"
			class="input-bordered input flex-grow"
			bind:value={newCategory}
		/>
		<Button isLoading={isLoading.addCategory}><Plus /></Button>
	</form>
	<ul class="mt-4">
		{#each $categories as category (category.id)}
			<li animate:flip>
				<form
					class="relative my-2 flex w-full"
					on:submit|preventDefault={() => handleEditCategory(category.id)}
				>
					<input
						class="input-bordered input flex-grow disabled:cursor-default"
						value={category.name}
						bind:this={inputElements[category.id]}
						disabled
					/>
					{#if inputElements[category.id]?.disabled && !isLoading.deleteCategory}
						<button
							class="absolute right-12 top-0 translate-y-1/2"
							on:click={() => {
								for (const inputElement of Object.values(inputElements)) {
									inputElement.disabled = true;
								}
								inputElements[category.id].disabled = false;
								inputElements[category.id].focus();
							}}
							type="button"
						>
							<span in:scale|local><Pencil /></span>
						</button>
						<button
							type="button"
							class="absolute right-4 top-0 translate-y-1/2"
							on:click={() => handleDeleteCategory(category.id)}
						>
							<span in:scale|local><Trash2 /></span>
						</button>
					{:else if isLoading.editCategory || isLoading.deleteCategory}
						<span
							class="loading loading-spinner absolute right-6 top-0 translate-y-1/2 text-base-content"
						/>
					{:else}
						<button class="absolute right-12 top-0 translate-y-1/2">
							<span in:scale|local><Check /></span>
						</button>
						<button
							type="button"
							class="absolute right-4 top-0 translate-y-1/2"
							on:click={() => {
								inputElements[category.id].value = category.name;
								inputElements[category.id].disabled = true;
							}}
						>
							<span in:scale|local><X /></span>
						</button>
					{/if}
				</form>
			</li>
		{/each}
	</ul>
{/if}
