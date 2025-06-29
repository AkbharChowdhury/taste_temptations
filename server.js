import express from 'express'
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './food.js';
import { titleCase, sortedArray } from './public/js/utils.js';


const app = express();
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const getFoodAPIKey = () => {
    dotenv.config();
    return process.env.FOOD_API_KEY;
}
app.listen(3000, () => {
    console.log('Server listening on port 3000');
    // const isBetween = (x, min, max) => x >= min && x <= max;


    // const nutritionColour = {
    //     'fat': (value) => {
    //         const isLow = isBetween(value, 0, 3);
    //         const IsMed = isBetween(value, 3.1, 17.5);

    //         if (isLow) return 'green';
    //         if (IsMed) return 'orange';
    //         return 'red';

    //     }
    // }
    // console.log(nutritionColour.fat(21))

});



async function searchRecipes(urlSearchParams) {
    const FOOD_API_KEY = getFoodAPIKey();
    const limit = 9;

    // https://api.spoonacular.com/recipes/complexSearch?query=pancake&number=12&apiKey=&addRecipeNutrition=true&addRecipeInformation=true&fillIngredients=true
    // const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${FOOD_API_KEY}&number=${limit}${urlSearchParams}`;
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${FOOD_API_KEY}${urlSearchParams}`;

    const response = await fetch(url);
    return await response.json();

}

app.get('/meals', (req, res) => {
    const sortedMeals = sortedArray(mealTypes());
    let html =/*html*/` <option selected value="">No preference</option>`;
    sortedMeals.forEach(meal => html +=/*html*/`<option value="${meal}">${titleCase(meal)}</option>`)
    res.send(html);

});


app.get('/cuisines', (req, res) => {
    let html = '';
    const sortedCuisines = sortedArray(cuisines());

    sortedCuisines.forEach(cuisine => html +=/*html*/`
        
         <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${cuisine}" id="${cuisine}" name="cuisines">
            <label class="form-check-label" for="${cuisine}">
                ${cuisine}
            </label>
    </div>

        
        `)
    res.send(html);

});







async function getSimilarRecipes(recipeID) {
    const FOOD_API_KEY = getFoodAPIKey();
    const limit = 6;
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${FOOD_API_KEY}&number=${limit}`);
    return await response.json();
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
    const recipeID = req.body.recipeID;
    const FOOD_API_KEY = getFoodAPIKey();
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${FOOD_API_KEY}&includeNutrition=true`);
    const data = await response.json();
    res.send(data);
});



app.post('/search', (req, res) => {

    const urlSearchParams = req.body.urlSearchParams;
    searchRecipes(urlSearchParams).then(recipes => res.send(recipes))
        .catch(error => console.error(`there was an error fetching recipes ${error.message}`))
});