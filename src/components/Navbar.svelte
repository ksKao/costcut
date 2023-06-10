<script lang="ts">
	import { user } from '../stores/auth';
	import { signOut } from 'firebase/auth';
	import { auth } from '../lib/firebase';
	import {
		LayoutDashboard,
		ArrowRightLeft,
		BarChart3,
		Settings,
		LogOut,
		Sun,
		Moon,
	} from 'lucide-svelte';
	import { theme } from '../stores/theme';
	import Modal from './Modal.svelte';
	import Auth from './Auth.svelte';
	import { link, location } from 'svelte-spa-router';
	import active from 'svelte-spa-router/active';

	const noNavbarRoutes = ['/password-reset', '/email-verification'];
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

	let themeButtonChecked = $theme === 'light';

	$: {
		$theme = themeButtonChecked ? 'light' : 'dark';
	}
</script>

{#if !noNavbarRoutes.includes($location)}
	<nav class="flex min-h-screen min-w-[256px] flex-col justify-between bg-base-200 p-6">
		<a href="/" class="mt-6 flex items-center justify-center gap-4" use:link>
			<img src="/logo.png" alt="logo" class="h-10 w-10" />
			<h1 class="text-2xl font-bold">Costcut</h1>
		</a>
		<div class="flex flex-col gap-1">
			{#each navbarItems as navbarItem}
				<a
					href={navbarItem.path}
					class="flex w-full items-center gap-4 rounded-md p-4 font-semibold hover:bg-primary hover:text-white"
					use:link
					use:active={{
						className: 'bg-primary text-white',
					}}
				>
					<svelte:component this={navbarItem.icon} class="h-6 w-6" />
					<span>{navbarItem.name}</span>
				</a>
			{/each}
		</div>
		<div>
			<div class="divider" />
			<div class="flex h-10 w-full items-center justify-between gap-4">
				<!-- Theme switcher -->
				<label class="swap swap-rotate">
					<input type="checkbox" bind:checked={themeButtonChecked} />
					<Sun class="swap-on fill-current" />
					<Moon class="swap-off fill-current" />
				</label>
				<!-- User -->
				{#if $user === undefined}
					<div class="flex flex-grow items-center justify-center">
						<span class="loading loading-spinner" />
					</div>
				{:else if $user !== null}
					<div class="flex flex-grow items-center justify-between">
						<span class="w-20 flex-grow overflow-hidden overflow-ellipsis text-center">
							{$user.displayName ?? $user.email?.split('@')[0] ?? 'User'}
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
				{/if}
				<Modal buttonClassName={`flex-grow ${$user === null ? 'block' : 'hidden'}`}>
					<svelte:fragment slot="button">Login</svelte:fragment>
					<Auth />
				</Modal>
			</div>
		</div>
	</nav>
{/if}
