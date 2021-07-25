import { Database } from "../database";
import moment from 'moment';
export class AppServerAPI {
	private db!: Database
	constructor() {
		this.db = new Database();
	}

	async getOpenedRestaurant(dateTime: string) {
		//dateTime in dd-mm-yyyy HH:mm
		return await this.db.getOpenedRestaurant(this.getDayIndex(dateTime), this.getTime(dateTime));
	}

	async getRestaurantHavingDishesGreaterThanInPriceRange(noOfRestaurant: number, atLeastNoOfDishes: number, fromPrice: number, toPrice: number) {
		return await this.db.getRestaurantHavingDishesGreaterThanInPriceRange(noOfRestaurant, atLeastNoOfDishes, fromPrice, toPrice);
	}


	async getRestaurantHavingDishesLesserThanInPriceRange(noOfRestaurant: number, atLeastNoOfDishes: number, fromPrice: number, toPrice: number) {
		return await this.db.getRestaurantHavingDishesLesserThanInPriceRange(noOfRestaurant, atLeastNoOfDishes, fromPrice, toPrice);
	}


	async getRestaurantOnSearchTerm(searchTerm: any) {
		return await this.db.getRestaurantOnSearchTerm(searchTerm);
	}

	async getDishesOnSearchTerm(searchTerm: any) {
		return await this.db.getDishesOnSearchTerm(searchTerm);
	}


	private getDayIndex(dateTime: string) {
		const day = moment(dateTime, 'dd-mm-yyyy HH:mm').format('ddd');
		return moment(day, 'ddd').isoWeekday();
	}

	private getTime(dateTime: string) {
		return moment(dateTime, 'dd-mm-yyyy HH:mm').format('HH:MM');
	}



}