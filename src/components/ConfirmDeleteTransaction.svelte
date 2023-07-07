<script lang="ts">
	import toast from 'svelte-french-toast';
	import { deleteTransaction } from '../lib/utils';
	import Button from './common/Button.svelte';
	import { getContext } from 'svelte';
	import type { createDialog } from 'svelte-headlessui';

	const confirmDeleteModal = getContext<ReturnType<typeof createDialog>>('confirmDeleteModal');

	export let transactionId: string;
	let isLoading = false;

	const handleSubmit = async () => {
		isLoading = true;
		const res = await deleteTransaction(transactionId);
		if (!res.success) {
			toast.error(res.errorMessage);
		} else {
			toast.success('Transaction deleted');
			confirmDeleteModal.close();
		}
		isLoading = false;
	};
</script>

<h1 class="mb-4 text-xl font-bold">Confirm Delete Transaction</h1>
<p class="mb-4">Are you sure you want to delete this transaction?</p>
<form on:submit|preventDefault={handleSubmit} class="flex justify-end">
	<Button {isLoading} class="btn-error ml-auto">Delete</Button>
</form>
