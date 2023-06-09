<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	let modal: HTMLDialogElement | undefined = undefined;

	export let buttonClassName = '';

	const modalContext = writable<HTMLDialogElement | undefined>(modal);

	$: modalContext.set(modal);

	setContext('modal', modalContext);
</script>

<button class={twMerge('btn-primary btn', buttonClassName)} on:click={() => modal?.showModal()}>
	<slot name="button">Open Modal</slot>
</button>
<dialog class="modal" bind:this={modal}>
	<div class="modal-box">
		<slot><p>Modal Content</p></slot>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
