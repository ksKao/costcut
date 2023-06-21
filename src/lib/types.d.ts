export type Transaction = {
	id: string;
	description: string;
	payee: string;
	date: Date;
	amount: number;
	category: string;
};

export type ResultResponse =
	| {
			success: true;
	  }
	| {
			success: false;
			errorMessage: string;
	  };
