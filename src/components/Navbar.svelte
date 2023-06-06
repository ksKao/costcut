<script lang="ts">
	import { Link } from 'svelte-routing';
	import { user } from '../stores/auth';
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import { auth } from '../lib/firebase';
</script>

<nav class="h-screen w-64 bg-base-200">
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
</nav>
