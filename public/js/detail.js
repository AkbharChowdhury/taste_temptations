"use strict";
import { titleCase, calcDuration } from './helper/utils.js';
import { similarRecipeCard } from './helper/recipe-card.js';
import { fetchRequest, errorMessageTag, paymentIsRequired, fetchRecipeID } from './helper/functions.js';

import { getSteps, nutritionDetails } from './helper/detail-snippets.js';

const id = fetchRecipeID();

const showDishTypeTags = dishes => dishes.map(dish => `<span class="badge bg-secondary text-decoration-none link-light m-2">${titleCase(dish)}</span>`).join().replaceAll(',', '');

const isValidNumber = !isNaN(id) || id !== 0;

const endpoints = Object.freeze({
    DETAIL: '/detail',
    SIMILAR: '/similar-recipes',
    NUTRITION_LABEL: '/nutrition-label',
});
if (isValidNumber) {
    fetchRequest(id, endpoints.DETAIL).then(data => {
        console.log(data)


        if (paymentIsRequired(data.status)) {
            const errorDiv = document.getElementById('recipe-details-container');
            errorDiv.innerHTML = errorMessageTag(data);
            return;
        }

        // displayRecipeDetails(data);
        getNutritionLabel1(id);
        // getNutritionLabel(id).then(displayNutritionLabel).catch(console.error);
        // fetchRequest(id, endpoints.SIMILAR).then(displaySimilarRecipes)


    });



}
function displayNutritionLabel(data) {
    const recipeLabel = data.split('</style>')[1];
    const container = document.getElementById('nutrition-label-widget');
    container.innerHTML = recipeLabel;
}




async function getNutritionLabel(id) {

    try {
        const url = endpoints.NUTRITION_LABEL;
        const headers = { 'Content-Type': 'text/html' };
        const body = JSON.stringify({id});
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
        });

        console.warn(response.status);
        return await response.text();

    } catch (error) {
        console.error(`Error fetching recipe food label ${error.message}`);
    }
}



async function getNutritionLabel1(id) {

    try {
        const url = endpoints.NUTRITION_LABEL;
        const headers = { 'Content-Type': 'text/html' };
        const body = JSON.stringify({id});
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
        });

        const data = await response.text();
        console.log(data);

    } catch (error) {
        console.error(`Error fetching recipe food label ${error.message}`);
    }
}


function displayRecipeDetails(data) {

    const { title,
        image,
        cuisines,
        summary,
        servings,
        readyInMinutes: minutes,
        dishTypes,
        analyzedInstructions } = data;

    document.title = `Taste Temptations: ${title}`;
    // document.querySelector('#nutrients').innerHTML = nutritionDetails(data.nutrition.nutrients);

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
    document.querySelector('#additional-details').innerText = `Serves ${servings}, ready in ${calcDuration(minutes)} ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = summary;
    document.querySelector('#dish-types').innerHTML = showDishTypeTags(dishTypes);

    const instructions = analyzedInstructions[0];
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