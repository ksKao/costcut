<script lang="ts">
	import { ChevronDown, Check } from 'lucide-svelte';
	import { z } from 'zod';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import { getContext } from 'svelte';
	import { createCombobox, createDialog } from 'svelte-headlessui';
	import Transition from 'svelte-transition';
	import toast from 'svelte-french-toast';
	import { addTransaction } from '../lib/utils';

	const combobox = createCombobox();
	const categories = ['Food', 'Entertainment', 'Transportation', 'Shopping', 'Other'] as const;
	const schema = z.object({
		description: z.string().min(1, { message: 'Description is required' }),
		payee: z.string().min(1, { message: 'Payee is required' }),
		amount: z.number({
			invalid_type_error: 'Invalid amount',
			required_error: 'Amount is required',
		}),
		date: z.coerce.date({
			invalid_type_error: 'Invalid date',
			required_error: 'Date is required',
		}),
		category: z.enum(categories, {
			errorMap: () => {
				return { message: 'Invalid category' };
			},
		}),
	});
	const emptyError = {
		description: '',
		payee: '',
		amount: '',
		date: '',
		category: '',
	};

	let description = '';
	let payee = '';
	let amount = '';
	let date = '';
	let category = '';
	let error = { ...emptyError };
	let isLoading = false;

	const addTransactionModal = getContext<ReturnType<typeof createDialog>>('addTransactionModal');

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
	};

	const handleSubmit = async () => {
		error = { ...emptyError };
		const dateArray = date.split('/');
		const parsedInput = schema.safeParse({
			description,
			payee,
			amount: amount ? Number(amount) : null,
			date: `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`,
			category,
		});

		if (!parsedInput.success) {
			error.description = parsedInput.error.flatten().fieldErrors.description?.[0] ?? '';
			error.payee = parsedInput.error.flatten().fieldErrors.payee?.[0] ?? '';
			error.amount = parsedInput.error.flatten().fieldErrors.amount?.[0] ?? '';
			error.date = parsedInput.error.flatten().fieldErrors.date?.[0] ?? '';
			error.category = parsedInput.error.flatten().fieldErrors.category?.[0] ?? '';
			return;
		}

		isLoading = true;
		const res = await addTransaction(parsedInput.data);
		isLoading = false;
		if (res.success) {
			toast.success('Transaction added successfully');
			addTransactionModal.close();
		} else {
			toast.error(res.errorMessage);
		}
	};
</script>

<h1 class="mb-4 text-xl font-bold">Add Transaction</h1>
<form on:submit|preventDefault={handleSubmit}>
	<Input
		label="Description"
		placeholder="Description"
		name="description"
		id="description"
		errorMessage={error.description}
		bind:value={description}
	/>
	<Input
		label="Payee"
		placeholder="Payee"
		name="payee"
		id="payee"
		errorMessage={error.payee}
		bind:value={payee}
	/>
	<div class="form-control relative w-full">
		<label class="label" for="category">
			<span class="label-text">Category</span>
		</label>
		<div class="relative w-full">
			<input
				use:combobox.input
				on:select={onSelectCategory}
				class={`${
					error.category ? 'input-error' : 'input-bordered'
				} input w-full overflow-hidden overflow-ellipsis pr-6`}
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
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0 translate-y-1"
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
							<span class="max-w-[80%] flex-grow overflow-hidden overflow-ellipsis"
								>{value}</span
							>
							{#if selected}
								<span><Check class="h-5 w-5" /></span>
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
			<span class="label-text-alt text-error">{error.category}</span>
		</label>
	</div>
	<div class="flex w-full gap-8">
		<Input
			label="Amount"
			placeholder="Amount"
			name="amount"
			id="amount"
			errorMessage={error.amount}
			bind:value={amount}
		/>
		<Input
			maxlength={10}
			label="Date"
			placeholder="DD - MM - YYYY"
			name="date"
			id="date"
			errorMessage={error.date}
			bind:value={date}
		/>
	</div>

	<Button type="submit" class="mt-4 w-full" {isLoading}>Add Transaction</Button>
</form>
