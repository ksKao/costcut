export type TransactionInDb = {
	id: string;
	description: string;
	payee: string;
	date: Date;
	amount: number;
	categoryId: string | null;
};

export const filterDateRange = [
	'All Time',
	'Past 12 Months',
	'Past 6 Months',
	'Past 30 Days',
	'Past Week',
] as const;
export type FilterDateRange = (typeof filterDateRange)[number];

export type Transaction = Omit<TransactionInDb, 'categoryId'> & {
	category: Category | null;
	balance: number;
};

export type Category = {
	id: string;
	name: string;
};

export type ItemInsertedEvent = Event & {
	key?: string;
	value?: string;
};

export type ResultResponse =
	| {
			success: true;
	  }
	| {
			success: false;
			errorMessage: string;
	  };
