<script lang="ts">
	import toast from 'svelte-french-toast';
	import Button from '../components/common/Button.svelte';
	import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
	import { user } from '../stores/auth';

	let newPassword = '';
	let currentPassword = '';
	let changePasswordLoading = false;

	const changePassword = async () => {
		if (!newPassword || !$user) return;
		if (newPassword.length < 6) {
			toast.error('Password must be at least 6 characters.');
			return;
		}
		if (currentPassword === newPassword) {
			toast.error('New password cannot be the same as current password.');
			return;
		}
		if (!$user.email) {
			toast.error('Current user does not have an email');
			return;
		}

		try {
			changePasswordLoading = true;
			const credentials = EmailAuthProvider.credential($user.email, currentPassword);
			await reauthenticateWithCredential($user, credentials);
			await updatePassword($user, newPassword);
			toast.success('Your password has been updated');
			newPassword = '';
			currentPassword = '';
		} catch (e: any) {
			if ((e?.message as string).includes('wrong-password'))
				toast.error('Current password is incorrect');
			else toast.error('Something went wrong. Please try again later.');
		} finally {
			changePasswordLoading = false;
		}
	};
</script>

<h1 class="mb-4 text-xl font-bold lg:text-2xl">Settings</h1>

<h2 class="mb-4 text-lg font-semibold lg:text-xl">Change Password</h2>
<form on:submit|preventDefault={changePassword}>
	<div class="form-control mb-2">
		<label class="label" for="currentPassword">
			<span class="label-text">Current Password</span>
		</label>
		<input
			placeholder="●●●●●●●●"
			id="currentPassword"
			type="password"
			class="input-bordered input max-w-[300px]"
			bind:value={currentPassword}
		/>
	</div>
	<div class="form-control">
		<label class="label" for="newPassword">
			<span class="label-text">New Password</span>
		</label>
		<div class="flex gap-4">
			<input
				placeholder="●●●●●●●●"
				id="newPassword"
				type="password"
				class="input-bordered input w-[300px] max-w-[300px]"
				bind:value={newPassword}
			/>
			<Button isLoading={changePasswordLoading}>Change</Button>
		</div>
	</div>
</form>
