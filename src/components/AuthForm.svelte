<script lang="ts">
	import LoginForm from './LoginForm.svelte';
	import PasswordResetForm from './PasswordResetForm.svelte';
	import RegisterForm from './RegisterForm.svelte';

	let selectedTab: 'login' | 'register' | 'password-reset' = 'login';
</script>

<div class="tabs tabs-boxed w-full">
	<button
		class={`tab w-1/2 ${selectedTab === 'login' ? 'tab-active' : ''}`}
		on:click={() => (selectedTab = 'login')}
	>
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
	<LoginForm switchTabToPasswordReset={() => (selectedTab = 'password-reset')} />
{:else if selectedTab === 'register'}
	<RegisterForm />
{:else if selectedTab === 'password-reset'}
	<PasswordResetForm />
{/if}
