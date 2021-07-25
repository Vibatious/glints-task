import { MysqlConnection } from "./db/mysql-connection";
import { MigrateRestaurantToDB } from "./migrate-resturant-to-db";
import { MigrateUserToDB } from "./migrate-user-data-to-db";

const mysql = new MysqlConnection();
mysql.init().then(async () => {
	try {
		await migrateRawResturantToDB();
		await migrateRawUserToDB();
		mysql.closeConnection();
		process.exit();
	} catch (error) {
		console.log(error);
	}
});

async function migrateRawResturantToDB() {
	try {
		console.log('MigratingResturantData ...')
		const resturantMigration = new MigrateRestaurantToDB(mysql.getDB());
		await resturantMigration.init();
		console.log('ResturantDatamigrationComplete ...');
	} catch (error) {
		throw error;
	}
}


async function migrateRawUserToDB() {
	try {
		console.log('MigratingUserData ...')
		const userMigration = new MigrateUserToDB(mysql.getDB());
		await userMigration.init();
		console.log('UserDataMigrationComplete ...');
	} catch (error) {
		throw error
	}

}

