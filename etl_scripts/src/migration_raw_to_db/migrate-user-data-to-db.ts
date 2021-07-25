import mysql = require('mysql2');
import { default as userData } from '../raw-data/users_with_purchase_history.json';

enum UserProperty {
	id = "id",
	cashBalance = "cashBalance",
	name = "name",
	dishName = "dishName",
	restaurantName = "restaurantName",
	transactionAmount = "transactionAmount",
	transactionDate = "transactionDate",


}
export class MigrateUserToDB {
	private db!: mysql.Connection;
	constructor(db: mysql.Connection) {
		this.db = db;
	}

	async init() {
		await this.createUserTable();
		await this.migrateDataToDb();
	}

	async createUserTable() {
		const userDetailsquery = "CREATE TABLE customerDetails (customerid int NOT NULL, customerName varchar(255) NOT NULL, cashBalance DOUBLE, PRIMARY KEY (customerid))"
		await this.triggerSQLQuery(userDetailsquery);
		const userPurchaseHistory = "CREATE TABLE purchaseHistory (transactionid INT NOT NULL AUTO_INCREMENT, customerid INT NOT NULL, dishName varchar(1000) NOT NULL, restaurantName varchar(255) NOT NULL, transactionAmount DOUBLE NOT NULL, PRIMARY KEY (transactionid), transactionDate varchar(30) NOT NULL, FOREIGN KEY (customerid) REFERENCES customerDetails (customerid))"
		// this.db.query(userPurchaseHistory);
		await this.triggerSQLQuery(userPurchaseHistory);
	}

	async migrateDataToDb() {
		const insertInCustomerDetailsTable = "INSERT INTO customerDetails (`customerid`, `customerName`, `cashBalance`) VALUES (?, ?, ?)"
		const insertInPurchaseHistorTable = "INSERT INTO purchaseHistory (`customerid`, `dishName`, `restaurantName`, `transactionAmount`, `transactionDate`) VALUE (?, ?, ?, ?, ?)"
		console.log(userData.length);
		for (let user of userData) {
			await this.triggerSQLQuery(insertInCustomerDetailsTable, [user.id, user.name, user.cashBalance]);
			for (let purchaseHistory of user.purchaseHistory) {
				await this.triggerSQLQuery(insertInPurchaseHistorTable, [user.id, purchaseHistory.dishName, purchaseHistory.restaurantName, purchaseHistory.transactionAmount, purchaseHistory.transactionDate]);
			}
		}

	}

	private triggerSQLQuery(query: string, values: any[] = []) {
		return new Promise((resolve, reject) => {
			this.db.execute(query, values, (err, result) => {
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