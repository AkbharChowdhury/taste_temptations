"use strict";
import { clearRecipes } from './helper/recipe-template.js';
import { recipeCard } from './helper/recipe-card.js';
import { renderSearchForm } from './helper/search-form.js';

import { apiRequest } from './helper/api.js';
import { constructSearchURLParams } from './helper/search-utils.js';
import {
    errorMessageTag,
    paymentIsRequired
} from './helper/ui-utils.js';

const endpoints = {
    search: 'search',
    random: 'random',
};

const api = {
  random: () => apiRequest(endpoints.random),
  search: (params) => apiRequest(`${endpoints.search}?${params.toString()}`),
};


const renderContext = {
    container: document.querySelector('#recipe-list'),
    templateSelector: '#recipe-list-template',
    healthProgressSelector: 'circle-progress',
};

const renderRecipeList = recipes => recipes.forEach(recipe => recipeCard(recipe, renderContext));
const searchForm = document.querySelector('form');
const errorContainer = document.querySelector('#error-tag');

renderSearchForm();
api.random().then(handleRandomRecipes);

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorContainer.innerHTML = '';

    try {
        const params = constructSearchURLParams();
        const data = await api.search(params);
        const { results: recipes, code, message } = data;
        if (paymentIsRequired(code)) {
            errorContainer.innerHTML = errorMessageTag(message);
            return;
        }

        showSearchResults(recipes);

    } catch (error) {
        console.error('There was an error fetching search results', error);
    }
});


function showSearchResults(recipes) {
    if (!recipes) return;
    const hasResults = recipes.length > 0;
    if (!hasResults) {
        errorContainer.innerHTML = errorMessageTag("Whoops, we couldn't find any recipes...");
        clearRecipes();
        return;
    }
    showFilteredRecipes(recipes);
}

function showFilteredRecipes(recipes) {
    clearRecipes();
    renderRecipeList(recipes);
}

function handleRandomRecipes({ recipes, message }) {
    if (!recipes) {
        errorContainer.innerHTML = errorMessageTag(`There was an error retrieving random recipes ${message}`);
        document.querySelector('#button-search').disabled = true;
        return;
    }
    renderRecipeList(recipes);
}



