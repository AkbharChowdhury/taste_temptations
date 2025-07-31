import express from 'express'
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './food.js';
import { titleCase, sortedArray, getRandomItem } from './public/js/helper/utils.js';

const port = 3_000;
const app = express();
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();
const RECORDS_PER_PAGE = 12;
const API_KEY = process.env.FOOD_API_KEY;

const runApp = _ => {

    console.log(`Server listening on port ${port.toLocaleString('en')}`);
    getRandomRecipes().then(console.log)

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

function getRandomMeals(numberOfMeals) {
    let randomMeals = new Set();
    for (let index = 0; index < numberOfMeals; index++) {
        randomMeals.add(getRandomItem(mealTypes));
    }
    if (randomMeals.size === 1) {
        while (randomMeals.size === 1) {
            randomMeals.add(getRandomItem(mealTypes));

        }

    }
    return randomMeals;



}


async function jsonFetchRequest(url){
    try {
        const response = await fetch(url);
        return await response.json();
        
    } catch (error) {
        console.log('there was an error fetching json response ' + error.message)
        
    }
}
const randomRecipeUrl = (tags) => `https://api.spoonacular.com/recipes/random?number=${RECORDS_PER_PAGE}&include-tags=${tags.join()}&apiKey=${API_KEY}`
// async function getRandomRecipes() {

//     try {
//         const randomCuisine = getRandomItem(cuisines);
//         const randomMeals =  Array.from(getRandomMeals(2));
//         const tags = [randomMeals, randomCuisine];
//         const response = await fetch(randomRecipeUrl(tags));
//         const data =  await response.json();

//         if (data.recipes.length > 0) {
//             console.log(`more than 1 random meal including ${randomMeals}`);
//             return data;
//         }
//         console.log('had to reduce to a single random meal ')
//         const randomMeal = getRandomItem(mealTypes);
//         const urlResponse = await fetch(randomRecipeUrl([randomMeal, randomCuisine]));
//         return await urlResponse.json();

  
        
//     } catch (error) {
//         console.log(`There was an error fetching random recipes from server side ${error.message}`)
//     }

// }


async function getRandomRecipes() {

    try {
        const randomCuisine = getRandomItem(cuisines);
        const randomMeals = Array.from(getRandomMeals(2));
        const tags = [randomMeals, randomCuisine];
        let url = randomRecipeUrl(tags);
        jsonFetchRequest(url).then(data => {

            if (data.recipes.length > 0) {
                console.log(`more than 1 random meal including ${randomMeals}`);
                return data;
            }

            console.log('had to reduce to a single random meal ')
            const randomMeal = getRandomItem(mealTypes)
            url = randomRecipeUrl([randomMeal, randomCuisine]);
            jsonFetchRequest(url).then(data => data);


        });

        
    } catch (error) {
        console.log(`There was an error fetching random recipes from server side ${error.message}`)
    }

}



app.get('/random-recipes', async (req, res) => getRandomRecipes().then(data => res.send(data)));

// app.post('/detail', async (req, res) => {
//     try {

//         const recipeID = req.body.recipeID;
//         const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_KEY}&includeNutrition=true`);
//         res.send(await response.json());
//     } catch (error) {
//         console.error(`There was an error fetching recipe details`);

//     }
// });
app.post('/detail', (req, res) => {

    const recipeID = req.body.recipeID;
    const url = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_KEY}&includeNutrition=true`;
    jsonFetchRequest(url).then(recipes => res.send(recipes))
        .catch(error => console.error(`there was an error fetching recipe details ${error.message}`));
});


app.post('/search', (req, res) => {

    const urlSearchParams = req.body.urlSearchParams;
    searchRecipes(urlSearchParams).then(recipes => res.send(recipes))
        .catch(error => console.error(`there was an error fetching recipes ${error.message}`));
});