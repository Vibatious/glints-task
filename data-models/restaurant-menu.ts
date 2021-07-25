import { RestaurantMenuTable, RestaurantDetailTable } from './sql-tables'
export class RestaurantMenuData {
	id: number;
	dishName: string;
	restaurantName: string;
	price: number

	constructor(id: number, name: string, restaurantName: string, price: number) {
		this.id = id;
		this.dishName = name;
		this.restaurantName = restaurantName;
		this.price = price;
	}

	static fromSQLResult(sqlResultObject: any) {
		let resturantMenuData = null;
		if (sqlResultObject) {
			resturantMenuData = new RestaurantMenuData(0, '', '', 0);
			resturantMenuData.id = sqlResultObject[RestaurantMenuTable.DISH_ID_PROPERTY] ? sqlResultObject[RestaurantMenuTable.DISH_ID_PROPERTY] : 0;
			resturantMenuData.dishName = sqlResultObject[RestaurantMenuTable.DISH_NAME_PROPERTY] ? sqlResultObject[RestaurantMenuTable.DISH_NAME_PROPERTY] : '';
			resturantMenuData.price = sqlResultObject[RestaurantMenuTable.DISH_PRICE_PROPERTY] ? sqlResultObject[RestaurantMenuTable.DISH_PRICE_PROPERTY] : '';
			resturantMenuData.restaurantName = sqlResultObject[RestaurantDetailTable.RESTAURANT_NAME_PROPERTY] ? sqlResultObject[RestaurantDetailTable.RESTAURANT_NAME_PROPERTY] : '';
		}
		return resturantMenuData;
	}

}

