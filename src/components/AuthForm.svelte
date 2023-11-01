<script lang="ts">
	import ExampleAccountLogin from './ExampleAccountLogin.svelte';
	import LoginForm from './LoginForm.svelte';
	import PasswordResetForm from './PasswordResetForm.svelte';
	import RegisterForm from './RegisterForm.svelte';

	let selectedTab: 'login' | 'register' | 'password-reset' | 'example-account' = 'login';
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
	<LoginForm
		switchTabToPasswordReset={() => (selectedTab = 'password-reset')}
		switchTabToExampleAccount={() => (selectedTab = 'example-account')}
	/>
{:else if selectedTab === 'register'}
	<RegisterForm />
{:else if selectedTab === 'password-reset'}
	<PasswordResetForm />
{:else if selectedTab === 'example-account'}
	<ExampleAccountLogin />
{/if}
