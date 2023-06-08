<script lang="ts">
	import { Link } from 'svelte-routing';
	import { user } from '../stores/auth';
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import { auth } from '../lib/firebase';
	import { LayoutDashboard, ArrowRightLeft, BarChart3, Settings, LogOut, Sun, Moon } from 'lucide-svelte';
	import { theme } from '../stores/theme';
	import Modal from './Modal.svelte';
	import Auth from './Auth.svelte';

	let themeButtonChecked = false;

	$: {
		$theme = themeButtonChecked ? 'light' : 'dark';
	}

	const navbarItems = [
		{
			name: 'Dashboard',
			path: '/',
			icon: LayoutDashboard,
		},
		{
			name: 'Transactions',
			path: '/transactions',
			icon: ArrowRightLeft,
		},
		{
			name: 'Charts',
			path: '/charts',
			icon: BarChart3,
		},
		{
			name: 'Settings',
			path: '/settings',
			icon: Settings,
		},
	];
</script>

<nav class="flex h-screen w-64 flex-col justify-between bg-base-200 p-6">
	<Link to="/" class="mt-6 flex items-center justify-center gap-4">
		<img src="/logo.png" alt="logo" class="h-10 w-10" />
		<h1 class="text-2xl font-bold">Costcut</h1>
	</Link>
	<div class="flex flex-col gap-1">
		{#each navbarItems as navbarItem}
			<Link to={navbarItem.path} let:active>
				<div
					class={`flex w-full items-center gap-4 rounded-md p-4 font-semibold hover:bg-primary hover:text-white ${
						active ? 'bg-primary text-white' : ''
					}`}
				>
					<svelte:component this={navbarItem.icon} class="h-6 w-6" />
					<span>{navbarItem.name}</span>
				</div>
			</Link>
		{/each}
	</div>
	<div>
		<div class="divider" />
		<div class="flex h-10 w-full items-center justify-between gap-4">
			<!-- Theme switcher -->
			<label class="swap-rotate swap">
				<input type="checkbox" bind:checked={themeButtonChecked} />
				<Sun class="swap-on fill-current" />
				<Moon class="swap-off fill-current" />
			</label>
			<!-- User -->
			{#if $user === undefined}
				<span class="loading loading-spinner" />
			{:else if $user !== null}
				<div class="flex flex-grow items-center justify-between">
					<span class="w-20 flex-grow overflow-hidden overflow-ellipsis text-center">
						{$user.displayName ?? $user.email.split('@')[0]}
					</span>
					<button
						on:click={() => {
							signOut(auth);
						}}
						class="btn-circle btn"
					>
						<LogOut />
					</button>
				</div>
			{:else}
				<Modal buttonClassName="flex-grow">
					<svelte:fragment slot="button">Login</svelte:fragment>
					<Auth />
				</Modal>
			{/if}
		</div>
	</div>
</nav>
