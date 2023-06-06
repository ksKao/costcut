<script lang="ts">
	import { Router, Link, Route } from 'svelte-routing';
	import Dashboard from './pages/Dashboard.svelte';
	import Transactions from './pages/Transactions.svelte';
	import Charts from './pages/Charts.svelte';
	import Settings from './pages/Settings.svelte';
	import Login from './pages/Login.svelte';
	import Register from './pages/Register.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { globalHistory } from 'svelte-routing/src/history';
	import Navbar from './components/Navbar.svelte';

	export let url = '/';
</script>

<Router {url}>
	<Navbar />
	<div>
		<Route path="/" component={Dashboard} />
		<Route path="transactions" component={Transactions} />
		<Route path="charts" component={Charts} />
		<Route path="settings" component={Settings} />
		<Route path="login" component={Login} />
		<Route path="register" component={Register} />
	</div>
</Router>
