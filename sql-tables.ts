export enum ResturantDetailTable {
	RESTURANT_ID_PROPERTY = 'resturantid',
	RESTURANT_NAME_PROPERTY = 'resturantname',
	CASH_BALANCE_PROPERTY = 'cashBalance',
	TABLE_NAME = 'resturantDetails'
}

export class ResturantData {
	id: number;
	name: string;
	cashBalance: number;

	constructor(id: number, name: string, cashBalance: number) {
		this.id = id;
		this.name = name;
		this.cashBalance = cashBalance;
	}

	static fromSQLResult(sqlResultObject: any) {
		let resturantData = null;
		if (sqlResultObject) {
			resturantData = new ResturantData(0, '', 0);
			resturantData.id = sqlResultObject[ResturantDetailTable.RESTURANT_ID_PROPERTY] ? sqlResultObject[ResturantDetailTable.RESTURANT_ID_PROPERTY] : 0;
			resturantData.name = sqlResultObject[ResturantDetailTable.RESTURANT_NAME_PROPERTY] ? sqlResultObject[ResturantDetailTable.RESTURANT_NAME_PROPERTY] : '';
			resturantData.cashBalance = sqlResultObject[ResturantDetailTable.CASH_BALANCE_PROPERTY] ? sqlResultObject[ResturantDetailTable.CASH_BALANCE_PROPERTY] : '';
		}
		return resturantData;
	}

}

export enum ResturantMenuTable {
	RESTURANT_ID_PROPERTY = 'resturantid',
	DISH_ID_PROPERTY = 'dishid',
	DISH_NAME_PROPERTY = 'dishName',
	DISH_PRICE_PROPERTY = 'dishPrice',
	TABLE_NAME = 'resturantMenu'
}

export enum ResturantTimingsTable {
	ID_PROPERTY = 'id',
	RESTURANT_ID_PROPERTY = 'resturantid',
	DAY_NUM_PROPERTY = 'dayNum',
	OPENING_TIME_PROPERTY = 'openingTime',
	CLOSING_TIME_PROPERTY = 'closingTime',
	TABLE_NAME = 'resturantTimings'
}

export enum CustomerDetailsTable {
	CUSTOMER_ID_PROPERTY = 'customerid',
	CUSTOMER_NAME_PROPERTY = 'customerName',
	CASH_BALANCE_PROPERTY = 'cashBalance',
	TABLE_NAME = 'customerDetails'
}

export enum CustomerPurchaseHistoryTable {
	TRANSACTION_ID_PROPERTY = 'transactionid',
	CUSTOMER_ID_PROPERTY = 'customerid',
	DISH_NAME_PROPERTY = 'dishName',
	RESTURANT_NAME_PROPERTY = 'resturantname',
	TRANSACTION_AMOUNT_PROPERTY = 'transactionAmount',
	TRANSACTION_DATE_PROPERTY = 'transactionDate',
	TABLE_NAME = 'customerPurchaseHistory'
}