import express from 'express'
import dotenv from 'dotenv';

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
async function fetchRecipes(q) {
    const FOOD_API_KEY = getFoodAPIKey();
    const limit = 9;
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${FOOD_API_KEY}&query=${q}&number=${limit}`);
    const recipes = await response.json();
    return recipes;
}


async function fetchRecipeDetails(recipeId) {
    const FOOD_API_KEY = getFoodAPIKey();
    const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${FOOD_API_KEY}`);
    const recipes = await response.json();
    return recipes;
}
const errorMessage = (msg) => /*html */`<div class="alert alert-danger" role="alert">${msg}</div>`;

const recipeCard = (recipe, index) => {
    const title = recipe.title;
    const image = recipe.image;
    const id = recipe.id;

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
            <h5 class="card-title">${title}| ${id}</h5>
            <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p> -->
        </div>
        <div class="card-body">
            <a href="#" class="card-link">View More</a>
        </div>
    </div>
</div>`;
}
app.post('/search', (req, res) => {
    const term = req.body.recipeSearchText;
    fetchRecipes(term)
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