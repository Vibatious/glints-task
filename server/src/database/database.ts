import { SQLConnection } from "./sql-connection";
import { RestaurantData, RestaurantDetailTable, RestaurantMenuData, RestaurantMenuTable, RestaurantTimingsTable, SQLVerb } from '../../../data-models';

export class Database {

	private sql!: SQLConnection;
	constructor() {
		this.sql = new SQLConnection();
		this.init();
	}

	private init() {
		this.sql.init();
	}

	async getOpenedRestaurant(dayNum: number, time: string) {
		const query2 = `${SQLVerb.SELECT} ${RestaurantTimingsTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} ${RestaurantTimingsTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantTimingsTable.DAY_NUM_PROPERTY}=${dayNum} ${SQLVerb.AND} ${RestaurantTimingsTable.OPENING_TIME_PROPERTY}<='${time}' ${SQLVerb.AND} ${RestaurantTimingsTable.CLOSING_TIME_PROPERTY}>'${time}'`;
		const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.IN} (${query2})`;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => RestaurantData.fromSQLResult(data));
	}

	async getRestaurantHavingDishesGreaterThanInPriceRange(noOfRestaurant: number, atLeastNoOfDishes: number, fromPrice: number, toPrice: number) {
		const query2 = `${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} (${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} ${RestaurantMenuTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantMenuTable.DISH_PRICE_PROPERTY}>${fromPrice} ${SQLVerb.AND} ${RestaurantMenuTable.DISH_PRICE_PROPERTY}<${toPrice} ${SQLVerb.GROUP_BY} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.HAVING} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY})>${atLeastNoOfDishes} ${SQLVerb.ORDER_BY} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY}) ${SQLVerb.LIMIT} ${noOfRestaurant}) ${SQLVerb.AS} ${SQLVerb.TEMP_TABLE}`;
		const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.IN} (${query2})`;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => RestaurantData.fromSQLResult(data));
	}

	async getRestaurantHavingDishesLesserThanInPriceRange(noOfRestaurant: number, maxNoOfDishes: number, fromPrice: number, toPrice: number) {
		const query2 = `${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} (${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} ${RestaurantMenuTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantMenuTable.DISH_PRICE_PROPERTY}>${fromPrice} ${SQLVerb.AND} ${RestaurantMenuTable.DISH_PRICE_PROPERTY}<${toPrice} ${SQLVerb.GROUP_BY} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.HAVING} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY})<${maxNoOfDishes} ${SQLVerb.AND} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY})>0 ${SQLVerb.ORDER_BY} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY}) ${SQLVerb.LIMIT} ${noOfRestaurant}) ${SQLVerb.AS} ${SQLVerb.TEMP_TABLE}`;
		const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.IN} (${query2})`;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => RestaurantData.fromSQLResult(data));
	}

	async getRestaurantOnSearchTerm(searchTerm: string) {
		const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantDetailTable.RESTAURANT_NAME_PROPERTY} ${SQLVerb.LIKE} '%${searchTerm}%'  `;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => RestaurantData.fromSQLResult(data));
	}

	async getDishesOnSearchTerm(searchTerm: string) {
		const query2 = `${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY},${RestaurantMenuTable.DISH_NAME_PROPERTY},${RestaurantMenuTable.DISH_ID_PROPERTY},${RestaurantMenuTable.DISH_PRICE_PROPERTY} ${SQLVerb.FROM} ${RestaurantMenuTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantMenuTable.DISH_NAME_PROPERTY} ${SQLVerb.LIKE} '%${searchTerm}%' `;
		const query = `${SQLVerb.SELECT} ${RestaurantMenuTable.DISH_ID_PROPERTY},${RestaurantMenuTable.DISH_NAME_PROPERTY},${RestaurantMenuTable.DISH_PRICE_PROPERTY},${RestaurantDetailTable.RESTAURANT_NAME_PROPERTY} ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME},(${query2}) ${SQLVerb.AS} ${SQLVerb.TEMP_TABLE} ${SQLVerb.WHERE} ${RestaurantDetailTable.TABLE_NAME}.${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} = ${SQLVerb.TEMP_TABLE}.${RestaurantDetailTable.RESTAURANT_ID_PROPERTY}`;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => RestaurantMenuData.fromSQLResult(data));
	}

	private triggerSQLQuery(query: string): any {
		return new Promise((resolve, reject) => {
			this.sql.getDB().query(query, (err, result) => {
				if (err) {
					console.log(err)
					reject(err);
				}
				if (result) {
					resolve(result);
				}
			});
		});
	}

}