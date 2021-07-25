## Glints Task
Project is developed for the task given in glints horing process:
	- Stack Used
		- Language :TypeScript
		- Libraries: Express,Compression,mysql2
		- Database: MySQL

# Project Structure 
- Project has 4 directories and 1 file
	- data-models: contains all the data-models used in the task;
	- documentation: contains documentation of project structure and api endpints
	- server: Server module
	- etl_scripts: Scripts to migrate raw data to sql db.
	- environment.ts: Contains all the environments variable.

# Procedure to check
1. Enter the environment configuration which is requrired for the test.
2. Load Db using Raw Data, by running: 
```sh
	cd etl_Scripts
	npm i 
	npm start
```

3. Start the server, by running: 
```sh
	cd ../server
	npm i 
	npm start
```
-> Now your server is listening on the port 3000/defined in the environment file.


	