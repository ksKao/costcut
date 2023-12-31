<script lang="ts">
	import { Check, ChevronDown } from 'lucide-svelte';
	import { createListbox } from 'svelte-headlessui';
	import Transition from 'svelte-transition';

	export let values: string[];
	export let selected: string;

	const listbox = createListbox({ selected });

	const onSelect = (e: Event) => {
		selected = (e as CustomEvent).detail.selected;
	};
</script>

<div class="relative w-48 overflow-x-visible">
	<button
		use:listbox.button
		on:select={onSelect}
		class="flex w-full items-center justify-between gap-2 rounded-md bg-primary px-4 py-2 text-white"
	>
		{$listbox.selected}
		<ChevronDown />
	</button>
	<Transition
		show={$listbox.expanded}
		enter="transition ease-out duration-100"
		enterFrom="opacity-0 translate-y-1"
		enterTo="opacity-100 translate-y-0"
		leave="transition ease-in duration-100"
		leaveFrom="opacity-100 translate-y-0"
		leaveTo="opacity-0 translate-y-1"
	>
		<ul
			use:listbox.items
			class={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-200 p-1 text-base-content shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
		>
			{#each values as value}
				{@const active = $listbox.active === value}
				{@const selected = $listbox.selected === value}
				<li
					class="relative cursor-default select-none rounded-md py-2 pl-10 pr-4 {active
						? 'bg-primary text-primary-content'
						: 'text-base-content'}"
					use:listbox.item={{ value }}
				>
					<span class="block truncate {selected ? 'font-medium' : 'font-normal'}">
						{value}
					</span>
					{#if selected}
						<span
							class={`absolute inset-y-0 left-0 flex items-center pl-3 ${
								active ? 'text-primary-content' : ''
							}`}
						>
							<Check class="h-5 w-5" />
						</span>
					{/if}
				</li>
			{/each}
		</ul>
	</Transition>
</div>
