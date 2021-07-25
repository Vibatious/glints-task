export class CustomerPurchaseHistory {
	customerid: number;
	dishName: string;
	restaurantName: string;
	transactionAmount: number;
	transactinDate: string;

	constructor(customerid: number, dishName: string, restaurantName: string, transactionAmount: number, transactinDate: string) {
		this.customerid = customerid;
		this.dishName = dishName;
		this.restaurantName = restaurantName;
		this.transactionAmount = transactionAmount;
		this.transactinDate = transactinDate;
	}

}
