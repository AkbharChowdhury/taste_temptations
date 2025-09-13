import express from 'express'
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './recipe-tags.js';
import { titleCase, sortedArray, getRandomItem, getRandomMeals} from './public/js/helper/utils.js';
dotenv.config();

const PORT = 3_000;
const RECORDS_PER_PAGE = 12;
const BASE_URL = 'https://api.spoonacular.com/recipes/';
const API_KEY = process.env.FOOD_API_KEY;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const errorMessage = msg => console.error(msg);
const requestData = url => new Request(url, { headers: {'x-api-key' : API_KEY} });

const runApp = _ => console.log(`Server listening on port ${PORT.toLocaleString('en')}`);
app.listen(PORT, _ => runApp());

async function searchRecipes(urlSearchParams) {
    try {
    
        const paramsString =`number=${RECORDS_PER_PAGE}${urlSearchParams}`;
        const searchParams = new URLSearchParams(paramsString);
        const response = await fetch(requestData(`${BASE_URL}complexSearch?${searchParams.toString()}`));
        return await response.json();

    } catch (error) {
        errorMessage(`There was an error fetching recipes: ${error}`)
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

async function getSimilarRecipes(recipeID) {
    try {
        const limit = 8;
        const response = await fetch(requestData(`${BASE_URL}${recipeID}/similar?number=${limit}`));
        return await response.json();

    } catch (error) {
        errorMessage(`There was an error fetching similar recipes ${error.message}`)
    }
}








app.post('/similarRecipes', async (req, res) => {
    const recipeID = req.body.recipeID;
    getSimilarRecipes(recipeID).then(data => res.send(data));
});


   


const randomRecipeURL = tags => {
    const url = `${BASE_URL}random?`
    const params = new URLSearchParams();
    params.append('number', RECORDS_PER_PAGE);
    params.append('include-tags', tags.join());
    return `${url}${params.toString()}`;

}

async function getRandomRecipes() {
    const randomCuisine = getRandomItem(cuisines);
    const randomMeal = getRandomItem(mealTypes);
    const recipeTags = [randomMeal, randomCuisine];
    const url = randomRecipeURL(recipeTags);
    const response = await fetch(requestData(url));
    return await response.json();

}



app.get('/random-recipes', async (req, res) => getRandomRecipes().then(data => res.send(data)));
app.post('/detail', async (req, res) => {
    try {
        const recipeID = req.body.recipeID;
        const response = await fetch(requestData(`${BASE_URL}${recipeID}/information?${new URLSearchParams({includeNutrition: true}).toString()}`));
        res.send(await response.json());
    } catch (error) {
        errorMessage(`There was an error fetching recipe details ${error}`)

    }
});



app.post('/search', (req, res) => {

    const urlSearchParams = req.body.urlSearchParams;
    searchRecipes(urlSearchParams)
    .then(recipes => res.send(recipes))
    .catch(error => errorMessage(`there was an error fetching recipes ${error}`));
});