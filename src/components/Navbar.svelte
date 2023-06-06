<script lang="ts">
	import { Link } from 'svelte-routing';
	import { onMount, onDestroy } from 'svelte';
	import { globalHistory } from 'svelte-routing/src/history';

	let pathname = window.location.pathname;
	let unsub: () => void;

	const noNavbarRoutes = ['/login', '/register'];

	onMount(() => {
		unsub = globalHistory.listen(({ location }) => {
			pathname = location.pathname;
		});
	});

	onDestroy(() => unsub());
</script>

<div>
	{#if !noNavbarRoutes.includes(pathname)}
		<Link to="/">Dashboard</Link>
		<Link to="transactions">Transactions</Link>
		<Link to="charts">Charts</Link>
		<Link to="settings">Settings</Link>
		<Link to="register">Register</Link>
		<Link to="login">Login</Link>
	{/if}
</div>
