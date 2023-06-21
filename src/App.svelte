<script lang="ts">
	import Dashboard from './pages/Dashboard.svelte';
	import Transactions from './pages/Transactions.svelte';
	import Charts from './pages/Charts.svelte';
	import Settings from './pages/Settings.svelte';
	import Navbar from './components/Navbar.svelte';
	import EmailVerification from './pages/EmailVerification.svelte';
	import Router from 'svelte-spa-router';
	import { querystring, replace, location } from 'svelte-spa-router';
	import PasswordReset from './pages/PasswordReset.svelte';
	import Auth from './components/Auth.svelte';
	import { setContext } from 'svelte';
	import { createDialog } from 'svelte-headlessui';
	import { theme } from './stores/theme';
	import { fade, scale } from 'svelte/transition';
	import { Toaster } from 'svelte-french-toast';

	const noNavbarRoutes = ['/password-reset', '/email-verification'];
	const routes = {
		'/': Dashboard,
		'/transactions': Transactions,
		'/charts': Charts,
		'/settings': Settings,
		'/email-verification': EmailVerification,
		'/password-reset': PasswordReset,
	};

	const authModal = createDialog();

	setContext('authModal', authModal);

	$: {
		const queryObject = Object.fromEntries(new URLSearchParams($querystring).entries());
		if (queryObject['mode'] === 'verifyEmail' && queryObject['oobCode']) {
			replace(`/email-verification?code=${queryObject['oobCode']}`);
		} else if (queryObject['mode'] === 'resetPassword' && queryObject['oobCode']) {
			replace(`/password-reset?code=${queryObject['oobCode']}`);
		}
	}
</script>

<Toaster />
<div class="flex">
	{#if !noNavbarRoutes.includes($location)}
		<div class="relative z-10">
			{#if $authModal.expanded}
				<button
					class="fixed inset-0 bg-black bg-opacity-25"
					on:click={() => {
						authModal.close();
					}}
					transition:fade={{
						duration: 100,
					}}
				/>
				<div class="fixed inset-0 overflow-y-auto">
					<div
						class="flex min-h-full items-center justify-center p-4 text-center"
						transition:scale={{ duration: 200, start: 0.8 }}
					>
						<div
							class={`w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all ${
								$theme === 'dark' ? 'text-white' : 'text-black'
							}`}
							use:authModal.modal
							transition:fade={{
								duration: 200,
							}}
						>
							<Auth />
						</div>
					</div>
				</div>
			{/if}
		</div>
		<Navbar>
			<main class="flex-grow">
				<Router {routes} />
			</main>
		</Navbar>
	{:else}
		<main class="flex-grow">
			<Router {routes} />
		</main>
	{/if}
</div>
