import mysql = require('mysql');
import { environment } from '../environment';


export class SQLServer {
	static readonly SIGNATURE = 'SQLServer';
	private sqlConnection!: mysql.Connection;

	constructor() {
		this.init();
	}

	init() {
		try {
			console.log(this.sqlConnection?.state);
			if (!(this.sqlConnection && this.sqlConnection.state !== 'connected')) {
				this.sqlConnection = mysql.createConnection(environment.sqlDatabase);
				this.sqlConnection.connect();
			}
		} catch (error) {
			throw error;
		}
	}


	closeConnection() {
		this.sqlConnection.end((err) => {
			throw err;
		});
	}
}

