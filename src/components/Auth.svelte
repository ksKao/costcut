<script lang="ts">
	import LoginForm from './LoginForm.svelte';
	import RegisterForm from './RegisterForm.svelte';

	let selectedTab: 'login' | 'register' = 'login';
</script>

<div class="tabs tabs-boxed w-full">
	<button class={`tab w-1/2 ${selectedTab === 'login' ? 'tab-active' : ''}`} on:click={() => (selectedTab = 'login')}>
		Login
	</button>
	<button
		class={`tab w-1/2 ${selectedTab === 'register' ? 'tab-active' : ''}`}
		on:click={() => (selectedTab = 'register')}
	>
		Register
	</button>
</div>

{#if selectedTab === 'login'}
	<LoginForm />
{:else}
	<RegisterForm />
{/if}
