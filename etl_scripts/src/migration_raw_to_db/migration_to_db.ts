import { MysqlConnection } from "./db/mysql-connection";
import { MigrateResturantToDB } from "./migrate-resturant-to-db";
import { MigrateUserToDB } from "./migrate-user-data-to-db";

const mysql = new MysqlConnection();
mysql.init().then(async () => {
	const resturantMigration = new MigrateResturantToDB(mysql.getDB());
	await resturantMigration.init();
	const userMigration = new MigrateUserToDB(mysql.getDB());
	await userMigration.init();
});


