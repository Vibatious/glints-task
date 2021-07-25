import { SQLConnection } from "./sql-connection";
import { ResturantData, ResturantDetailTable, ResturantTimingsTable } from '../../../sql-tables';
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
		const query2 = `SELECT ${ResturantTimingsTable.RESTURANT_ID_PROPERTY} from ${ResturantTimingsTable.TABLE_NAME} WHERE ${ResturantTimingsTable.DAY_NUM_PROPERTY}=${dayNum} AND ${ResturantTimingsTable.OPENING_TIME_PROPERTY}<='${time}' AND ${ResturantTimingsTable.CLOSING_TIME_PROPERTY}>'${time}'`;
		const query = `SELECT * from ${ResturantDetailTable.TABLE_NAME} WHERE ${ResturantDetailTable.RESTURANT_ID_PROPERTY} IN (${query2})`;
		const result = await this.triggerSQLQuery(query);
		return result.map((data: any) => ResturantData.fromSQLResult(data));
		// this.getResturantDetails(resturantids);
	}

	private async getResturantDetails(resturantids: string[]) {
		// const result = await this.triggerSQLQuery(query);
		// console.log(result);
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