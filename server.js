import express, { json } from 'express'
import { Recipe } from './recipe.js';
import { errorMessages, handleError } from './error-utils.js';

const PORT = 3_000;

const recipe = new Recipe();
const ui = recipe.recipeUI;

const recipeErrors = errorMessages.recipe;
const uiErrors = errorMessages.ui;

const app = express();
const extractRequestValue = (req) => Object.values(req.body).toString();


app.listen(PORT, _ => console.log(`Server listening on port ${PORT.toLocaleString()}`));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/meals', (req, res) => {
    try {
        res.send(ui.meals());
    } catch (err) {
        handleError(res, err, uiErrors.meal);
    }
});
app.get('/cuisines', (req, res) => {
    try {
        res.send(ui.cuisines());
    } catch (err) {
        handleError(res, err, uiErrors.cuisine);
    }
});


app.get('/intolerances', (req, res) => {
    try {
        res.send(ui.intolerances());
    } catch (err) {
        handleError(res, err, uiErrors.intolerance);
    }
});

app.get('/record', (req, res) => {
    try {
        res.send(ui.record({ numItems: 4, nearestNumber: 5 }));
    } catch (err) {
        handleError(res, err, uiErrors.record);
    }
});

app.get('/random', (req, res) =>
    recipe.random()
        .then(recipes => res.send(recipes))
        .catch(err => handleError(res, err, recipeErrors.random)));
app.get('/search', (req, res) =>
    recipe.search(req.query)
        .then(recipes => res.send(recipes))
        .catch(err => handleError(res, err, recipeErrors.search))
);
app.post('/detail', (req, res) =>
    recipe.details(extractRequestValue(req))
        .then(recipes => res.send(recipes))
        .catch(err => handleError(res, err, recipeErrors.details)));

app.post('/similar', (req, res) =>
    recipe.similar(extractRequestValue(req))
        .then(recipes => res.send(recipes))
        .catch(err => handleError(res, err, recipeErrors.similar)));

app.post('/nutrition-label', (req, res) =>
    recipe.nutritionLabelWidget(extractRequestValue(req))
        .then(data => res.send(data))
        .catch(err => handleError(res, err, ui.nutrition)));