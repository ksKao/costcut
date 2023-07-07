<script lang="ts">
	import { createDialog } from 'svelte-headlessui';
	import { setContext } from 'svelte';
	import { theme } from '../../stores/theme';
	import { fade, scale } from 'svelte/transition';

	export let buttonClassName: string | undefined = undefined;
	export let key;
	const modal = createDialog();

	setContext(key, modal);
</script>

<button class={buttonClassName || 'btn-primary btn'} on:click={() => modal.open()} type="button">
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
					class={`max-h-[90vh] w-full max-w-md transform overflow-y-auto rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all ${
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
