<script lang="ts">
	import { querystring, replace } from 'svelte-spa-router';
	import { firebaseConfig } from '../lib/firebase';
	import Input from '../components/common/Input.svelte';
	import Button from '../components/common/Button.svelte';
	import { z } from 'zod';
	import { AlertCircle } from 'lucide-svelte';

	const schema = z
		.string()
		.min(1, { message: 'Password is required.' })
		.min(6, { message: 'Password must be at least 6 characters long.' });

	let isLoading = false;
	let password = '';
	let error = '';
	let alert: {
		message: string;
		type: 'success' | 'error';
	} = {
		message: '',
		type: 'error',
	};

	const handleSubmit = async () => {
		// if user has already reset password, don't allow them to reset again
		if (alert.type === 'success') return;

		error = '';
		alert = {
			message: '',
			type: 'error',
		};

		const parsedInput = schema.safeParse(password);

		if (!parsedInput.success) {
			error = parsedInput.error.issues[0].message;
			return;
		}

		try {
			isLoading = true;
			const queryObject = Object.fromEntries(new URLSearchParams($querystring));
			const code = queryObject['code'];

			const res = await fetch(
				`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${firebaseConfig.apiKey}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						oobCode: code,
						newPassword: password,
					}),
				}
			);

			const data = await res.json();

			if (data.error) {
				alert.type = 'error';
				switch (data.error.message) {
					case 'MISSING_OOB_CODE':
					case 'INVALID_OOB_CODE':
						alert.message = 'The password reset link is invalid';
						break;
					case 'EXPIRED_OOB_CODE':
						alert.message = 'The password reset link has expired.';
						break;
					default:
						alert.message = 'Something went wrong. Please try again later.';
						break;
				}
			} else {
				alert = {
					message: 'Password reset successfully.',
					type: 'success',
				};
				password = '';
			}
		} catch (e) {
			alert = {
				message: 'Something went wrong. Please try again later.',
				type: 'error',
			};
		} finally {
			isLoading = false;
		}
	};
</script>

<div
	class="card absolute left-1/2 top-1/2 w-96 max-w-[80vw] -translate-x-1/2 -translate-y-1/2 bg-base-100 shadow-xl"
>
	<div class="card-body gap-4">
		<h2 class="card-title justify-center">Password Reset</h2>
		<div class="card-actions flex-grow justify-center">
			<form on:submit|preventDefault={handleSubmit} class="w-full">
				{#if alert.message}
					<div
						class={`alert ${
							alert.type === 'success' ? 'alert-success' : 'alert-error'
						}`}
					>
						<AlertCircle />
						{alert.message}
					</div>
				{/if}
				<Input
					type="password"
					label="New Password"
					placeholder="●●●●●●●●"
					name="newPassword"
					id="newPassword"
					errorMessage={error}
					bind:value={password}
				/>
				{#if alert.type === 'success'}
					<Button type="button" class="mt-6 w-full" on:click={() => replace('/')}>
						Go to Dashboard
					</Button>
				{:else}
					<Button {isLoading} class="mt-6 w-full">Reset</Button>
				{/if}
			</form>
		</div>
	</div>
</div>
