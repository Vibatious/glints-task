import mysql = require('mysql2');
import { default as userData } from '../raw-data/users_with_purchase_history.json';
import { SQLVerb, CustomerDetailsTable, CustomerPurchaseHistoryTable } from '../../../data-models';

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
		try {
			const userDetailsquery = `${SQLVerb.CREATE} ${SQLVerb.TABLE} ${CustomerDetailsTable.TABLE_NAME} (${CustomerDetailsTable.CUSTOMER_ID_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL}, ${CustomerDetailsTable.CUSTOMER_NAME_PROPERTY} varchar(255) ${SQLVerb.NOT_NULL}, ${CustomerDetailsTable.CASH_BALANCE_PROPERTY} DOUBLE, ${SQLVerb.PRIMARY_KEY} (${CustomerDetailsTable.CUSTOMER_ID_PROPERTY}))`
			await this.triggerSQLQuery(userDetailsquery);
			const userPurchaseHistory = `${SQLVerb.CREATE} ${SQLVerb.TABLE} ${CustomerPurchaseHistoryTable.TABLE_NAME} (${CustomerPurchaseHistoryTable.TRANSACTION_ID_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL} ${SQLVerb.AUTO_INCREMENT}, ${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL}, ${CustomerPurchaseHistoryTable.DISH_NAME_PROPERTY} varchar(1000) ${SQLVerb.NOT_NULL}, ${CustomerPurchaseHistoryTable.RESTAURANT_NAME_PROPERTY} varchar(255) ${SQLVerb.NOT_NULL}, ${CustomerPurchaseHistoryTable.TRANSACTION_AMOUNT_PROPERTY} DOUBLE ${SQLVerb.NOT_NULL}, ${CustomerPurchaseHistoryTable.TRANSACTION_DATE_PROPERTY} varchar(50) ${SQLVerb.NOT_NULL}, ${SQLVerb.PRIMARY_KEY} (${CustomerPurchaseHistoryTable.TRANSACTION_ID_PROPERTY}),FOREIGN KEY (${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY}) ${SQLVerb.REFERENCES} ${CustomerDetailsTable.TABLE_NAME} (${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY}))`
			await this.triggerSQLQuery(userPurchaseHistory);
		} catch (error) {
			console.log(error);
		}
	}

	async migrateDataToDb() {
		const insertInCustomerDetailsTable = `${SQLVerb.INSERT} ${SQLVerb.INTO} ${CustomerDetailsTable.TABLE_NAME} (${CustomerDetailsTable.CUSTOMER_ID_PROPERTY}, ${CustomerDetailsTable.CUSTOMER_NAME_PROPERTY}, ${CustomerDetailsTable.CASH_BALANCE_PROPERTY}) ${SQLVerb.VALUES} (?, ?, ?)`
		const insertInPurchaseHistorTable = `${SQLVerb.INSERT} ${SQLVerb.INTO} ${CustomerPurchaseHistoryTable.TABLE_NAME} (${CustomerPurchaseHistoryTable.CUSTOMER_ID_PROPERTY}, ${CustomerPurchaseHistoryTable.DISH_NAME_PROPERTY}, ${CustomerPurchaseHistoryTable.RESTAURANT_NAME_PROPERTY}, ${CustomerPurchaseHistoryTable.TRANSACTION_AMOUNT_PROPERTY}, ${CustomerPurchaseHistoryTable.TRANSACTION_DATE_PROPERTY}) ${SQLVerb.VALUES} (?, ?, ?, ?, ?)`
		console.log(userData.length);
		for (let user of userData) {
			try {
				await this.triggerSQLQuery(insertInCustomerDetailsTable, [user.id, user.name, user.cashBalance]);
				for (let purchaseHistory of user.purchaseHistory) {
					await this.triggerSQLQuery(insertInPurchaseHistorTable, [user.id, purchaseHistory.dishName, purchaseHistory.restaurantName, purchaseHistory.transactionAmount, purchaseHistory.transactionDate]);
				}
			} catch (error) {
				console.log(error);
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