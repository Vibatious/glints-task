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

app.get('/get-opened-resturants', async (req, res) => {
	const dateTime = req.query.dateTime;
	//dateTime in dd-mm-yyyy HH:mm
	try {
		if (dateTime) {
			const resturantData = await appServerAPI.getOpenedResturant(dateTime.toString());
			res.send(resturantData);
		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

app.get('/get-top-resturants', async (req, res) => {
	const { top, greaterThan, lessThan, fromPrice, toPrice } = req.query;
	try {
		if (top && fromPrice && toPrice && (greaterThan || lessThan)) {
			if (Number(greaterThan) >= 0) {
				const resturantData = await appServerAPI.getResturantHavingDishesGreaterThanInPriceRange(Number(top), Number(greaterThan), Number(fromPrice), Number(toPrice));
				res.send(resturantData);
			} else {
				if (Number(lessThan) > 1) {
					const resturantData = await appServerAPI.getResturantHavingDishesLesserThanInPriceRange(Number(top), Number(lessThan), Number(fromPrice), Number(toPrice));
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

app.get('/relevant-resturants', async (req, res) => {
	const { searchTerm } = req.query;
	try {
		if (searchTerm) {

		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

app.get('/relevant-dishes', async (req, res) => {
	const { searchTerm } = req.query;
	try {
		if (searchTerm) {

		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

app.get('/relevant-dishes', async (req, res) => {
	const { searchTerm } = req.query;
	try {
		if (searchTerm) {

		} else {
			res.status(400).send({ error: 'In sufficient Information' });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
})

app.get('/place-order/userid/:uid/resturantid/:rid/dishid/:did', async (req, res) => {
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
