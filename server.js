import express from 'express'
import dotenv from 'dotenv';
import axios from 'axios';
import { mealTypes, cuisines } from './recipe-tags.js';
import { titleCase, sortedArray, getRandomItem , toHoursAndMinutes, calcDuration} from './public/js/helper/utils.js';

dotenv.config();

const API_KEY = process.env.FOOD_API_KEY;
const PORT = 3_000;
const RECORDS_PER_PAGE = 12;
const BASE_URL = 'https://api.spoonacular.com/recipes/';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const requestData = url => new Request( BASE_URL + url, { headers: { 'x-api-key': API_KEY } });
axios.defaults.headers['x-api-key'] = API_KEY;
axios.defaults.baseURL = BASE_URL;
const runApp = async _ =>  {
    console.log(`Server listening on port ${PORT.toLocaleString('en')}`);
};

app.listen(PORT, _ => runApp());

async function searchRecipes(urlSearchParams) {

    try {
        const params = new URLSearchParams(urlSearchParams);
        params.append('number', RECORDS_PER_PAGE + 1);
        const response = await axios.get('complexSearch', { params });
        return response.data;
    } catch (error) {
        console.error(`There was an error fetching recipes: ${error}`)
    }

}

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


async function getSimilarRecipes(id) {
    try {
        const limit = 8;
        const params = new URLSearchParams({number: limit});
        const response = await axios.get(`${id}/similar`, { params });
        return response.data;
    } catch (error) {
        console.error('There was an error fetching similar recipes')
        return error;
    }
}

app.post('/similarRecipes', async (req, res) => {
    const id = req.body.id;
    getSimilarRecipes(id).then(data => res.send(data));
});

const randomRecipeURL = tags => {
    const url = `random?`
    const params = new URLSearchParams();
    params.append('number', RECORDS_PER_PAGE);
    params.append('include-tags', tags.join());
    return `${url}${params.toString()}`;

}

async function getRandomRecipes() {
    const randomCuisine = getRandomItem(cuisines);
    const randomMeal = getRandomItem(mealTypes);
    const tags = [randomMeal, randomCuisine];
    const response = await fetch(requestData(randomRecipeURL(tags)));
    return await response.json();
}

app.get('/random-recipes', async (req, res) => getRandomRecipes().then(data => res.send(data)));

async function getRecipeDetails(id) {
    try {
        const params = new URLSearchParams({includeNutrition: true});
        const response = await axios.get(`${id}/information`, { params });
        return response.data;       

    } catch (error) {
        console.error('There was an error fetching recipe details')
        return error;
    }
}

app.post('/detail', (req, res) => {
    const id = req.body.id;
    getRecipeDetails(id)
        .then(data => res.send(data))
        .catch(error => res.send(error));
});

app.post('/search', (req, res) => {
    const params = req.body.params;
    searchRecipes(params)
    .then(recipes => res.send(recipes))
    .catch(error=> res.send(error));
});