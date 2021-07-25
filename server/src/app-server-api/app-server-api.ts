import { Database } from "../database";
import moment from 'moment';
import { CustomerData, CustomerPurchaseHistory, RestaurantData, RestaurantMenuData } from "../../../data-models";
export class AppServerAPI {
	private db!: Database
	constructor() {
		this.db = new Database();
	}

	async getOpenedRestaurant(dateTime: string): Promise<RestaurantData[]> {
		//dateTime in dd-MM-yyyy HH:mm
		return await this.db.getOpenedRestaurant(this.getDayIndex(dateTime), this.getTime(dateTime));
	}

	async getRestaurantHavingDishesGreaterThanInPriceRange(noOfRestaurant: number, atLeastNoOfDishes: number, fromPrice: number, toPrice: number): Promise<RestaurantData[]> {
		return await this.db.getRestaurantHavingDishesGreaterThanInPriceRange(noOfRestaurant, atLeastNoOfDishes, fromPrice, toPrice);
	}


	async getRestaurantHavingDishesLesserThanInPriceRange(noOfRestaurant: number, atLeastNoOfDishes: number, fromPrice: number, toPrice: number): Promise<RestaurantData[]> {
		return await this.db.getRestaurantHavingDishesLesserThanInPriceRange(noOfRestaurant, atLeastNoOfDishes, fromPrice, toPrice);
	}


	async getRestaurantOnSearchTerm(searchTerm: any): Promise<RestaurantData[]> {
		return await this.db.getRestaurantOnSearchTerm(searchTerm);
	}

	async getDishesOnSearchTerm(searchTerm: any): Promise<RestaurantMenuData[]> {
		return await this.db.getDishesOnSearchTerm(searchTerm);
	}

	async placeOrder(dishid: number, userid: number, restaurantid: number): Promise<CustomerPurchaseHistory> {
		try {
			const user: CustomerData = (await this.db.userInfo(userid))[0];
			console.log(user);
			const dishData = (await this.db.getDishInfo(dishid, restaurantid))[0];
			if (user.cashBalance < dishData.price) {
				throw Error('Insufficient Balance');
			} else {
				user.cashBalance = user.cashBalance - dishData.price;
				const pruchaseHistory = new CustomerPurchaseHistory(user.id, dishData.dishName, dishData.restaurantName, dishData.price, this.getCurrentTime());
				await this.db.addPaymentHistory(pruchaseHistory);
				await this.db.updateUserCashBalance(user.cashBalance, userid);
				return pruchaseHistory;
			}
		} catch (error) {
			throw error;
		}

	}


	private getDayIndex(dateTime: string) {
		const day = moment(dateTime, 'DD/MM/YYYY HH:mm').format('ddd');
		return moment(day, 'ddd').isoWeekday();
	}
	private getCurrentTime() {
		return moment().format('MM/DD/YYYY hh:mm A');
	}

	private getTime(dateTime: string) {
		return moment(dateTime, 'DD/MM/YYYY HH:mm').format('HH:mm');
	}



}