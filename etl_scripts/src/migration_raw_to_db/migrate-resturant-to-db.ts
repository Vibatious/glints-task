import mysql = require('mysql2');
import * as rsData from '../raw-data/restaurant_with_menu.json';
export class MigrateResturantToDB {
	private db!: mysql.Connection;
	constructor(db: mysql.Connection) {
		this.db = db;
	}

	createResturantTable() {
		// this.db.query(`CREATE`)
	}



}