<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	interface $$Props extends HTMLInputAttributes {
		errorMessage?: string;
		label?: string;
	}

	export let errorMessage = '';
	export let label = '';
	export let value = '';
</script>

<div class="form-control w-full">
	<label class="label" for={$$restProps.id}>
		<span class="label-text">{label}</span>
		<span class="label-text-alt">
			<slot name="top-right" />
		</span>
	</label>
	<input
		class={twMerge(
			`input w-full ${errorMessage ? 'input-error' : 'input-bordered'}`,
			$$restProps.class
		)}
		{...$$restProps}
		bind:value
	/>
	<label class="label" for={$$restProps.id}>
		<span class="label-text-alt text-error">{errorMessage}</span>
		<span class="label-text-alt">
			<slot name="bottom-right" />
		</span>
	</label>
</div>
