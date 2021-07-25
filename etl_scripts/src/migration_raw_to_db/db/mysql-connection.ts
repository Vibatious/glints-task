import mysql = require('mysql2');
import { environment } from '../../../../environment'
export class MysqlConnection {
	private db!: mysql.Connection;
	constructor() {
	}

	async init() {
		this.db = mysql.createConnection(environment.sqlDatabase);
		this.db.connect((args) => {
			console.log(args);
		});
		await this.dropDatabaseAndCreateNewDatabase();
		await this.chooseDatabase();
	}

	private async dropDatabaseAndCreateNewDatabase() {
		await this.triggerSQLQuery(`DROP DATABASE ${environment.database}`);
		await this.triggerSQLQuery(`CREATE DATABASE ${environment.database}`);
		// this.db.query(, (err, results, fields) => {
		// 	// console.log(err, results, fields)
		// });
		// this.db.query(, (err, results, fields) => {
		// 	// console.log(err, results, fields)
		// })
	}
	private async chooseDatabase() {
		await this.triggerSQLQuery(`USE ${environment.database}`);
		// this.db.query();
	}

	getDB() {
		return this.db;
	}

	private triggerSQLQuery(query: string) {
		return new Promise((resolve, reject) => {
			this.db.query(query, (err, result) => {
				if (err) {
					reject(err);
				}
				if (result) {
					resolve(result);
				}
			});
		});
	}



}