import mysql = require('mysql2');
import { default as userData } from '../raw-data/users_with_purchase_history.json';
import { CustomerDetailsTable, CustomerPurchaseHistoryTable } from '../../../sql-tables';

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
		const userDetailsquery = `CREATE TABLE ${CustomerDetailsTable.TABLE_NAME} (${CustomerDetailsTable.CUSTOMER_ID_PROPERTY} int NOT NULL, ${CustomerDetailsTable.CUSTOMER_NAME_PROPERTY} varchar(255) NOT NULL, ${CustomerDetailsTable.CASH_BALANCE_PROPERTY} DOUBLE, PRIMARY KEY (customerid))`
		await this.triggerSQLQuery(userDetailsquery);
		const userPurchaseHistory = `CREATE TABLE ${CustomerPurchaseHistoryTable.TABLE_NAME} (${CustomerPurchaseHistoryTable.TRANSACTION_ID_PROPERTY} INT NOT NULL AUTO_INCREMENT, ${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY} INT NOT NULL, ${CustomerPurchaseHistoryTable.DISH_NAME_PROPERTY} varchar(1000) NOT NULL, ${CustomerPurchaseHistoryTable.RESTURANT_NAME_PROPERTY} varchar(255) NOT NULL, ${CustomerPurchaseHistoryTable.TRANSACTION_AMOUNT_PROPERTY} DOUBLE NOT NULL, ${CustomerPurchaseHistoryTable.TRANSACTION_DATE_PROPERTY} varchar(50) NOT NULL, PRIMARY KEY (${CustomerPurchaseHistoryTable.TRANSACTION_ID_PROPERTY}),FOREIGN KEY (${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY}) REFERENCES customerDetails (${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY}))`
		await this.triggerSQLQuery(userPurchaseHistory);
	}

	async migrateDataToDb() {
		const insertInCustomerDetailsTable = `INSERT INTO ${CustomerDetailsTable.TABLE_NAME} (${CustomerDetailsTable.CUSTOMER_ID_PROPERTY}, ${CustomerDetailsTable.CUSTOMER_NAME_PROPERTY}, ${CustomerDetailsTable.CASH_BALANCE_PROPERTY}) VALUES (?, ?, ?)`
		const insertInPurchaseHistorTable = `INSERT INTO ${CustomerPurchaseHistoryTable.TABLE_NAME} (${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY}, ${CustomerPurchaseHistoryTable.DISH_NAME_PROPERTY}, ${CustomerPurchaseHistoryTable.RESTURANT_NAME_PROPERTY}, ${CustomerPurchaseHistoryTable.TRANSACTION_AMOUNT_PROPERTY}, ${CustomerPurchaseHistoryTable.TRANSACTION_DATE_PROPERTY}) VALUE (?, ?, ?, ?, ?)`
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