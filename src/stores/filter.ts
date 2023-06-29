import { writable } from 'svelte/store';
import type { Transaction } from '../lib/types';

type Filter = {
	sort: keyof Transaction;
	order: 'asc' | 'desc';
	skip: number;
	itemsPerPage: number;
};
export const filter = writable<Filter>({
	sort: 'date',
	order: 'desc',
	skip: 0,
	itemsPerPage: 15,
});
