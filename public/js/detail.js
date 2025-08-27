"use strict";
import { titleCase } from './helper/utils.js';
import { similarRecipeCard } from './helper/recipe-card.js';
import { fetchRequest } from './helper/functions.js';

const recipeID = fetchRecipeID();

function fetchRecipeID() {
    const recipeIDParam = 'recipeID';
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(recipeIDParam)) return parseInt(searchParams.get(recipeIDParam));
    return 0;
}



const showDishTypeTags = (dishes) => dishes.map(dish => `<span class="badge bg-secondary text-decoration-none link-light m-2">${titleCase(dish)}</span>`).join().replaceAll(',', '')

const getSteps = steps => /*html*/`
    <ol>
        ${steps.map(step => `<li>${step.step}</li>`).join().replaceAll(',', '')}
    </ol>   
    `;



const nutritionDetails = (nutrients) => nutrients.map(i => `
    <tr>
      <td>${i.amount}${i.unit} ${i.name}</td>
      <td>${i.percentOfDailyNeeds}%</td>
    </tr>
    `).join().replaceAll(',', '');

const errorMessageTag = (msg) =>  /*html*/`<div class="alert alert-warning" role="alert">${msg}</div>`;
fetchRequest(recipeID, '/detail').then(data => {
    console.log(data);
    if (data['status'] === 'failure') {
        document.getElementById('recipe-details-container').innerHTML = errorMessageTag('Cannot fetch recipe details!');
        return;       
    }
    // if the recipe details status is successful display recipe details and similar recipes
    displayRecipeDetails(data); 
    fetchRequest(recipeID, '/similarRecipes').then(displaySimilarRecipes);


});


function displayRecipeDetails(data) {

    const {title, image, cuisines} =  data;

    document.title = `Taste Temptations: ${title}`;

    document.querySelector('#nutrients').innerHTML = nutritionDetails(data.nutrition.nutrients);
    const ingredients = data.extendedIngredients.map(ingredient => ingredient.original);
    document.querySelector('#ingredient-list').innerHTML = /*html*/`
    <ul>
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join().replaceAll(',', '')}
    </ul>`;

    const titleTag = document.querySelector('#title');
    const imageTag = document.querySelector('#image');
    titleTag.textContent = title;
    
    Object.assign(imageTag, { src: image, alt: title });
    const cuisinesText = cuisines.length !== 0 ? `| ${cuisines.join(', ')}` : '';
    document.querySelector('#additional-details').innerText = `Serves ${data.servings}, ready in ${data.readyInMinutes} minutes ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = data.summary;
    document.querySelector('#dish-types').innerHTML = showDishTypeTags(data.dishTypes);

    const instructions = data.analyzedInstructions[0];
    showInstructions(instructions);


    
}
function showInstructions(instructions) {
    if (instructions === undefined) {
        document.querySelector('#instructions-header').style.display = 'none';
        return;
    }

    document.querySelector('#steps-container').innerHTML = getSteps(instructions.steps);

}


function displaySimilarRecipes(recipes) {
    const list = recipes.map((recipe, index) => similarRecipeCard(recipe, index)).join().replaceAll(',', '');
    document.querySelector('#similar-recipe-list').innerHTML = list;
    
}



