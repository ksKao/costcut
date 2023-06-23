export type TransactionWithCategoryId = {
	id: string;
	description: string;
	payee: string;
	date: Date;
	amount: number;
	categoryId?: string;
};

export type Transaction = Omit<TransactionWithCategoryId, 'categoryId'> & {
	category?: Category;
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
