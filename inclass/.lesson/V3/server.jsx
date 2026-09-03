import express from 'express';
import Database from 'better-sqlite3';

/*-------------------------------------------------------
- Exercise
- create ItemView component in ItemView.jsx
- create Review sub-component in ItemView.jsx
- update POST handler for adding reviews
-------------------------------------------------------*/

import { Hello } from './app/Hello.jsx';

const PORT = 8080;

const db = new Database('shopping.sqlite');

const app = express();
app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));

function send(res, element) {
	res.send('<!DOCTYPE html>' + renderToString(element));
}

app.get('/items', (req, res) => {
	const items = db.prepare('SELECT * FROM item').all();

	send(res, <Hello />);
});

app.get('/item_view/:item_id', (req, res) => {
	const itemId = parseInt(req.params.item_id);
	
	const item = db.prepare('SELECT * FROM item WHERE id = ?').get(itemId);
	if (!item) return res.status(404).send('No such item.');

	const reviews = db.prepare('SELECT * FROM review WHERE item_id = ?').all(itemId);

	send(res, <ItemView item={item} reviews={reviews} />);
	
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}/items`));
