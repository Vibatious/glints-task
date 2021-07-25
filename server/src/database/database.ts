import { SQLConnection } from "./sql-connection";
import { CustomerData, CustomerDetailsTable, CustomerPurchaseHistory, CustomerPurchaseHistoryTable, RestaurantData, RestaurantDetailTable, RestaurantMenuData, RestaurantMenuTable, RestaurantTimingsTable, SQLVerb } from '../../../data-models';

export class Database {

	private sql!: SQLConnection;
	constructor() {
		this.sql = new SQLConnection();
		this.init();
	}

	private init() {
		this.sql.init();
	}

	async getOpenedRestaurant(dayNum: number, time: string): Promise<RestaurantData[]> {
		try {
			const nestedQuery = `${SQLVerb.SELECT} ${RestaurantTimingsTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} ${RestaurantTimingsTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantTimingsTable.DAY_NUM_PROPERTY}=${dayNum} ${SQLVerb.AND} ${RestaurantTimingsTable.OPENING_TIME_PROPERTY}<='${time}' ${SQLVerb.AND} ${RestaurantTimingsTable.CLOSING_TIME_PROPERTY}>'${time}'`;
			const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.IN} (${nestedQuery})`;
			const result = await this.triggerSQLQuery(query);
			return result.map((data: any) => RestaurantData.fromSQLResult(data));
		} catch (error) {
			throw error;
		}

	}

	async getRestaurantHavingDishesGreaterThanInPriceRange(noOfRestaurant: number, atLeastNoOfDishes: number, fromPrice: number, toPrice: number): Promise<RestaurantData[]> {
		try {
			const nestedQuery = `${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} (${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} ${RestaurantMenuTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantMenuTable.DISH_PRICE_PROPERTY}>${fromPrice} ${SQLVerb.AND} ${RestaurantMenuTable.DISH_PRICE_PROPERTY}<${toPrice} ${SQLVerb.GROUP_BY} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.HAVING} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY})>${atLeastNoOfDishes} ${SQLVerb.ORDER_BY} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY}) ${SQLVerb.LIMIT} ${noOfRestaurant}) ${SQLVerb.AS} ${SQLVerb.TEMP_TABLE}`;
			const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.IN} (${nestedQuery})`;
			const result = await this.triggerSQLQuery(query);
			return result.map((data: any) => RestaurantData.fromSQLResult(data));
		} catch (error) {
			throw error;
		}

	}

	async getRestaurantHavingDishesLesserThanInPriceRange(noOfRestaurant: number, maxNoOfDishes: number, fromPrice: number, toPrice: number): Promise<RestaurantData[]> {
		try {
			const nestedQuery = `${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} (${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.FROM} ${RestaurantMenuTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantMenuTable.DISH_PRICE_PROPERTY}>${fromPrice} ${SQLVerb.AND} ${RestaurantMenuTable.DISH_PRICE_PROPERTY}<${toPrice} ${SQLVerb.GROUP_BY} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.HAVING} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY})<${maxNoOfDishes} ${SQLVerb.AND} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY})>0 ${SQLVerb.ORDER_BY} ${SQLVerb.COUNT}(${RestaurantMenuTable.RESTAURANT_ID_PROPERTY}) ${SQLVerb.LIMIT} ${noOfRestaurant}) ${SQLVerb.AS} ${SQLVerb.TEMP_TABLE}`;
			const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.IN} (${nestedQuery})`;
			const result = await this.triggerSQLQuery(query);
			return result.map((data: any) => RestaurantData.fromSQLResult(data));
		} catch (error) {
			throw error;
		}

	}

	async getRestaurantOnSearchTerm(searchTerm: string): Promise<RestaurantData[]> {
		try {
			const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantDetailTable.RESTAURANT_NAME_PROPERTY} ${SQLVerb.LIKE} '%${searchTerm}%'  `;
			const result = await this.triggerSQLQuery(query);
			return result.map((data: any) => RestaurantData.fromSQLResult(data));
		} catch (error) {
			throw error
		}

	}

	async getDishesOnSearchTerm(searchTerm: string): Promise<RestaurantMenuData[]> {
		try {
			const nestedQuery = `${SQLVerb.SELECT} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY},${RestaurantMenuTable.DISH_NAME_PROPERTY},${RestaurantMenuTable.DISH_ID_PROPERTY},${RestaurantMenuTable.DISH_PRICE_PROPERTY} ${SQLVerb.FROM} ${RestaurantMenuTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantMenuTable.DISH_NAME_PROPERTY} ${SQLVerb.LIKE} '%${searchTerm}%' `;
			const query = `${SQLVerb.SELECT} ${RestaurantMenuTable.DISH_ID_PROPERTY},${RestaurantMenuTable.DISH_NAME_PROPERTY},${RestaurantMenuTable.DISH_PRICE_PROPERTY},${RestaurantDetailTable.RESTAURANT_NAME_PROPERTY} ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME},(${nestedQuery}) ${SQLVerb.AS} ${SQLVerb.TEMP_TABLE} ${SQLVerb.WHERE} ${RestaurantDetailTable.TABLE_NAME}.${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} = ${SQLVerb.TEMP_TABLE}.${RestaurantDetailTable.RESTAURANT_ID_PROPERTY}`;
			const result = await this.triggerSQLQuery(query);
			return result.map((data: any) => RestaurantMenuData.fromSQLResult(data));
		} catch (error) {
			throw error
		}
	}

	async userInfo(userid: number): Promise<CustomerData[]> {
		try {
			const query = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${CustomerDetailsTable.TABLE_NAME} ${SQLVerb.WHERE} ${CustomerDetailsTable.CUSTOMER_ID_PROPERTY}=${userid}`;
			const result = await this.triggerSQLQuery(query);
			return result.map((data: any) => CustomerData.fromSQLResult(data));
		} catch (error) {
			throw error;
		}

	}

	async getDishInfo(dishid: number, restaurantid: number): Promise<RestaurantMenuData[]> {
		try {
			const nestedQuery = `${SQLVerb.SELECT} * ${SQLVerb.FROM} ${RestaurantMenuTable.TABLE_NAME} ${SQLVerb.WHERE} ${RestaurantMenuTable.DISH_ID_PROPERTY}=${dishid} ${SQLVerb.AND} ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY}=${restaurantid} `;
			const query = `${SQLVerb.SELECT} ${RestaurantMenuTable.DISH_ID_PROPERTY},${RestaurantMenuTable.DISH_NAME_PROPERTY},${RestaurantMenuTable.DISH_PRICE_PROPERTY},${RestaurantDetailTable.RESTAURANT_NAME_PROPERTY} ${SQLVerb.FROM} ${RestaurantDetailTable.TABLE_NAME},(${nestedQuery}) ${SQLVerb.AS} ${SQLVerb.TEMP_TABLE} ${SQLVerb.WHERE} ${RestaurantDetailTable.TABLE_NAME}.${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} = ${SQLVerb.TEMP_TABLE}.${RestaurantDetailTable.RESTAURANT_ID_PROPERTY}`;
			const result = await this.triggerSQLQuery(query);
			return result.map((data: any) => RestaurantMenuData.fromSQLResult(data));
		} catch (error) {
			throw error;
		}
	}

	async updateUserCashBalance(cashBalance: number, customerid: number) {
		try {
			const query = `${SQLVerb.UPDATE} ${CustomerDetailsTable.TABLE_NAME} ${SQLVerb.SET} ${CustomerDetailsTable.CASH_BALANCE_PROPERTY}=${cashBalance} ${SQLVerb.WHERE} ${CustomerDetailsTable.CUSTOMER_ID_PROPERTY}=${customerid}`;
			await this.triggerSQLQuery(query);
		} catch (error) {
			throw error;
		}
	}

	async addPaymentHistory(purhaseDetails: CustomerPurchaseHistory) {
		try {
			const insertInPurchaseHistorTableQuery = `${SQLVerb.INSERT} ${SQLVerb.INTO} ${CustomerPurchaseHistoryTable.TABLE_NAME} (${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY}, ${CustomerPurchaseHistoryTable.DISH_NAME_PROPERTY}, ${CustomerPurchaseHistoryTable.RESTAURANT_NAME_PROPERTY}, ${CustomerPurchaseHistoryTable.TRANSACTION_AMOUNT_PROPERTY}, ${CustomerPurchaseHistoryTable.TRANSACTION_DATE_PROPERTY}) ${SQLVerb.VALUES} (?, ?, ?, ?, ?)`
			await this.updateSQLQuery(insertInPurchaseHistorTableQuery, [purhaseDetails.customerid, purhaseDetails.dishName, purhaseDetails.restaurantName, purhaseDetails.transactionAmount, purhaseDetails.transactinDate]);
		} catch (error) {
			throw error;
		}

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

	private updateSQLQuery(query: string, values: any[] = []): any {
		return new Promise((resolve, reject) => {
			this.sql.getDB().execute(query, values, (err, result) => {
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