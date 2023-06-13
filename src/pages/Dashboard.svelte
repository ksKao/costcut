<script lang="ts">
	import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
	import Modal from '../components/Modal.svelte';
	import { user } from '../stores/auth';
	import { db } from '../lib/firebase';
	import Button from '../components/Button.svelte';
	import Input from '../components/Input.svelte';
	import { createCombobox } from 'svelte-headlessui';
	import Transition from 'svelte-transition';

	const combobox = createCombobox();
	const categories = ['Food', 'Entertainment', 'Transportation', 'Shopping', 'Other'];

	let description = '';
	let amount = '';
	let date = '';
	let category = '';

	$: amount = amount.replace(/[^0-9.-]/g, '');
	$: date = date
		.replace(/^(\d\d)(\d)$/g, '$1/$2')
		.replace(/^(\d\d\/\d\d)(\d+)$/g, '$1/$2')
		.replace(/[^\d\/]/g, '');
	$: filtered = categories.filter((cat) =>
		cat.toLowerCase().includes($combobox.filter.toLowerCase())
	);

	const onSelectCategory = (e: Event) => {
		category = (e as CustomEvent).detail?.selected ?? '';
		console.log(category);
	};

	const handleSubmit = () => {
		console.log('category: ', category);
	};

	// const test = async () => {
	// 	if (!$user) return;

	// 	setDoc(doc(db, `users/${$user.uid}/transactions/randomId`), {
	// 		name: 'Movie Tickets',
	// 		date: serverTimestamp(),
	// 		amount: 20,
	// 		category: 'Entertainment',
	// 	});
	// };

	// let data = '';

	// onMount(async () => {
	// 	const transaction = await getDoc(doc(db, `users/${$user?.uid}/transactions/randomId`));
	// 	data = JSON.stringify(transaction.data());
	// });
</script>

<h1>Dashboard</h1>
<p>{$user?.emailVerified}</p>
<Modal>
	<svelte:fragment slot="button">Add Transaction</svelte:fragment>
	<h1 class="mb-4 text-xl font-bold">Add Transaction</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<Input
			label="Description"
			placeholder="Description"
			name="description"
			id="description"
			bind:value={description}
		/>
		<div class="flex w-full gap-8">
			<Input
				label="Amount"
				placeholder="Amount"
				name="amount"
				id="amount"
				bind:value={amount}
			/>
			<Input
				maxlength={10}
				label="Date"
				placeholder="DD / MM / YYYY"
				name="date"
				id="date"
				bind:value={date}
			/>
		</div>
		<input
			use:combobox.input
			on:select={onSelectCategory}
			class="input-bordered input"
			value={$combobox.selected}
			placeholder="Category"
		/>
		<button use:combobox.button type="button"> v </button>
		<!-- {#if $combobox.expanded} -->
		<Transition
			show={$combobox.expanded}
			leave="transition ease-in duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			on:after-leave={() => combobox.reset()}
		>
			<ul use:combobox.items>
				{#each filtered as value}
					<li use:combobox.item={{ value }}>{value}</li>
				{:else}
					<li>No results found</li>
				{/each}
			</ul>
		</Transition>
		<!-- {/if} -->
		<Button type="submit">Add Transaction</Button>
	</form>
</Modal>
