<script lang="ts">
	import Dashboard from './pages/Dashboard.svelte';
	import Transactions from './pages/Transactions.svelte';
	import Charts from './pages/Charts.svelte';
	import Settings from './pages/Settings.svelte';
	import Navbar from './components/Navbar.svelte';
	import EmailVerification from './pages/EmailVerification.svelte';
	import Router from 'svelte-spa-router';
	import { querystring, replace } from 'svelte-spa-router';
	import PasswordReset from './pages/PasswordReset.svelte';

	const routes = {
		'/': Dashboard,
		'/transactions': Transactions,
		'/charts': Charts,
		'/settings': Settings,
		'/email-verification': EmailVerification,
		'/password-reset': PasswordReset,
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

<div class="flex">
	<Navbar />
	<main class="flex-grow">
		<Router {routes} />
	</main>
</div>
