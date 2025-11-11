import express from 'express'
import { Recipe } from './recipe.js';
const PORT = 3_000;
const recipe = new Recipe();
const ui = recipe.recipeUI;
const app = express();
const getValue = req => Object.values(req.body).toString();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, _ => console.log(`Server listening on port ${PORT.toLocaleString()}`));
app.get('/meals', (req, res) => res.send(ui.meals()));
app.get('/cuisines', (req, res) => res.send(recipe.recipeUI.cuisines()));
app.get('/intolerance', (req, res) => res.send(ui.intolerance()));
app.get('/number', (req, res) => res.send(recipe.recipeUI.number(3,5)));
app.get('/random', (req, res) => recipe.random().then(data => res.send(data)));
app.post('/similar', (req, res) => recipe.similar(getValue(req)).then(data => res.send(data)));
app.post('/nutrition-label', (req, res) => recipe.nutritionLabelWidget(getValue(req)).then(data => res.send(data)));
app.post('/detail', (req, res) => recipe.details(getValue(req)).then(data => res.send(data)));
app.post('/search', (req, res) => recipe.search(getValue(req)).then(data => res.send(data)));
console.log(ui.number(3,5))
