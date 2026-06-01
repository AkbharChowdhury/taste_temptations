"use strict";
// UI
import { clearRecipes } from './helper/recipe-template.js';
import { recipeCard } from './helper/recipe-card.js';
import { renderSearchForm } from './helper/search-form.js';

// API
import { apiRequest } from './helper/api.js';

// Utils
import { constructSearchURLParams } from './helper/search-utils.js';
import { errorMessageTag, paymentIsRequired } from './helper/ui-utils.js';
import { getTemplateClone } from './helper/utils.js';

const endpoints = {
    search: 'search',
    random: 'random',
};
const NO_RECIPES_FOUND_MESSAGE = "Whoops, we couldn't find any recipes...";
const api = {
    random: () => apiRequest(endpoints.random),
    search: (params) => apiRequest(`${endpoints.search}?${params.toString()}`),
};

const renderContext = {
    containerSelector: '#recipe-list',
    templateSelector: '#recipe-list-template',
    healthProgressSelector: 'circle-progress',
};

const searchForm = document.querySelector('form');
const errorContainer = document.querySelector('#error-tag');

const renderRecipeList = recipes => {
    const container = document.querySelector(renderContext.containerSelector);
    const fragment = document.createDocumentFragment();
    for (const recipe of recipes) {
        fragment.append(recipeCard(recipe, renderContext));
    }
    container.append(fragment);
};

function handleRandomRecipesError(err) {
    document.querySelector('#button-search').disabled = true;
    showError(err.message || 'Failed to fetch random recipes');
    throw err;
}

api.random()
  .then(({recipes}) => renderRecipeList(recipes))
  .catch(handleRandomRecipesError);

renderSearchForm();

function showError(message) {
    clearRecipes();
    errorContainer.innerHTML = errorMessageTag(message);
}
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorContainer.innerHTML = '';

    try {
        const params = constructSearchURLParams();
        const { results: recipes, code, message } = await api.search(params);
        if (paymentIsRequired(code)) {
            showError(message);
            return;
        }
        const hasRecipes = Array.isArray(recipes) && recipes.length > 0;
        if (!hasRecipes) {
            showError(NO_RECIPES_FOUND_MESSAGE);
            return;
        }
        showFilteredRecipes(recipes);

    } catch (error) {
        errorContainer.innerHTML = errorMessageTag(error.message);
    }
});

function showFilteredRecipes(recipes) {
    clearRecipes();
    renderRecipeList(recipes);
}



