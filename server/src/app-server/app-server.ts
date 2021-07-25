import express = require('express');
import bodyParser = require('body-parser');
import { environment } from '../../../environment'
import { AppServerAPI } from '../app-server-api/app-server-api';
import compression = require('compression');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression())
let appServerAPI: AppServerAPI;
const init = () => {
	appServerAPI = new AppServerAPI();
}
app.get('/heartbeat', (req, res) => {
	try {
		res.send('❤️❤️❤️❤️❤️');
	} catch (error) {
		res.status(503).send('💔💔');
	}
});

app.get('/getOpenedRestaurants', async (req, res) => {
	const dateTime = req.query.dateTime;
	//dateTime in dd-mm-yyyy HH:mm
	try {
		if (dateTime) {
			const resturantData = await appServerAPI.getOpenedRestaurant(dateTime.toString());
			res.send(resturantData);
		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

app.get('/getTopRestaurants', async (req, res) => {
	const { top, greaterThan, lessThan, fromPrice, toPrice } = req.query;
	try {
		if (top && fromPrice && toPrice && (greaterThan || lessThan)) {
			if (Number(greaterThan) >= 0) {
				const resturantData = await appServerAPI.getRestaurantHavingDishesGreaterThanInPriceRange(Number(top), Number(greaterThan), Number(fromPrice), Number(toPrice));
				res.send(resturantData);
			} else {
				if (Number(lessThan) > 1) {
					const resturantData = await appServerAPI.getRestaurantHavingDishesLesserThanInPriceRange(Number(top), Number(lessThan), Number(fromPrice), Number(toPrice));
					res.send(resturantData);
				} else {
					res.status(400).send({ error: 'In sufficient Information' });
				}
			}
		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

app.get('/relevantRestaurants', async (req, res) => {
	const { searchTerm } = req.query;
	try {
		if (searchTerm) {
			const resturantData = await appServerAPI.getRestaurantOnSearchTerm(searchTerm)
			res.send(resturantData);
		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

app.get('/relevantDishes', async (req, res) => {
	const { searchTerm } = req.query;
	try {
		if (searchTerm) {
			const dishData = await appServerAPI.getDishesOnSearchTerm(searchTerm)
			res.send(dishData);
		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

app.get('/placeOrder/userid/:uid/resturantid/:rid/dishid/:did', async (req, res) => {
	const { uid, rid, did } = req.query;
	try {
		if (uid && rid && did) {

		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

try {
	const server = app.listen(environment.port, () => {
		init();
	});
} catch (error) {

}
