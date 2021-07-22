import { SQLServer } from "../database";

export class AppServerAPI {
	private sqlConnection!: SQLServer
	constructor() {
		this.sqlConnection = new SQLServer();
	}
}