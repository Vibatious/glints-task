import { ResultSetHeader } from 'mysql2';
import mysql = require('mysql2');
import moment from 'moment';
import { default as rsData } from '../raw-data/restaurant_with_menu.json';
import { ResturantDetailTable, ResturantMenuTable, ResturantTimingsTable } from '../../../sql-tables'
export class ResturantTimeMeta {
	dayIndex: number;
	closingTime: string;
	openingTime: string;

	constructor() {
		this.dayIndex = 0;
		this.closingTime = '';
		this.openingTime = '';
	}
}

export class MigrateResturantToDB {
	private db!: mysql.Connection;
	constructor(db: mysql.Connection) {
		this.db = db;
	}

	async init() {
		await this.createResturantTable();
		await this.migrateDataToDb();
	}

	private async createResturantTable() {
		const resturantDetailsquery = `CREATE TABLE ${ResturantDetailTable.TABLE_NAME} (${ResturantDetailTable.RESTURANT_ID_PROPERTY} INT NOT NULL AUTO_INCREMENT, ${ResturantDetailTable.RESTURANT_NAME_PROPERTY} varchar(255) NOT NULL, ${ResturantDetailTable.CASH_BALANCE_PROPERTY} DOUBLE, PRIMARY KEY (${ResturantDetailTable.RESTURANT_ID_PROPERTY}))`
		await this.triggerSQLQuery(resturantDetailsquery);
		const resturantPurchaseHistory = `CREATE TABLE ${ResturantMenuTable.TABLE_NAME} (${ResturantMenuTable.DISH_ID_PROPERTY} INT NOT NULL AUTO_INCREMENT, ${ResturantMenuTable.RESTURANT_ID_PROPERTY} INT NOT NULL, ${ResturantMenuTable.DISH_NAME_PROPERTY} varchar(1000) NOT NULL, ${ResturantMenuTable.DISH_PRICE_PROPERTY} DOUBLE NOT NULL, PRIMARY KEY (${ResturantMenuTable.DISH_ID_PROPERTY}), FOREIGN KEY (${ResturantMenuTable.RESTURANT_ID_PROPERTY}) REFERENCES ${ResturantDetailTable.TABLE_NAME} (${ResturantMenuTable.RESTURANT_ID_PROPERTY}))`
		await this.triggerSQLQuery(resturantPurchaseHistory);
		const resturantTimingsHistory = `CREATE TABLE ${ResturantTimingsTable.TABLE_NAME} (${ResturantTimingsTable.ID_PROPERTY} int NOT NULL AUTO_INCREMENT, ${ResturantTimingsTable.RESTURANT_ID_PROPERTY} int NOT NULL, ${ResturantTimingsTable.DAY_NUM_PROPERTY} int NOT NULL, ${ResturantTimingsTable.OPENING_TIME_PROPERTY} TIME DEFAULT NULL, ${ResturantTimingsTable.CLOSING_TIME_PROPERTY} TIME DEFAULT NULL, PRIMARY KEY (${ResturantTimingsTable.ID_PROPERTY}), FOREIGN KEY (${ResturantTimingsTable.RESTURANT_ID_PROPERTY}) REFERENCES ${ResturantDetailTable.TABLE_NAME}(${ResturantTimingsTable.RESTURANT_ID_PROPERTY}))`
		await this.triggerSQLQuery(resturantTimingsHistory);

	}

	async migrateDataToDb() {
		const insertInResturantDetailsTable = `INSERT INTO ${ResturantDetailTable.TABLE_NAME} (${ResturantDetailTable.RESTURANT_NAME_PROPERTY}, ${ResturantDetailTable.CASH_BALANCE_PROPERTY}) VALUES (?, ?)`;
		const insertInResturantMenuTable = `INSERT INTO ${ResturantMenuTable.TABLE_NAME} (${ResturantMenuTable.RESTURANT_ID_PROPERTY},${ResturantMenuTable.DISH_NAME_PROPERTY}, ${ResturantMenuTable.DISH_PRICE_PROPERTY}) VALUE (?, ?, ?)`;
		const insertInResturantTimingTable = `INSERT INTO ${ResturantTimingsTable.TABLE_NAME} (${ResturantTimingsTable.RESTURANT_ID_PROPERTY},${ResturantTimingsTable.DAY_NUM_PROPERTY}, ${ResturantTimingsTable.OPENING_TIME_PROPERTY},${ResturantTimingsTable.CLOSING_TIME_PROPERTY}) VALUE (?, ?, ?, ?)`;
		for (let resturant of rsData) {
			const timingsMeta = this.getResturantOpeningDetails(resturant.openingHours);
			const data = await this.triggerSQLQuery(insertInResturantDetailsTable, [resturant.restaurantName, resturant.cashBalance]);
			for (let menu of resturant.menu) {
				await this.triggerSQLQuery(insertInResturantMenuTable, [data.insertId, menu.dishName, menu.price]);
			}
			for (let time of timingsMeta) {
				await this.triggerSQLQuery(insertInResturantTimingTable, [data.insertId, time.dayIndex, time.openingTime, time.closingTime]);
			}
		}
	}

	private getResturantOpeningDetails(openingHoursString: string): ResturantTimeMeta[] {
		const timeList = openingHoursString.split('/');
		const timeMetas: ResturantTimeMeta[] = []
		for (let list of timeList) {
			const firstNumberIndex = list.search(/[0-9]/);
			const timings = list.slice(firstNumberIndex);
			const daysString = list.slice(0, firstNumberIndex).trim();
			const [openingTime, closingTime] = timings.split('-');
			const days = daysString.split('-');
			days.forEach(day => {
				let timeMeta: ResturantTimeMeta = new ResturantTimeMeta();
				timeMeta.dayIndex = this.getWeekDayNumber(day);
				timeMeta.openingTime = this.getTimeInProperFormat(openingTime);
				timeMeta.closingTime = this.getTimeInProperFormat(closingTime);
				timeMetas.push(timeMeta);
			});
		}
		return timeMetas;
	}

	private getWeekDayNumber(weekDay: string) {
		return moment(weekDay, 'ddd').isoWeekday();
	}

	private getTimeInProperFormat(time: string) {
		return moment(time, 'hh:mm a').format('HH:mm')
	}

	private triggerSQLQuery(query: string, values: any[] = []): Promise<mysql.ResultSetHeader> {
		return new Promise((resolve, reject) => {
			this.db.execute(query, values, (err, result, fields) => {
				if (err) {
					console.log(err)
					reject(err);
				}
				if (result) {
					resolve(result as ResultSetHeader);
				}
			});
		});
	}



}