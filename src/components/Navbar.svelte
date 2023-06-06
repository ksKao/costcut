<script lang="ts">
	import { Link } from 'svelte-routing';
	import { onMount, onDestroy } from 'svelte';
	import { globalHistory } from 'svelte-routing/src/history';
	import { user } from '../stores/auth';
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import { auth } from '../lib/firebase';

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

		{#if $user === undefined}
			<span> Loading... </span>
		{:else if $user !== null}
			<button
				on:click={() => {
					signOut(auth);
				}}>Logout</button
			>
			<span> {$user.email} </span>
		{:else}
			<button
				on:click={() => {
					// login logic here
				}}
			>
				Login
			</button>
		{/if}
	{/if}
</div>
