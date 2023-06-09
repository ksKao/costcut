<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let buttonClassName = '';
	export let modal: HTMLDialogElement;
</script>

<button class={twMerge('btn-primary btn', buttonClassName)} on:click={() => modal.showModal()}>
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
