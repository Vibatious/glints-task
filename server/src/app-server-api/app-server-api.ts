import { Database } from "../database";
import moment from 'moment';
export class AppServerAPI {
	private db!: Database
	constructor() {
		this.db = new Database();
	}

	async getOpenedResturant(dateTime: string) {
		//dateTime in dd-mm-yyyy HH:mm
		return await this.db.getOpenedResturant(this.getDayIndex(dateTime), this.getTime(dateTime));
	}

	async getResturant(dateTime: string) {
		//dateTime in dd-mm-yyyy HH:mm
		return await this.db.getOpenedResturant(this.getDayIndex(dateTime), this.getTime(dateTime));
	}


	private getDayIndex(dateTime: string) {
		const day = moment(dateTime, 'dd-mm-yyyy HH:mm').format('ddd');
		return moment(day, 'ddd').isoWeekday();
	}

	private getTime(dateTime: string) {
		return moment(dateTime, 'dd-mm-yyyy HH:mm').format('HH:MM');
	}



}