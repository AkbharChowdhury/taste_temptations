"use strict";
// Utils
import {
    titleCase,
    isValidNumber,
    changeMetaData,
    getTemplateClone
} from './helper/utils.js';

import { formatDuration } from './helper/duration.js';

// API
import { fetchRequest } from './helper/api.js';

// UI
import {
    errorMessageTag,
    paymentIsRequired,
} from './helper/ui-utils.js';

import { similarRecipeCard } from './helper/recipe-card.js';

// Detail-specific logic
import {
    createListItems,
    appendNodes,
    showExtraInfo,
} from './helper/detail-snippets.js';


const id = fetchRecipeID();

const endpoints = {
    details: 'detail',
    similar: 'similar',
    nutritionLabel: 'nutrition-label',
};
const renderContext = {
    selectors: {
        container: '#similar-recipe-list',
        template: '#similar-recipes-template',
    }
};

function fetchRecipeID() {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    return id ? Number(id) : 0;
}

function showDishTypeTags(dishes = []) {
    const container = document.querySelector('#dish-list');
    const fragment = new DocumentFragment();

    for (const dish of dishes) {
        const clone = getTemplateClone('#dish-types-template');
        clone.querySelector('span').textContent = titleCase(dish);
        fragment.appendChild(clone);
    }

    container.append(fragment);
}

const renderSimilarRecipeList = recipes => {
    const container = document.querySelector(renderContext.selectors.container);
    const fragment = new DocumentFragment();

    for (const recipe of recipes) {
        fragment.append(similarRecipeCard(recipe, renderContext.selectors.template));
    }

    container.append(fragment);
};


isValidNumber(id) && fetchRequest(endpoints.details, id)
.then(handleRecipeDetails)
.catch(console.error);

const loadSimilarRecipes = (id) => fetchRequest(endpoints.similar, id)
.then(recipes => renderSimilarRecipeList(recipes));
    
function handleRecipeDetails(data) {

    const { status, message } = data
    if (paymentIsRequired(status)) {
        const errorDiv = document.querySelector('#recipe-details-container');
        errorDiv.innerHTML = errorMessageTag(message);
        return;
    }

    displayRecipeDetails(data);
    getNutritionLabel(endpoints.nutritionLabel, id)
    .then(displayNutritionLabel);
    loadSimilarRecipes(id);
}



async function getNutritionLabel(url, id) {
    try {
        const response = await axios.post(url, { id });
        return response.data;
    } catch (error) {
        console.error('There was an error fetching nutrition label', error);
    }
}

function displayNutritionLabel(nutritionHtml) {
    const nutritionLabel = nutritionHtml.split('</style>')[1];
    const container = document.querySelector('#nutrition-label-widget');
    container.insertAdjacentHTML('afterbegin', nutritionLabel);
}

function displayRecipeDetails(data) {
    const {
        title,
        image,
        cuisines,
        summary,
        servings,
        readyInMinutes: minutes,
        dishTypes,
        analyzedInstructions,
        extendedIngredients,
    } = data;

    const titleEl = document.querySelector('#title');
    const imgEl = document.querySelector('#image');
    const cuisinesLabel = cuisines.length > 0 ? `| ${cuisines.join(', ')}` : '';
    const additionalDetails = `Serves ${servings}, ready in ${formatDuration(minutes)} ${cuisinesLabel}`;
    const ingredients = createListItems(extendedIngredients, 'original');
    
    document.title = `Taste Temptations: ${title}`;

    changeMetaData({ description: summary, keywords: title });

    titleEl.textContent = title;
    document.querySelector('#additional-details').innerText = additionalDetails;

    showDishTypeTags(dishTypes);
    showExtraInfo(data);

    imgEl.src = image;
    imgEl.alt = title;

    document.querySelector('#summary').innerHTML = summary;
    appendNodes('#ingredients', ingredients);

    const instructions = analyzedInstructions[0];
    showInstructions(instructions);
}

function showInstructions(instructions) {
    const hasInstructions = instructions !== undefined;
    const { steps } = instructions;
    const showSteps = () => appendNodes('#steps', createListItems(steps, 'step'));
    hasInstructions ? showSteps() : hideSteps();
}

function hideSteps() {

    const instructionSection = {
        'header': 'instructions-header',
        'steps': 'steps',
        'hr': 'hr',
    }
    const hideElement = (el) => document.querySelector(`#${el}`).style.display = 'none';
    Object.values(instructionSection).forEach(hideElement);
}