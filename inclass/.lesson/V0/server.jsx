import express from 'express';
mport sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const PORT = 8080;

const db = await open({
	filename: 'shopping.sqlite',
	driver: sqlite3.Database,
});

const app = express();
app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));

app.get('/items', async (req, res) => {
	const items = await db.all('SELECT * FROM item');

	res.send("Display all items here.");
});

app.get('/item_view/:item_id', async (req, res) => {
	const itemId = parseInt(req.params.item_id);
	const item = await db.get('SELECT * FROM item WHERE id = ?', itemId);
	if (!item) return res.status(404).send('No such item.');

	const reviews = await db.all('SELECT * FROM review WHERE item_id = ?', itemId);

	res.send(`Display item ${itemId} and its reviews here.`);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}/items`));
