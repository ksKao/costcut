<script lang="ts">
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	let isLoading = false;
	let email = '';
</script>

<h1 class="my-4 w-full text-center text-xl font-bold">Login</h1>
<Input
	type="text"
	errorMessage=""
	placeholder="example@email.com"
	label="Email"
	id="email"
	bind:value={email}
/>
<Button class="w-full" {isLoading} on:click={() => (isLoading = true)}>Login</Button>
