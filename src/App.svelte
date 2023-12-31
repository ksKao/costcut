<script lang="ts">
	import { setContext } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import { createDialog } from 'svelte-headlessui';
	import Router, { location, querystring, replace } from 'svelte-spa-router';
	import { fade, scale } from 'svelte/transition';
	import Auth from './components/AuthForm.svelte';
	import Navbar from './components/common/Navbar.svelte';
	import type { ItemInsertedEvent } from './lib/types';
	import Charts from './pages/Charts.svelte';
	import Dashboard from './pages/Dashboard.svelte';
	import EmailVerification from './pages/EmailVerification.svelte';
	import PasswordReset from './pages/PasswordReset.svelte';
	import Settings from './pages/Settings.svelte';
	import Transactions from './pages/Transactions.svelte';
	import { theme } from './stores/theme';

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

	const originalSetItem = localStorage.setItem;

	localStorage.setItem = function (key, value) {
		const event = new Event('localStorageChanged') as ItemInsertedEvent;

		event.value = value;
		event.key = key;

		document.dispatchEvent(event);

		originalSetItem.apply(this, [...arguments] as [key: string, value: string]);
	};

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
<div class="flex overflow-x-hidden">
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
			<main class="max-w-[100vw] flex-grow overflow-y-auto p-9 lg:h-screen">
				<Router {routes} />
			</main>
		</Navbar>
	{:else}
		<main class="flex-grow">
			<Router {routes} />
		</main>
	{/if}
</div>
