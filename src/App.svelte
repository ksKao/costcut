<script lang="ts">
	import Dashboard from './pages/Dashboard.svelte';
	import Transactions from './pages/Transactions.svelte';
	import Charts from './pages/Charts.svelte';
	import Settings from './pages/Settings.svelte';
	import Navbar from './components/Navbar.svelte';
	import EmailVerification from './pages/EmailVerification.svelte';
	import Router from 'svelte-spa-router';

	const routes = {
		'/': Dashboard,
		'/transactions': Transactions,
		'/charts': Charts,
		'/settings': Settings,
		'/email-verification': EmailVerification,
	};
</script>

<div class="flex">
	<Navbar />
	<main>
		<Router {routes} />
	</main>
</div>
