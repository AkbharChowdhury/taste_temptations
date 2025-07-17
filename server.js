import express from 'express'
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './food.js';
import { titleCase, sortedArray } from './public/js/helper/utils.js';

const port = 3_000;
const app = express();
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

const getFoodAPIKey = () => process.env.FOOD_API_KEY;

const runApp = _ => {
    
    console.log(`Server listening on port ${port.toLocaleString('en')}`);
}
app.listen(port, _ => runApp());

async function searchRecipes(urlSearchParams) {
    try {
        const FOOD_API_KEY = getFoodAPIKey();
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${FOOD_API_KEY}${urlSearchParams}`);
        return await response.json();

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

async function getSimilarRecipes(recipeID) {
    try {
        const FOOD_API_KEY = getFoodAPIKey();
        const limit = 8;
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${FOOD_API_KEY}&number=${limit}`);
        return await response.json();

    } catch (error) {
        console.error(`There was an error fetching similar recipes ${error.message}`)
    }
}


app.post('/similarRecipes', async (req, res) => {
    const recipeID = req.body.recipeID;
    getSimilarRecipes(recipeID).then(data => res.send(data));
});


async function getRandomRecipes() {

    try {
        const FOOD_API_KEY = getFoodAPIKey()
        const TAGS = ['Asian', 'dessert'];
        const limit = 9;
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=${limit}&include-tags=${TAGS.join()}&apiKey=${FOOD_API_KEY}`);
        return await response.json();
    } catch (error) {
        res.send(`There was an error fetching random recipes from server side ${error.message}`)
    }

}
app.get('/random-recipes', async (req, res) => getRandomRecipes().then(data => res.send(data)));

app.post('/detail', async (req, res) => {
    try {

        const recipeID = req.body.recipeID;
        const FOOD_API_KEY = getFoodAPIKey();
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${FOOD_API_KEY}&includeNutrition=true`);
        res.send(await response.json());
    } catch (error) {
        console.error(`There was an error fetching recipe details`);

    }
});



app.post('/search', (req, res) => {

    const urlSearchParams = req.body.urlSearchParams;
    searchRecipes(urlSearchParams).then(recipes => res.send(recipes))
        .catch(error => console.error(`there was an error fetching recipes ${error.message}`));
});