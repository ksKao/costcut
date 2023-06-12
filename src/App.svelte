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
	import { writable } from 'svelte/store';

	const noNavbarRoutes = ['/password-reset', '/email-verification'];
	const routes = {
		'/': Dashboard,
		'/transactions': Transactions,
		'/charts': Charts,
		'/settings': Settings,
		'/email-verification': EmailVerification,
		'/password-reset': PasswordReset,
	};

	let authModal: HTMLDialogElement | undefined = undefined;
	const authModalStore = writable<HTMLDialogElement | undefined>(authModal);

	$: authModalStore.set(authModal);

	setContext('authModalStore', authModalStore);

	$: {
		const queryObject = Object.fromEntries(new URLSearchParams($querystring).entries());
		if (queryObject['mode'] === 'verifyEmail' && queryObject['oobCode']) {
			replace(`/email-verification?code=${queryObject['oobCode']}`);
		} else if (queryObject['mode'] === 'resetPassword' && queryObject['oobCode']) {
			replace(`/password-reset?code=${queryObject['oobCode']}`);
		}
	}
</script>

<div class="flex">
	{#if !noNavbarRoutes.includes($location)}
		<dialog class="modal" bind:this={authModal}>
			<div class="modal-box">
				<Auth />
			</div>
			<form method="dialog" class="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
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
