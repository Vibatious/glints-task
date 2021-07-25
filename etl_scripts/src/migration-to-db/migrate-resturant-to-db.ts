import { ResultSetHeader } from 'mysql2';
import mysql = require('mysql2');
import moment from 'moment';
import { default as rsData } from '../raw-data/restaurant_with_menu.json';
import { RestaurantDetailTable, RestaurantMenuTable, RestaurantTimingsTable, SQLVerb } from '../../../data-models'
export class RestaurantTimeMeta {
	dayIndex: number;
	closingTime: string;
	openingTime: string;

	constructor() {
		this.dayIndex = 0;
		this.closingTime = '';
		this.openingTime = '';
	}
}

export class MigrateRestaurantToDB {
	private db!: mysql.Connection;
	constructor(db: mysql.Connection) {
		this.db = db;
	}

	async init() {
		await this.createRestaurantTable();
		await this.migrateDataToDb();
	}

	private async createRestaurantTable() {
		const resturantDetailsquery = `${SQLVerb.CREATE} ${SQLVerb.TABLE} ${RestaurantDetailTable.TABLE_NAME} (${RestaurantDetailTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL} ${SQLVerb.AUTO_INCREMENT}, ${RestaurantDetailTable.RESTAURANT_NAME_PROPERTY} varchar(255) ${SQLVerb.NOT_NULL}, ${RestaurantDetailTable.CASH_BALANCE_PROPERTY} DOUBLE, ${SQLVerb.PRIMARY_KEY} (${RestaurantDetailTable.RESTAURANT_ID_PROPERTY}))`
		await this.triggerSQLQuery(resturantDetailsquery);
		const resturantPurchaseHistory = `${SQLVerb.CREATE} ${SQLVerb.TABLE} ${RestaurantMenuTable.TABLE_NAME} (${RestaurantMenuTable.DISH_ID_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL} ${SQLVerb.AUTO_INCREMENT}, ${RestaurantMenuTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL}, ${RestaurantMenuTable.DISH_NAME_PROPERTY} varchar(1000) ${SQLVerb.NOT_NULL}, ${RestaurantMenuTable.DISH_PRICE_PROPERTY} DOUBLE ${SQLVerb.NOT_NULL}, ${SQLVerb.PRIMARY_KEY} (${RestaurantMenuTable.DISH_ID_PROPERTY}), ${SQLVerb.FOREIGN_KEY} (${RestaurantMenuTable.RESTAURANT_ID_PROPERTY}) ${SQLVerb.REFERENCES} ${RestaurantDetailTable.TABLE_NAME} (${RestaurantMenuTable.RESTAURANT_ID_PROPERTY}))`
		await this.triggerSQLQuery(resturantPurchaseHistory);
		const resturantTimingsHistory = `${SQLVerb.CREATE} ${SQLVerb.TABLE} ${RestaurantTimingsTable.TABLE_NAME} (${RestaurantTimingsTable.ID_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL} ${SQLVerb.AUTO_INCREMENT}, ${RestaurantTimingsTable.RESTAURANT_ID_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL}, ${RestaurantTimingsTable.DAY_NUM_PROPERTY} ${SQLVerb.INT} ${SQLVerb.NOT_NULL}, ${RestaurantTimingsTable.OPENING_TIME_PROPERTY} TIME ${SQLVerb.DEFAULT} NULL, ${RestaurantTimingsTable.CLOSING_TIME_PROPERTY} TIME ${SQLVerb.DEFAULT} NULL, ${SQLVerb.PRIMARY_KEY} (${RestaurantTimingsTable.ID_PROPERTY}), ${SQLVerb.FOREIGN_KEY} (${RestaurantTimingsTable.RESTAURANT_ID_PROPERTY}) ${SQLVerb.REFERENCES} ${RestaurantDetailTable.TABLE_NAME}(${RestaurantTimingsTable.RESTAURANT_ID_PROPERTY}))`
		await this.triggerSQLQuery(resturantTimingsHistory);

	}

	async migrateDataToDb() {
		const insertInRestaurantDetailsTable = `${SQLVerb.INSERT} ${SQLVerb.INTO} ${RestaurantDetailTable.TABLE_NAME} (${RestaurantDetailTable.RESTAURANT_NAME_PROPERTY}, ${RestaurantDetailTable.CASH_BALANCE_PROPERTY}) ${SQLVerb.VALUES} (?, ?)`;
		const insertInRestaurantMenuTable = `${SQLVerb.INSERT} ${SQLVerb.INTO} ${RestaurantMenuTable.TABLE_NAME} (${RestaurantMenuTable.RESTAURANT_ID_PROPERTY},${RestaurantMenuTable.DISH_NAME_PROPERTY}, ${RestaurantMenuTable.DISH_PRICE_PROPERTY}) ${SQLVerb.VALUES} (?, ?, ?)`;
		const insertInRestaurantTimingTable = `${SQLVerb.INSERT} ${SQLVerb.INTO} ${RestaurantTimingsTable.TABLE_NAME} (${RestaurantTimingsTable.RESTAURANT_ID_PROPERTY},${RestaurantTimingsTable.DAY_NUM_PROPERTY}, ${RestaurantTimingsTable.OPENING_TIME_PROPERTY},${RestaurantTimingsTable.CLOSING_TIME_PROPERTY}) ${SQLVerb.VALUES} (?, ?, ?, ?)`;
		for (let resturant of rsData) {
			try {
				const timingsMeta = this.getRestaurantOpeningDetails(resturant.openingHours);
				const data = await this.triggerSQLQuery(insertInRestaurantDetailsTable, [resturant.restaurantName, resturant.cashBalance]);
				for (let menu of resturant.menu) {
					await this.triggerSQLQuery(insertInRestaurantMenuTable, [data.insertId, menu.dishName, menu.price]);
				}
				for (let time of timingsMeta) {
					await this.triggerSQLQuery(insertInRestaurantTimingTable, [data.insertId, time.dayIndex, time.openingTime, time.closingTime]);
				}
			} catch (error) {
				console.log(error);
			}
		}
	}

	private getRestaurantOpeningDetails(openingHoursString: string): RestaurantTimeMeta[] {
		const timeList = openingHoursString.split('/');
		const timeMetas: RestaurantTimeMeta[] = []
		for (let list of timeList) {
			const firstNumberIndex = list.search(/[0-9]/);
			const timings = list.slice(firstNumberIndex);
			const daysString = list.slice(0, firstNumberIndex).trim();
			const [openingTime, closingTime] = timings.split('-');
			const days = daysString.split('-');
			days.forEach(day => {
				let timeMeta: RestaurantTimeMeta = new RestaurantTimeMeta();
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