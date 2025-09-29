import express from 'express'
import { Recipe } from './recipe.js';

const PORT = 3_000;
const recipe = new Recipe();
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const runApp = _ => { 
    console.log(`Server listening on port ${PORT.toLocaleString()}`);
   

    
};

app.listen(PORT, _ => runApp());
app.get('/random', (req, res) => recipe.random().then(data => res.send(data)));
app.get('/meals', (req, res) => res.send(recipe.sortedMeals()));
app.get('/cuisines', (req, res) => res.send(recipe.sortedCuisines()));
app.post('/similar', (req, res) => recipe.similar(req.body.id).then(data => res.send(data)));
app.post('/nutrition-label', (req, res) => recipe.nutritionLabelWidget(req.body.id).then(data => res.send(data)));
app.post('/detail', (req, res) => recipe.details(req.body.id).then(data => res.send(data)));
app.post('/search', (req, res) => recipe.search(req.body.params).then(recipes => res.send(recipes)));