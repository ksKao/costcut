<script lang="ts">
	import { Router, Route } from 'svelte-routing';
	import Dashboard from './pages/Dashboard.svelte';
	import Transactions from './pages/Transactions.svelte';
	import Charts from './pages/Charts.svelte';
	import Settings from './pages/Settings.svelte';
	import Navbar from './components/Navbar.svelte';

	export let url = '/';
</script>

<Router {url}>
	<div class="flex">
		<Navbar />
		<main>
			<Route path="/" component={Dashboard} />
			<Route path="transactions" component={Transactions} />
			<Route path="charts" component={Charts} />
			<Route path="settings" component={Settings} />
		</main>
	</div>
</Router>
