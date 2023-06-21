<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { createDialog } from 'svelte-headlessui';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { theme } from '../stores/theme';
	import { fade, scale } from 'svelte/transition';

	export let buttonClassName = '';
	export let key;
	const modal = createDialog();

	setContext(key, modal);
</script>

<button
	class={twMerge('btn-primary btn', buttonClassName)}
	on:click={() => modal.open()}
	type="button"
>
	<slot name="button">Open Modal</slot>
</button>
<div class="relative z-10">
	{#if $modal.expanded}
		<button
			class="fixed inset-0 bg-black bg-opacity-25"
			on:click={() => {
				modal.close();
			}}
		/>

		<div class="fixed inset-0 overflow-y-auto">
			<div
				class="flex min-h-full items-center justify-center p-4 text-center"
				transition:scale={{
					duration: 200,
					start: 0.8,
				}}
			>
				<div
					class={`w-full max-w-md transform rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all ${
						$theme === 'dark' ? 'text-white' : 'text-black'
					}`}
					use:modal.modal
					transition:fade={{
						duration: 200,
					}}
				>
					<slot>Modal content</slot>
				</div>
			</div>
		</div>
	{/if}
</div>
