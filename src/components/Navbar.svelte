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
		Menu,
	} from 'lucide-svelte';
	import { theme } from '../stores/theme';
	import { link } from 'svelte-spa-router';
	import active from 'svelte-spa-router/active';
	import { getContext } from 'svelte';
	import { createDialog } from 'svelte-headlessui';

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

	const authModal = getContext<ReturnType<typeof createDialog>>('authModal');

	let themeButtonChecked = $theme === 'light';
	let navToggle: HTMLInputElement;

	$: $theme = themeButtonChecked ? 'light' : 'dark';
</script>

<div class="drawer lg:drawer-open">
	<input id="navToggle" type="checkbox" class="drawer-toggle" bind:this={navToggle} />
	<div class="drawer-content">
		<nav class="flex min-w-full items-center justify-between bg-base-300 px-10 py-4 lg:hidden">
			<label for="navToggle" class="drawer-button cursor-pointer">
				<Menu />
			</label>
			<a href="/" class="flex items-center justify-center gap-4" use:link>
				<img src="/logo.png" alt="logo" class="h-10 w-10" />
				<h1 class="text-2xl font-bold">Costcut</h1>
			</a>
		</nav>
		<slot />
	</div>
	<nav class="drawer-side">
		<label for="navToggle" class="drawer-overlay" />
		<div
			class="menu flex h-full w-64 flex-col justify-between bg-base-200 p-6 text-base-content"
		>
			<a href="/" class="mt-6 flex items-center justify-center gap-4" use:link>
				<img src="/logo.png" alt="logo" class="h-10 w-10" />
				<h1 class="text-2xl font-bold">Costcut</h1>
			</a>
			<ul class="flex flex-col gap-1">
				{#each navbarItems as navbarItem}
					<a
						href={navbarItem.path}
						class="flex w-full items-center gap-4 rounded-md p-4 font-semibold hover:bg-primary hover:text-white"
						use:link
						use:active={{
							className: 'bg-primary text-white',
						}}
						on:click={() => {
							navToggle.checked = false;
						}}
					>
						<svelte:component this={navbarItem.icon} class="h-6 w-6" />
						<span>{navbarItem.name}</span>
					</a>
				{/each}
			</ul>
			<div>
				<div class="divider" />
				<div class="flex h-10 w-full items-center justify-between gap-4">
					<label class="swap swap-rotate">
						<input type="checkbox" bind:checked={themeButtonChecked} />
						<Sun class="swap-on fill-current" />
						<Moon class="swap-off fill-current" />
					</label>
					{#if $user === undefined}
						<div class="flex flex-grow items-center justify-center">
							<span class="loading loading-spinner" />
						</div>
					{:else if $user !== null}
						<div class="flex flex-grow items-center justify-between">
							<span
								class="w-20 flex-grow overflow-hidden overflow-ellipsis text-center"
							>
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
					<button
						class={`btn-primary btn flex-grow ${$user === null ? 'block' : 'hidden'}`}
						on:click={() => {
							authModal.open();
						}}
					>
						Login
					</button>
				</div>
			</div>
		</div>
	</nav>
</div>
