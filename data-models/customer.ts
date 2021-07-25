import { CustomerDetailsTable } from './sql-tables'
export class CustomerData {
	id: number;
	name: string;
	cashBalance: number

	constructor(id: number, name: string, cashBalance: number) {
		this.id = id;
		this.name = name;
		this.cashBalance = cashBalance;
	}

	static fromSQLResult(sqlResultObject: any) {
		let resturantMenuData = null;
		if (sqlResultObject) {
			resturantMenuData = new CustomerData(0, '', 0);
			resturantMenuData.id = sqlResultObject[CustomerDetailsTable.CUSTOMER_ID_PROPERTY] ? sqlResultObject[CustomerDetailsTable.CUSTOMER_ID_PROPERTY] : 0;
			resturantMenuData.name = sqlResultObject[CustomerDetailsTable.CUSTOMER_NAME_PROPERTY] ? sqlResultObject[CustomerDetailsTable.CUSTOMER_NAME_PROPERTY] : '';
			resturantMenuData.cashBalance = sqlResultObject[CustomerDetailsTable.CASH_BALANCE_PROPERTY] ? sqlResultObject[CustomerDetailsTable.CASH_BALANCE_PROPERTY] : 0;
		}
		return resturantMenuData;
	}

}
