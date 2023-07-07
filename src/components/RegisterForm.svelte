<script lang="ts">
	import { AlertCircle } from 'lucide-svelte';
	import Button from './common/Button.svelte';
	import Input from './common/Input.svelte';
	import { z } from 'zod';
	import {
		AuthErrorCodes,
		createUserWithEmailAndPassword,
		sendEmailVerification,
	} from 'firebase/auth';
	import { auth } from '../lib/firebase';
	import { FirebaseError } from 'firebase/app';
	import { getContext } from 'svelte';
	import type { createDialog } from 'svelte-headlessui';

	const emptyError = {
		email: '',
		password: '',
		passwordConfirm: '',
	};
	const authModal = getContext<ReturnType<typeof createDialog>>('authModal');

	let email = '';
	let password = '';
	let passwordConfirm = '';
	let isLoading = false;
	let error = {
		email: '',
		password: '',
		passwordConfirm: '',
	};
	let alert: {
		message: string;
		type: 'success' | 'error';
	} = {
		message: '',
		type: 'success',
	};

	const schema = z
		.object({
			email: z
				.string()
				.min(1, { message: 'Email is required' })
				.email({ message: 'Invalid email' }),
			password: z
				.string()
				.min(1, { message: 'Password is required' })
				.min(6, { message: 'Password must be at least 6 characters' }),
			passwordConfirm: z.string().min(1, { message: 'Please confirm your password' }),
		})
		.superRefine((val, ctx) => {
			if (val.password !== val.passwordConfirm) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Passwords do not match',
					path: ['password'],
				});
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Passwords do not match',
					path: ['passwordConfirm'],
				});
			}
		});

	const handleSubmit = async () => {
		error = { ...emptyError };
		alert = {
			message: '',
			type: 'success',
		};

		const parsedInput = schema.safeParse({
			email,
			password,
			passwordConfirm,
		});

		if (!parsedInput.success) {
			const flattened = parsedInput.error.flatten();
			error = {
				email: flattened.fieldErrors.email?.[0] ?? '',
				password: flattened.fieldErrors.password?.[0] ?? '',
				passwordConfirm: flattened.fieldErrors.passwordConfirm?.[0] ?? '',
			};
			return;
		}

		try {
			isLoading = true;
			await createUserWithEmailAndPassword(auth, email, password);
			if (auth.currentUser) {
				await sendEmailVerification(auth.currentUser);
				alert.type = 'success';
				alert.message = 'Please check your email to verify your account.';
			}
			email = '';
			password = '';
			passwordConfirm = '';
		} catch (e) {
			alert.type = 'error';
			if (e instanceof FirebaseError) {
				switch (e.code) {
					case AuthErrorCodes.EMAIL_EXISTS:
						alert.message = 'Email already exists';
						break;
					case AuthErrorCodes.INVALID_EMAIL:
						alert.message = 'Invalid email';
						break;
					case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
						alert.message = 'Too many attempts. Please try again later.';
						break;
					default:
						alert.message = 'Something went wrong. Please try again.';
						break;
				}
			} else {
				alert.message = 'Something went wrong. Please try again.';
			}
		} finally {
			isLoading = false;
		}
	};

	const clearForm = () => {
		email = '';
		password = '';
		passwordConfirm = '';
		error = { ...emptyError };
		alert = {
			message: '',
			type: 'success',
		};
	};

	$: if ($authModal.expanded) clearForm();
</script>

<h1 class="my-4 w-full text-center text-xl font-bold">Register</h1>
<form on:submit|preventDefault={handleSubmit}>
	{#if alert.message}
		<div class={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
			<AlertCircle />
			{alert.message}
		</div>
	{/if}
	<Input
		type="text"
		placeholder="example@email.com"
		label="Email"
		id="email"
		errorMessage={error.email}
		bind:value={email}
	/>
	<Input
		type="password"
		placeholder="●●●●●●●●"
		label="Password"
		id="password"
		errorMessage={error.password}
		bind:value={password}
	/>
	<Input
		type="password"
		placeholder="●●●●●●●●"
		label="Confirm Password"
		id="passwordConfirm"
		errorMessage={error.passwordConfirm}
		bind:value={passwordConfirm}
	/>
	<Button class="mt-6 w-full" {isLoading}>Register</Button>
</form>
