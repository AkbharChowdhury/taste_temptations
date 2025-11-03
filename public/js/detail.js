"use strict";
import { titleCase, calcDuration, isValidNumber, changeMetaData, getClone } from './helper/utils.js';
import { similarRecipeCard } from './helper/recipe-card.js';
import { fetchRequest, errorMessageTag, paymentIsRequired, fetchRecipeID } from './helper/functions.js';
import { getSteps, showExtraInfo, getIngredientsList } from './helper/detail-snippets.js';

const id = fetchRecipeID();

const showDishTypeTags = dishes => {
      const container = document.querySelector('#dish-list');
      dishes.forEach(dish =>{
        const clone = getClone('#dish-types-template');
        clone.querySelector('span').innerText = titleCase(dish);
        container.append(clone);
      });

}

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
    fetchRequest(endpoints.SIMILAR, id).then(recipes => recipes.forEach(similarRecipeCard))
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
    container.insertAdjacentHTML('afterbegin', nutritionLabel);
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

    changeMetaData({ description: summary, keywords: title });

    const cuisinesText = cuisines.length > 0 ? `| ${cuisines.join(', ')}` : '';
    document.title = `Taste Temptations: ${title}`;

    renderListItem('#ingredients', getIngredientsList(data));

    titleTag.textContent = title;
    Object.assign(imageTag, { src: image, alt: title });

    document.querySelector('#additional-details').innerText = `Serves ${servings}, ready in ${calcDuration(minutes)} ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = summary;
    showDishTypeTags(dishTypes);

    const instructions = analyzedInstructions[0];
    showInstructions(instructions);
    showExtraInfo(data);

}

function showInstructions(instructions) {
    const hasInstructions = instructions !== undefined;
    const showSteps = _ =>  renderListItem('#steps', getSteps(instructions));
    hasInstructions ? showSteps() : hideSteps();
}

function hideSteps() {
    const instructionSection = {
        'header': 'instructions-header',
        'steps': 'steps',
        'hr': 'hr'
    }
    const hideEl = el => document.querySelector(`#${el}`).style.display = 'none';
    Object.values(instructionSection).forEach(hideEl);
}

function renderListItem(selector, arr) {
    const fragment = new DocumentFragment();
    const ul = document.querySelector(selector);
    arr.forEach(li => fragment.append(li));
    ul.append(fragment);
}