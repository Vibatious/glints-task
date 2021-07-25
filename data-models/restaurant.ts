import { RestaurantDetailTable } from "./sql-tables";

export class RestaurantData {
	id: number;
	name: string;
	cashBalance: number;

	constructor(id: number, name: string, cashBalance: number) {
		this.id = id;
		this.name = name;
		this.cashBalance = cashBalance;
	}

	static fromSQLResult(sqlResultObject: any) {
		let restaurantData = null;
		if (sqlResultObject) {
			restaurantData = new RestaurantData(0, '', 0);
			restaurantData.id = sqlResultObject[RestaurantDetailTable.RESTAURANT_ID_PROPERTY] ? sqlResultObject[RestaurantDetailTable.RESTAURANT_ID_PROPERTY] : 0;
			restaurantData.name = sqlResultObject[RestaurantDetailTable.RESTAURANT_NAME_PROPERTY] ? sqlResultObject[RestaurantDetailTable.RESTAURANT_NAME_PROPERTY] : '';
			restaurantData.cashBalance = sqlResultObject[RestaurantDetailTable.CASH_BALANCE_PROPERTY] ? sqlResultObject[RestaurantDetailTable.CASH_BALANCE_PROPERTY] : '';
		}
		return restaurantData;
	}

}
