<script lang="ts">
	import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
	import Modal from '../components/Modal.svelte';
	import { user } from '../stores/auth';
	import { db } from '../lib/firebase';
	import Button from '../components/Button.svelte';
	import Input from '../components/Input.svelte';
	import { createCombobox } from 'svelte-headlessui';
	import Transition from 'svelte-transition';
	import { Check, ChevronDown } from 'lucide-svelte';

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
		<div class="form-control relative w-1/2">
			<label class="label" for="id">
				<span class="label-text">Category</span>
			</label>
			<div class="relative w-full">
				<input
					use:combobox.input
					on:select={onSelectCategory}
					class="input-bordered input w-full overflow-hidden overflow-ellipsis pr-6"
					value={$combobox.selected}
					placeholder="Category"
					id="category"
				/>
				<button
					use:combobox.button
					type="button"
					class="absolute right-2 top-0 translate-y-1/2"
				>
					<ChevronDown />
				</button>
				<Transition
					show={$combobox.expanded}
					enter="transition ease-out duration-100"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					on:after-leave={() => combobox.reset()}
				>
					<ul
						use:combobox.items
						class="absolute mt-2 w-full overflow-hidden rounded-md bg-base-100 p-1 shadow-md shadow-black"
					>
						{#each filtered as value}
							{@const active = $combobox.active === value}
							{@const selected = $combobox.selected === value}
							<li
								use:combobox.item={{ value }}
								class={`flex w-full cursor-default items-center justify-between rounded-md p-2 ${
									active ? 'bg-primary' : ''
								}`}
							>
								<span
									class="max-w-[80%] flex-grow overflow-hidden overflow-ellipsis"
									>{value}</span
								>
								{#if selected}
									<span class=""><Check /></span>
								{/if}
							</li>
						{:else}
							<li
								class="flex w-full cursor-default items-center justify-between rounded-md p-2"
							>
								No results found
							</li>
						{/each}
					</ul>
				</Transition>
			</div>
			<label class="label" for="category">
				<span class="label-text-alt">Bottom Left label</span>
			</label>
		</div>
		<Button type="submit" class="mt-4 w-full">Add Transaction</Button>
	</form>
</Modal>
