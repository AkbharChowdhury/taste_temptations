import express from 'express'
import { Recipe } from './recipe.js';

const PORT = 3_000;
const recipe = new Recipe();

const ui = recipe.recipeUI;
const getValue = req => Object.values(req.body).toString();
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, _ => console.log(`Server listening on port ${PORT.toLocaleString()}`));

app.get('/meals', (req, res) => res.send(ui.meals()));
app.get('/cuisines', (req, res) => res.send(ui.cuisines()));
app.get('/intolerances', (req, res) => res.send(ui.intolerances()));
app.get('/record', (req, res) => res.send(ui.record({numItems: 4, nearestNumber: 5})));
app.get('/random', (req, res) => recipe.random().then(data => res.send(data)));
app.post('/search', (req, res) => recipe.search(getValue(req)).then(data => res.send(data)));
app.post('/detail', (req, res) => recipe.details(getValue(req)).then(data => res.send(data)));
app.post('/similar', (req, res) => recipe.similar(getValue(req)).then(data => res.send(data)));
app.post('/nutrition-label', (req, res) => recipe.nutritionLabelWidget(getValue(req)).then(data => res.send(data)));



