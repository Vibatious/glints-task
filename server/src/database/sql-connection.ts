import mysql = require('mysql2');
import { environment } from '../../../environment';


export class SQLConnection {
	private db!: mysql.Connection;

	constructor() { }

	init() {
		try {
			if (!(this.db)) {
				this.db = mysql.createConnection({ ...environment.sqlDatabase, database: environment.database });
				this.db.connect();
			}
		} catch (error) {
			throw error;
		}
	}


	closeConnection() {
		this.db.end((err) => {
			throw err;
		});
	}

	getDB() {
		if (!this.db) {
			throw Error('Database not initialised');
		}
		return this.db;
	}
}

