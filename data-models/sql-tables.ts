export enum RestaurantDetailTable {
	RESTAURANT_ID_PROPERTY = 'restaurantid',
	RESTAURANT_NAME_PROPERTY = 'restaurantname',
	CASH_BALANCE_PROPERTY = 'cashBalance',
	TABLE_NAME = 'restaurantDetails'
}


export enum RestaurantMenuTable {
	RESTAURANT_ID_PROPERTY = 'restaurantid',
	DISH_ID_PROPERTY = 'dishid',
	DISH_NAME_PROPERTY = 'dishName',
	DISH_PRICE_PROPERTY = 'dishPrice',
	TABLE_NAME = 'restaurantMenu'
}

export enum RestaurantTimingsTable {
	ID_PROPERTY = 'id',
	RESTAURANT_ID_PROPERTY = 'restaurantid',
	DAY_NUM_PROPERTY = 'dayNum',
	OPENING_TIME_PROPERTY = 'openingTime',
	CLOSING_TIME_PROPERTY = 'closingTime',
	TABLE_NAME = 'restaurantTimings'
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
	RESTAURANT_NAME_PROPERTY = 'restaurantname',
	TRANSACTION_AMOUNT_PROPERTY = 'transactionAmount',
	TRANSACTION_DATE_PROPERTY = 'transactionDate',
	TABLE_NAME = 'customerPurchaseHistory'
}