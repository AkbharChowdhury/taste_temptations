import express from 'express'
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './food.js';
import { titleCase } from './utils.js';


const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const getFoodAPIKey = () => {
    dotenv.config();
    return process.env.FOOD_API_KEY;


}
app.listen(3000, () => console.log('Server listening on port 3000'));

function constructSearchURL(url, searchParams) {
    if (searchParams.query) url += `&query=${searchParams.query}`;
    if (searchParams.meal) url += `&type=${searchParams.meal}`;
    if (searchParams.cuisines.length !== 0) url += `&cuisine=${searchParams.cuisines.join()}`;
    return url;

}

async function searchRecipes(searchParams) {
    const FOOD_API_KEY = getFoodAPIKey();
    const limit = 9;
    const url = constructSearchURL(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${FOOD_API_KEY}&number=${limit}`, searchParams)
    const response = await fetch(url);
    return await response.json();
   
}



const errorMessage = (msg) => /*html */`<div class="alert alert-danger" role="alert">${msg}</div>`;
const recipeCard = (recipe) => {
    return  /*html*/`
     <div class="col-sm-6 col-md-4 mt-5">
            <div class="card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="detail.html?recipeID=${recipe.id}" class="card-link" target="_blank">View More</a>
                </div>
              </div>
        </div>
`;
};


app.get('/meals', (req, res) => {
    let html =/*html*/` <option selected value="">No preference</option>`;
    mealTypes().forEach(meal => html +=/*html*/`<option value="${meal}">${titleCase(meal)}</option>`)
    res.send(html);

});




app.get('/cuisines', (req, res) => {
    let html = '';
    cuisines().forEach(cuisine => html +=/*html*/`
        
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
        const TAGS = ['vegetarian', 'dessert'];
        const limit = 9;
        const response = await fetch(`https://api.spoonacular.com/recipes/random?number=${limit}&include-tags=${TAGS.join()}&apiKey=${FOOD_API_KEY}`);
        return await response.json();
        // res.send(data);
    } catch(error){
        res.send('there was an error fetching random recipes from server side ' + error.message)
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
    const query = req.body.query;
    const meal = req.body.meal;
    const cuisines = req.body.cuisines;
    const searchParams = Object.freeze({ query, meal, cuisines });
    searchRecipes(searchParams).then(recipes => res.send(recipes))
    .catch(err => console.error(`there was an error fetching recipes ${err.message}`))
});