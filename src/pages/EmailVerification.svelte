<script lang="ts">
	import { querystring, replace } from 'svelte-spa-router';
	import { onMount } from 'svelte';
	import { firebaseConfig } from '../lib/firebase';

	let isLoading = true;
	let message = '';

	onMount(async () => {
		const queryObject = Object.fromEntries(new URLSearchParams($querystring).entries());
		const code = queryObject['code'];

		const res = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebaseConfig.apiKey}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					oobCode: code,
				}),
			}
		);

		const data = await res.json();

		if (data.emailVerified) message = 'Your email has been verified.';
		else message = 'Your email could not be verified. Please try again.';

		isLoading = false;
	});
</script>

<div
	class="card absolute left-1/2 top-1/2 w-96 max-w-[80vw] -translate-x-1/2 -translate-y-1/2 bg-base-100 shadow-xl"
>
	<div class="card-body gap-4">
		<h2 class="card-title justify-center">Email Verification</h2>
		{#if isLoading}
			<div class="my-5 flex w-full items-center justify-center">
				<span class="loading loading-spinner" />
			</div>
		{:else}
			<div class="text-center">
				{message}
			</div>
			<div class="card-actions justify-center">
				<button class="btn-primary btn" on:click={() => replace('/')}> Dashboard </button>
			</div>
		{/if}
	</div>
</div>
