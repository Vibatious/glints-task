import { ResultSetHeader } from 'mysql2';
import mysql = require('mysql2');
import moment from 'moment';
import { default as rsData } from '../raw-data/restaurant_with_menu.json';

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
		const resturantDetailsquery = "CREATE TABLE resturantDetails (resturantid INT NOT NULL AUTO_INCREMENT, resturantName varchar(255) NOT NULL, cashBalance DOUBLE, PRIMARY KEY (resturantid))"
		await this.triggerSQLQuery(resturantDetailsquery);
		const resturantPurchaseHistory = "CREATE TABLE resturantMenu (dishid INT NOT NULL AUTO_INCREMENT, resturantid INT NOT NULL, dishName varchar(1000) NOT NULL, dishPrice DOUBLE NOT NULL, PRIMARY KEY (dishid), FOREIGN KEY (resturantid) REFERENCES resturantDetails (resturantid))"
		await this.triggerSQLQuery(resturantPurchaseHistory);
		const resturantTimingsHistory = "CREATE TABLE resturantTimings (id int NOT NULL AUTO_INCREMENT, resturantid int NOT NULL, dayNum int NOT NULL, openingTime varchar(10) DEFAULT NULL, closingTime varchar(10) DEFAULT NULL, PRIMARY KEY (id), FOREIGN KEY (resturantid) REFERENCES resturantDetails(resturantid))"
		await this.triggerSQLQuery(resturantTimingsHistory);

	}

	async migrateDataToDb() {
		const insertInResturantDetailsTable = "INSERT INTO resturantDetails (`resturantName`, `cashBalance`) VALUES (?, ?)";
		const insertInResturantMenuTable = "INSERT INTO resturantMenu (`resturantid`,`dishName`, `dishPrice`) VALUE (?, ?, ?)";
		const insertInResturantTimingTable = "INSERT INTO resturantTimings (`resturantid`,`dayNum`, `openingTime`,`closingTime`) VALUE (?, ?, ?, ?)";
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