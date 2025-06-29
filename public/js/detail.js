"use strict";
import { titleCase } from './utils.js';
import { similarRecipeCard } from './recipe-card.js';


document.title = 'Taste Temptations'
function fetchRecipeID() {
    const recipeID = 'recipeID';
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(recipeID)) return parseInt(searchParams.get(recipeID));
    return 0;
}
async function fetchRequestJSON(recipeID, url) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'recipeID': recipeID

        }),
    });
    const data = await response.json();
    return data;

}



function showIngredientList(ingredientlist) {
    let html = /*html*/`<ul>`;
    ingredientlist.map(ingredient => html += /*html*/`<li>${ingredient}</li>`);
    html += /*html*/`</ul>`;
    return html;

}



const showDishTypeTags = (dishes) => dishes.map(dish => `<span class="badge bg-secondary text-decoration-none link-light m-2">${titleCase(dish)}</span>`).join().replaceAll(',', '')


function getSteps(steps) {
    let htmlSteps = '<ol>';
    steps.forEach(step => htmlSteps += `<li>${step.step}</li>`);
    console.log({ htmlSteps })
    return htmlSteps += '</ol>';
}
const recipeID = fetchRecipeID()


const nutritionDetails = (nutrients) => nutrients.map(i => `

    <tr>
      <td>${i.amount}${i.unit} ${i.name}</td>
      <td>${i.percentOfDailyNeeds}%</td>
    </tr>
    
    
    `).join().replaceAll(',', '')




// get recipe details
fetchRequestJSON(recipeID, '/detail').then(data => {
    document.querySelector('#nutrients').innerHTML = nutritionDetails(data.nutrition.nutrients);
    const ingredients = data.extendedIngredients.map(ingredient => ingredient.original);
    document.querySelector('#ingredient-list').innerHTML = showIngredientList(ingredients);

    const title = document.querySelector('#title');
    const image = document.querySelector('#image');
    title.textContent = data.title;
    image.setAttribute('src', data.image)
    image.setAttribute('alt', data.title);
    const cuisines = data.cuisines;

    const cuisinesText = cuisines.length !== 0 ? `| ${cuisines.join(', ')}` : '';
    document.querySelector('#additional-details').textContent = `Serves ${data.servings}, ready in ${data.readyInMinutes} minutes ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = data.summary;
    document.querySelector('#dish-types').innerHTML = showDishTypeTags(data.dishTypes);

    if (data.analyzedInstructions[0] === undefined) {
        document.querySelector('#instructions-header').style.display = 'none';
        return;
    }

    const steps = data.analyzedInstructions[0]['steps'];
    document.querySelector('#steps-container').innerHTML = getSteps(steps);

});


fetchRequestJSON(recipeID, '/similarRecipes').then(recipeList => {
    const similarRecipeList = recipeList.map((recipe, index) => similarRecipeCard(recipe, index)).join().replaceAll(',', '');
    document.querySelector('#similar-recipe-list').innerHTML = similarRecipeList;
});



