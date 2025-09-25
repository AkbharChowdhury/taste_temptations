import express from 'express'
import dotenv from 'dotenv';
import axios from 'axios';
import { mealTypes, cuisines } from './recipe-tags.js';
import { titleCase, sortedArray, getRandomItem } from './public/js/helper/utils.js';
dotenv.config();

const API_KEY = process.env.FOOD_API_KEY;
const PORT = 3_000;
const RECORDS_PER_PAGE = 12;
const BASE_URL = 'https://api.spoonacular.com/recipes/';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const requestData = url => new Request(BASE_URL + url, { headers: { 'x-api-key': API_KEY } });

axios.defaults.headers['x-api-key'] = API_KEY;
axios.defaults.baseURL = BASE_URL;

const runApp = _ => {
    console.log(`Server listening on port ${PORT.toLocaleString()}`);
    // getNutritionLabelWidget(632678).then(console.log)
    // getRandomRecipes().then(console.log)
};
app.listen(PORT, _ => runApp());

app.get('/random', (req, res) => getRandomRecipes().then(data => res.send(data)));
app.get('/meals', (req, res) => {
    const sortedMeals = sortedArray(mealTypes);
    const html =
    /*html*/`
        <option selected value="">No preference</option>
        ${sortedMeals.map(meal => /*html*/`
            <option value="${meal}">${titleCase(meal)}</option>
                `).join().replaceAll(',', '')}
    `;

    res.send(html);

});

app.get('/cuisines', (req, res) => {
    const sortedCuisines = sortedArray(cuisines);
    const html = sortedCuisines.map(cuisine => /*html*/`
         <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${cuisine}" id="${cuisine}" name="cuisines">
            <label class="form-check-label" for="${cuisine}">
                ${cuisine}
            </label>
        </div>
        
        `).join().replaceAll(',', '')
    res.send(html);

});


app.post('/similar', (req, res) => {
    const id = req.body.id;
    getSimilarRecipes(id).then(data => res.send(data));
});


app.post('/nutrition-label', (req, res) => {
    const id = req.body.id;
    getNutritionLabelWidget(id).then(data => res.send(data));
});

app.post('/detail', (req, res) => {
    const id = req.body.id;
    getRecipeDetails(id).then(data => res.send(data))
});

app.post('/search', (req, res) => {
    const params = req.body.params;
    searchRecipes(params).then(recipes => res.send(recipes))
});

async function searchRecipes(urlSearchParams) {
    try {
        const params = new URLSearchParams(urlSearchParams);
        params.append('number', RECORDS_PER_PAGE);
        const response = await axios.get('complexSearch', { params });
        return response.data;
    } catch (error) {
        console.error(`There was an error fetching recipes: ${error}`)
    }

}

async function getSimilarRecipes(id) {
    try {
        const limit = 8;
        const params = new URLSearchParams({ number: limit });
        const response = await axios.get(`${id}/similar`, { params });
        return response.data;
    } catch (error) {
        console.error('There was an error fetching similar recipes')
        return error;
    }
}

async function randomRecipeURL(tags) {
    const url = `random?`;
    const params = new URLSearchParams({ 'number': RECORDS_PER_PAGE, 'include-tags': tags.join() });
    return `${url}${params.toString().replaceAll('%2C', ',')}`;
}

async function getRandomRecipes() {
    const randomCuisine = getRandomItem(cuisines);
    const randomMeal = getRandomItem(mealTypes);
    const tags = [randomMeal, randomCuisine];
    const params = new URLSearchParams({ 'number' : RECORDS_PER_PAGE, 'include-tags': tags.join() });
    const response = await axios.get('random', { params });
    return response.data;

}

async function getNutritionLabelWidget(id) {
    const headers = { 'Content-Type': 'text/html' };
    const url = `https://api.spoonacular.com/recipes/${id}/nutritionLabel?apiKey=${API_KEY}`;
    const response = await fetch(url, { headers });
    return await response.text();
}

async function getRecipeDetails(id) {
    try {
        const params = new URLSearchParams({ includeNutrition: true });
        const response = await axios.get(`${id}/information`, { params });
        return response.data;

    } catch (error) {
        console.error('There was an error fetching recipe details')
        return error;
    }
}