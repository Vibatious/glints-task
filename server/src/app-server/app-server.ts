import express = require('express');
import bodyParser = require('body-parser');
import { environment } from '../environment'
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = express.Router();

app.use(router);


try {
	const server = app.listen(environment.port, () => {
	});
} catch (error) {

}
