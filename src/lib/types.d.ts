export type Transaction = {
	id: string;
	description: string;
	payee: string;
	date: Date;
	amount: number;
	categoryId?: string;
};

export type Category = {
	id: string;
	name: string;
};

export type ResultResponse =
	| {
			success: true;
	  }
	| {
			success: false;
			errorMessage: string;
	  };
