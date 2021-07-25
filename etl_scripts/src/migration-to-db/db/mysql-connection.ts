import mysql = require('mysql2');
import { environment } from '../../../../environment'
export class MysqlConnection {
	private db!: mysql.Connection;
	constructor() {
	}

	async init() {
		try {
			this.db = mysql.createConnection(environment.sqlDatabase);
			this.db.connect((args) => {
				console.log(args);
			});
			await this.dropDatabaseAndCreateNewDatabase();
			await this.chooseDatabase();
		} catch (error) {
			throw error;
		}

	}

	private async dropDatabaseAndCreateNewDatabase() {
		try {
			await this.triggerSQLQuery(`DROP DATABASE ${environment.database}`);
			await this.triggerSQLQuery(`CREATE DATABASE ${environment.database}`);
		} catch (error) {
			throw error;
		}

	}
	private async chooseDatabase() {
		try {
			await this.triggerSQLQuery(`USE ${environment.database}`);
		} catch (error) {
			throw error;
		}
	}

	closeConnection() {
		this.db.end((err) => {
			if (err) {
				throw err;
			}
		});
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