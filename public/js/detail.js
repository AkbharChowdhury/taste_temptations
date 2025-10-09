"use strict";
import { titleCase, calcDuration, isValidNumber } from './helper/utils.js';
import { similarRecipeCard } from './helper/recipe-card.js';
import { fetchRequest, errorMessageTag, paymentIsRequired, fetchRecipeID } from './helper/functions.js';
import { getIngredientsList, getSteps } from './helper/detail-snippets.js';

const id = fetchRecipeID();

const showDishTypeTags = dishes => dishes.map(dish => `<span class="badge bg-secondary text-decoration-none link-light m-2">${titleCase(dish)}</span>`).join().replaceAll(',', '');

const endpoints = Object.freeze({
    DETAIL: 'detail',
    SIMILAR: 'similar',
    NUTRITION_LABEL: 'nutrition-label',
});

isValidNumber(id) && fetchRequest(endpoints.DETAIL, id).then(handleRecipeDetails);


function handleRecipeDetails(data) {
    const { status, message } = data
    if (paymentIsRequired(status)) {
        const errorDiv = document.querySelector('#recipe-details-container');
        errorDiv.innerHTML = errorMessageTag(message);
        return;
    }

    displayRecipeDetails(data);
    fetchRequest(endpoints.SIMILAR, id).then(displaySimilarRecipes)
    getNutritionLabel(endpoints.NUTRITION_LABEL, id).then(displayNutritionLabel)
}

async function getNutritionLabel(url, id) {

    try {
        const response = await axios.post(url, { id });
        return response.data;
    } catch (error) {
        console.error('There was an error fetching nutrition label', error)

    }
}

function displayNutritionLabel(data) {
    const nutritionLabel = data.split('</style>')[1];
    const container = document.querySelector('#nutrition-label-widget');
    container.insertAdjacentHTML('beforebegin', nutritionLabel);
    container.remove();
}


function displayRecipeDetails(data) {
    const titleTag = document.querySelector('#title');
    const imageTag = document.querySelector('#image');
    const {
        title,
        image,
        cuisines,
        summary,
        servings,
        readyInMinutes: minutes,
        dishTypes,
        analyzedInstructions
    } = data;


    const cuisinesText = cuisines ? `| ${cuisines.join(', ')}` : '';
    document.title = `Taste Temptations: ${title}`;
    document.querySelector('#ingredient-list').innerHTML = getIngredientsList(data);

    titleTag.textContent = title;
    Object.assign(imageTag, { src: image, alt: title });
    document.querySelector('#additional-details').innerText = `Serves ${servings}, ready in ${calcDuration(minutes)} ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = summary;
    document.querySelector('#dish-types').innerHTML = showDishTypeTags(dishTypes);

    const instructions = analyzedInstructions[0];
    showInstructions(instructions);

}


function showInstructions(instructions) {
    const instructionSection = { 'header': 'instructions-header', 'steps': 'steps-container' }
    if (instructions === undefined) {
        Object.values(instructionSection).forEach(el => document.querySelector(`#${el}`).style.display = 'none');
        return;
    }

    document.querySelector(`#${instructionSection.steps}`).innerHTML = getSteps(instructions.steps);
}

function displaySimilarRecipes(recipes) {
    const list = recipes.map(similarRecipeCard).join().replaceAll(',', '');
    document.querySelector('#similar-recipe-list').innerHTML = list;
}