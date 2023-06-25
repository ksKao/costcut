export type TransactionWithCategoryId = {
	id: string;
	description: string;
	payee: string;
	date: Date;
	amount: number;
	categoryId: string | null;
};

export type Transaction = Omit<TransactionWithCategoryId, 'categoryId'> & {
	category: Category | null;
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
