<script lang="ts">
	import { AlertCircle } from 'lucide-svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import { onMount, getContext, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { z } from 'zod';
	import { AuthErrorCodes, sendPasswordResetEmail } from 'firebase/auth';
	import { auth } from '../lib/firebase';
	import { FirebaseError } from 'firebase/app';

	const authModalStore = getContext<Writable<HTMLDialogElement | undefined>>('authModalStore');
	const schema = z
		.string()
		.min(1, { message: 'Email is required' })
		.email({ message: 'Invalid email' });

	let error = '';
	let isLoading = false;
	let email = '';
	let alert: {
		message: string;
		type: 'error' | 'success';
	} = {
		message: '',
		type: 'success',
	};

	const handleSubmit = async () => {
		error = '';
		alert = {
			message: '',
			type: 'success',
		};
		const parsedInput = schema.safeParse(email);

		if (!parsedInput.success) {
			error = parsedInput.error.flatten().formErrors[0];
			return;
		}

		try {
			isLoading = true;
			await sendPasswordResetEmail(auth, email);
			alert = {
				message: 'Please check your email for a password reset link.',
				type: 'success',
			};
			email = '';
		} catch (e) {
			if (e instanceof FirebaseError) {
				switch (e.code) {
					case AuthErrorCodes.INVALID_EMAIL:
						alert.message = 'Invalid email';
						break;
					case AuthErrorCodes.USER_DELETED:
						alert.message = 'Account does not exist. Please sign up.';
						break;
					case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
						alert.message = 'Too many attempts. Please try again later.';
						break;
					default:
						alert.message = 'Something went wrong. Please try again later.';
				}
			} else {
				alert.message = 'Something went wrong. Please try again later.';
			}
			alert.type = 'error';
		} finally {
			isLoading = false;
		}
	};

	const clearForm = () => {
		email = '';
		error = '';
		alert.message = '';
	};

	onMount(() => $authModalStore?.addEventListener('close', clearForm));
	onDestroy(() => $authModalStore?.removeEventListener('close', clearForm));
</script>

<h1 class="my-4 w-full text-center text-xl font-bold">Password Reset</h1>
<form on:submit|preventDefault={handleSubmit}>
	{#if alert.message}
		<div class={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
			<AlertCircle />
			{alert.message}
		</div>
	{/if}
	<Input
		type="text"
		name="email"
		id="email"
		placeholder="example@email.com"
		label="Email"
		errorMessage={error}
		bind:value={email}
	/>
	<Button class="mt-6 w-full" {isLoading}>Submit</Button>
</form>
