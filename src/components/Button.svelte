<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {
		isLoading?: boolean;
	}

	export let isLoading = false;
</script>

<button
	on:click
	{...$$restProps}
	class={twMerge(
		'btn-primary btn disabled:bg-primary/60 disabled:text-primary-content/60',
		$$restProps.class
	)}
	disabled={$$restProps.disabled || isLoading}
>
	{#if isLoading}
		<span class="loading loading-spinner" />
	{:else}
		<slot />
	{/if}
</button>
