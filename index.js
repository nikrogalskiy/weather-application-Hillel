const express = require('express');
const path = require('path');
const { v4 } = require('uuid');
const PORT = process.env.PORT || 3000;
let app = express();
let CITIES = [];
app.use(express.json());

app.post('/api/cities', (req, res) => {
	const city = { ...req.body, id: v4() };
	if (city.cod < 400) {
		CITIES.push(city);
	}
	res.status(201).json(city);
});

app.get('/api/cities', (req, res) => {
	res.status(200).json(CITIES);
});

app.delete('/api/cities/:id', (req, res) => {
	CITIES = CITIES.filter(item => item.id !== req.params.id);
	res.status(200).json({ message: 'Контакт был удален' });
});

app.put('/api/cities/:id', (req, res) => {
	const idx = CITIES.findIndex(item => item.id === req.params.id);
	CITIES[idx] = { ...req.body, id: v4() };
	// if (idx.cod < 400) {
	// 	CITIES[idx] = { ...req.body, id: v4() };
	// }
	res.json(CITIES[idx]);
});

app.use(express.static(path.resolve(__dirname, 'client')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server has been started, port ${PORT}...`);
});