import { SQLConnection } from "./sql-connection";
import { ResturantData, ResturantDetailTable, ResturantMenuTable, ResturantTimingsTable } from '../../../sql-tables';
import mysql = require('mysql2');

export class Database {

	private sql!: SQLConnection;
	constructor() {
		this.sql = new SQLConnection();
		this.init();
	}

	private init() {
		this.sql.init();
	}

	async getOpenedResturant(dayNum: number, time: string) {
		const query2 = `SELECT ${ResturantTimingsTable.RESTURANT_ID_PROPERTY} FROM ${ResturantTimingsTable.TABLE_NAME} WHERE ${ResturantTimingsTable.DAY_NUM_PROPERTY}=${dayNum} AND ${ResturantTimingsTable.OPENING_TIME_PROPERTY}<='${time}' AND ${ResturantTimingsTable.CLOSING_TIME_PROPERTY}>'${time}'`;
		const query = `SELECT * FROM ${ResturantDetailTable.TABLE_NAME} WHERE ${ResturantDetailTable.RESTURANT_ID_PROPERTY} IN (${query2})`;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => ResturantData.fromSQLResult(data));
	}

	async getResturantHavingDishesGreaterThanInPriceRange(noOfResturant: number, atLeastNoOfDishes: number, fromPrice: number, toPrice: number) {
		const query2 = `SELECT  ${ResturantMenuTable.RESTURANT_ID_PROPERTY} FROM (SELECT ${ResturantMenuTable.RESTURANT_ID_PROPERTY} FROM ${ResturantMenuTable.TABLE_NAME} WHERE ${ResturantMenuTable.DISH_PRICE_PROPERTY}>${fromPrice} AND ${ResturantMenuTable.DISH_PRICE_PROPERTY}<${toPrice} GROUP BY ${ResturantMenuTable.RESTURANT_ID_PROPERTY} HAVING COUNT(${ResturantMenuTable.RESTURANT_ID_PROPERTY})>${atLeastNoOfDishes} ORDER BY COUNT(${ResturantMenuTable.RESTURANT_ID_PROPERTY}) LIMIT ${noOfResturant}) AS TEMP`;
		const query = `SELECT * FROM ${ResturantDetailTable.TABLE_NAME} WHERE ${ResturantDetailTable.RESTURANT_ID_PROPERTY} IN (${query2})`;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => ResturantData.fromSQLResult(data));
	}

	async getResturantHavingDishesLesserThanInPriceRange(noOfResturant: number, maxNoOfDishes: number, fromPrice: number, toPrice: number) {
		const query2 = `SELECT ${ResturantMenuTable.RESTURANT_ID_PROPERTY} FROM (SELECT ${ResturantMenuTable.RESTURANT_ID_PROPERTY} FROM ${ResturantMenuTable.TABLE_NAME} WHERE ${ResturantMenuTable.DISH_PRICE_PROPERTY}>${fromPrice} AND ${ResturantMenuTable.DISH_PRICE_PROPERTY}<${toPrice} GROUP BY ${ResturantMenuTable.RESTURANT_ID_PROPERTY} HAVING COUNT(${ResturantMenuTable.RESTURANT_ID_PROPERTY})<${maxNoOfDishes} AND COUNT(${ResturantMenuTable.RESTURANT_ID_PROPERTY})>0 ORDER BY COUNT(${ResturantMenuTable.RESTURANT_ID_PROPERTY}) LIMIT ${noOfResturant}) AS TEMP`;
		const query = `SELECT * FROM ${ResturantDetailTable.TABLE_NAME} WHERE ${ResturantDetailTable.RESTURANT_ID_PROPERTY} IN (${query2})`;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => ResturantData.fromSQLResult(data));
	}

	async getResturantOnSearchTerm(noOfResturant: number, maxNoOfDishes: number, fromPrice: number, toPrice: number) {
		// const query2 = `SELECT ${ResturantMenuTable.RESTURANT_ID_PROPERTY} ${ResturantMenuTable.DISH_ID_PROPERTY} FROM ${ResturantMenuTable.TABLE_NAME},${ResturantDetailTable} WHERE ${RESTUR  }`;
		// const query = `SELECT * FROM ${ResturantDetailTable.TABLE_NAME} WHERE ${ResturantDetailTable.RESTURANT_ID_PROPERTY} IN (${query2})`;
		// const result = await this.triggerSQLQuery(query);
		// return result.map((data: any) => ResturantData.fromSQLResult(data));
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