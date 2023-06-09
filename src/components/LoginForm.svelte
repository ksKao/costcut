<script lang="ts">
	import { AuthErrorCodes, signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import { z } from 'zod';
	import { auth } from '../lib/firebase';
	import { FirebaseError } from 'firebase/app';
	import { AlertCircle } from 'lucide-svelte';

	const emptyError = {
		email: '',
		password: '',
		general: '',
	};

	let isLoading = false;
	let email = '';
	let password = '';
	let error = { ...emptyError };

	export let modal: HTMLDialogElement;

	const schema = z.object({
		email: z
			.string()
			.min(1, { message: 'Email is required' })
			.email({ message: 'Invalid email' }),
		password: z.string().min(1, { message: 'Password is required' }),
	});

	const handleSubmit = async () => {
		error = { ...emptyError };

		const parsedInput = schema.safeParse({
			email,
			password,
		});

		if (!parsedInput.success) {
			const flattened = parsedInput.error.flatten();
			error = {
				email: flattened.fieldErrors.email?.[0] ?? '',
				password: flattened.fieldErrors.password?.[0] ?? '',
				general: '',
			};
			return;
		}

		try {
			isLoading = true;
			await signInWithEmailAndPassword(auth, email, password);
			email = '';
			password = '';
			modal.close();
		} catch (e) {
			if (e instanceof FirebaseError) {
				switch (e.code) {
					case AuthErrorCodes.USER_DELETED:
					case AuthErrorCodes.INVALID_PASSWORD:
						error.general = 'Invalid email or password';
						break;
					case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
						error.general = 'Too many attempts. Please try again later.';
						break;
					default:
						error.general = 'Something went wrong. Please try again.';
						break;
				}
			} else {
				error.general = 'Something went wrong. Please try again.';
			}
		} finally {
			isLoading = false;
		}
	};
</script>

<h1 class="my-4 w-full text-center text-xl font-bold">Login</h1>
<form on:submit|preventDefault={handleSubmit}>
	{#if error.general}
		<div class="alert alert-error">
			<AlertCircle />
			{error.general}
		</div>
	{/if}
	<Input
		type="text"
		errorMessage={error.email}
		placeholder="example@email.com"
		label="Email"
		id="email"
		bind:value={email}
	/>
	<Input
		type="password"
		errorMessage={error.password}
		placeholder="●●●●●●●●"
		label="Password"
		id="password"
		bind:value={password}
	/>
	<Button class="w-full" {isLoading}>Login</Button>
</form>
