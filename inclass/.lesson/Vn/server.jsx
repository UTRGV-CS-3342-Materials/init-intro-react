import express from 'express';
import { renderToString } from 'react-dom/server';
import Database from 'better-sqlite3';

import { Items } from './app/Items.jsx';
import { ItemView } from './app/ItemView.jsx';
import { Hello } from './app/Hello.jsx';

const PORT = 8080;

// Paths are relative to the project root, because that is where `npm start` runs.
const db = new Database('shopping.sqlite');

const app = express();
app.use(express.static('static'));

// Without this, req.body is undefined and every field reads as undefined.
app.use(express.urlencoded({ extended: false }));

// This is the whole trick. res.render() called a template engine;
// renderToString() calls a function that returns a string. Same job.
function send(res, element) {
	res.send('<!DOCTYPE html>' + renderToString(element));
}

// The only rule so far: neither field may be blank. Note that NOT NULL in the
// schema does not catch this -- "" is a perfectly good non-null string.
function validateReview(values) {
	const errors = {};
	if (!values.author.trim()) errors.author = 'Please give a name.';
	if (!values.content.trim()) errors.content = 'Please write something.';
	return errors;
}

app.get('/items', (req, res) => {
	const items = db.prepare('SELECT * FROM item').all();
	send(res, <Items items={items} />);
});

app.get('/item_view/:item_id', (req, res) => {
	// parseInt('abc') is NaN, and the id in the URL is whatever the caller typed.
	// Without this check the query returns nothing and item.name throws.
	const itemId = parseInt(req.params.item_id);
	const item = db.prepare('SELECT * FROM item WHERE id = ?').get(itemId);
	if (!item) return res.status(404).send('No such item.');

	const reviews = db.prepare('SELECT * FROM review WHERE item_id = ?').all(itemId);
	send(res, <ItemView item={item} reviews={reviews} />);
});

app.post('/item_view/:item_id', (req, res) => {
	// Same check as the GET. The id is user input on both verbs.
	const itemId = parseInt(req.params.item_id);
	const item = db.prepare('SELECT * FROM item WHERE id = ?').get(itemId);
	if (!item) return res.status(404).send('No such item.');

	// A missing field is undefined, not "", so normalise before validating.
	const values = {
		author: req.body.author ?? '',
		content: req.body.content ?? '',
	};
	const errors = validateReview(values);

	if (Object.keys(errors).length > 0) {
		// Re-render, rather than redirect. A redirect cannot carry what the user
		// typed, and losing their text on a validation error is unforgivable.
		// So the success path and the failure path answer differently:
		// success redirects, failure renders. Remember this asymmetry.
		const reviews = db.prepare('SELECT * FROM review WHERE item_id = ?').all(itemId);
		res.status(400);
		return send(res, <ItemView item={item} reviews={reviews} values={values} errors={errors} />);
	}

	db.prepare(
		'INSERT INTO review (item_id, author, content) VALUES (?, ?, ?)',
	).run(itemId, values.author.trim(), values.content.trim());

	// POST-Redirect-Get: answer a POST with a redirect so the browser's history
	// holds a GET. Without it, reloading the page re-submits the review.
	res.redirect(`/item_view/${itemId}`);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}/items`));
