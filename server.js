import express from 'express'
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './recipe-tags.js';
import { titleCase, sortedArray, getRandomItem, getRandomMeals } from './public/js/helper/utils.js';
dotenv.config();

const port = 3_000;
const RECORDS_PER_PAGE = 12;
const API_KEY = process.env.FOOD_API_KEY;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



const runApp = _ => {

    console.log(`Server listening on port ${port.toLocaleString('en')}`);
    console.log(titleCase('hello world'))
 

}

app.listen(port, _ => runApp());

async function searchRecipes(urlSearchParams) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?number=${RECORDS_PER_PAGE}&apiKey=${API_KEY}${urlSearchParams}`);
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
        const limit = 8;
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${API_KEY}&number=${limit}`);
        return await response.json();

    } catch (error) {
        console.error(`There was an error fetching similar recipes ${error.message}`)
    }
}


app.post('/similarRecipes', async (req, res) => {
    const recipeID = req.body.recipeID;
    getSimilarRecipes(recipeID).then(data => res.send(data));
});


const randomRecipeUrl = (tags) => `https://api.spoonacular.com/recipes/random?number=${RECORDS_PER_PAGE}&include-tags=${tags.join()}&apiKey=${API_KEY}`

async function getRandomRecipes() {

    const randomCuisine = getRandomItem(cuisines);
    const randomMeal = getRandomItem(mealTypes);
    const recipeTags = [randomMeal, randomCuisine];
    console.log(`search tags random ${recipeTags}`);
    const responseData = await fetch(randomRecipeUrl(recipeTags));
    return await responseData.json();



}



app.get('/random-recipes', async (req, res) => getRandomRecipes().then(data => res.send(data)));
app.post('/detail', async (req, res) => {
    try {
        const recipeID = req.body.recipeID;
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_KEY}&includeNutrition=true`);
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