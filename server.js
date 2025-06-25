import express from 'express'
import dotenv from 'dotenv';
import { mealTypes } from './food.js';
import { titleCase } from './utils.js';


const app = express();
// configure statis folder
app.use(express.static('public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as send by API clients)
app.use(express.json());


const getFoodAPIKey = () => {
    dotenv.config();
    return process.env.FOOD_API_KEY;


}
app.listen(3000, () => {
    console.log('Server listening on port 3000');

});
async function fetchRecipes(q, meal = '') {
    const FOOD_API_KEY = getFoodAPIKey();
    const limit = 9;
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${FOOD_API_KEY}&query=${q}&number=${limit}&meal=${meal}`);
    const recipes = await response.json();

    return recipes;
}



const errorMessage = (msg) => /*html */`<div class="alert alert-danger" role="alert">${msg}</div>`;

const recipeCard = (recipe, index) => {
    const title = recipe.title;
    const image = recipe.image;
    const recipeID = recipe.id;

    // return `      <div class="col-sm-6 col-md-4">
    //         <div class="card border-white">
    //                 <img src="${image}" class="card-img-top" alt="${title}">
    //                 <div class="card-header">${title}</div>
    //                 <div class="card-body"><p class="card-text">view</p></div>
    //             </div>
    //         </div>`
    return /*html*/`<div class="col-sm-6 col-md-4 mt-5">
    <div class="card" style="width: 18rem;">
        <img src="${image}" class="card-img-top" alt="${title}">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p> -->
        </div>
        <div class="card-body">
            <a href="detail.html?recipeID=${recipeID}" class="card-link" target="_blank">View More</a>
        </div>
    </div>
</div>`;
}

app.get('/meals', (req, res) => {
    let html =/*html*/` <option selected>No preference</option>`;
    mealTypes().forEach(meal => html +=/*html*/`<option value="${meal}">${titleCase(meal)}</option>`)
    res.send(html);

});

async function getRandomRecipes() {
    const FOOD_API_KEY = getFoodAPIKey();
    const TAGS = ['vegetarian', 'dessert'];
    const limit = 9;
    const response = await fetch(`https://api.spoonacular.com/recipes/random?number=${limit}&include-tags=${TAGS.join()}&apiKey=${FOOD_API_KEY}`);
    const data = await response.json();
    return data;
    
}



async function getSimilarRecipes(recipeID) {
    const FOOD_API_KEY = getFoodAPIKey();
    const limit = 6;
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${FOOD_API_KEY}&number=${limit}`);
    const data = await response.json();
    return data;




    // const FOOD_API_KEY = 'a02c3b1687e9422da7f70510409c5fa9'
    // const limit = 6;
    // const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${FOOD_API_KEY}&number=${limit}`);
    // const data = await response.json();
    
}


app.post('/similarRecipes', async (req, res) => {
    const recipeID = req.body.recipeID;
    getSimilarRecipes(recipeID).then(data => res.send(data))
    // const recipeID = req.body.recipeID;
    // const FOOD_API_KEY = getFoodAPIKey()
    // const limit = 6;
    // const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${FOOD_API_KEY}&number=${limit}`);
    // const data = await response.json();
    // console.log("The similar recipes are " + data)
    // return data;


   
});
app.get('/randomrecipes', async (req, res) => {

    getRandomRecipes().then(data =>{
    let html =/*html*/`<div class="row">`;
    data['recipes'].forEach((recipe, index) => html += recipeCard(recipe, index));
    // .row
    html +=/*html*/`</div>`;
    res.send(html)

    })

   



});
// https://api.spoonacular.com/recipes/random?number=1&include-tags=vegetarian,dessert&exclude-tags=quinoa
app.post('/detail', async (req, res) => {
    const recipeID = req.body.recipeID;
    const FOOD_API_KEY = getFoodAPIKey();
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${FOOD_API_KEY}&includeNutrition=true`);
    const data = await response.json();
    res.send(data);
});


app.post('/search', (req, res) => {
    const term = req.body.recipeSearchText;
    const meal = req.body.meal ?? '';
    fetchRecipes(term, meal)
        .then(recipes => {
            if (recipes.results.length === 0) {
                res.send(errorMessage(`Whoops, we couldn't find anything for "${term}"`));
                return;
            }

            let html = '';
            html =/*html*/`<div class="row">`;
            recipes.results.forEach((recipe, index) => html += recipeCard(recipe, index));
            // .row
            html +=/*html*/`</div>`;
            res.send(html)

        })
        .catch(err => console.error(`there was an error fetching recipes ${err}`))




});