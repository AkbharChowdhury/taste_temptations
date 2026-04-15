"use strict";
import { clearRecipes } from './helper/recipe-template.js';
import { recipeCard } from './helper/recipe-card.js';
import { renderSearchForm } from './helper/search-form.js';

import {
    apiRequest,
    constructSearchURLParams,
    errorMessageTag, paymentIsRequired,
} from './helper/functions.js';

const endpoints = Object.freeze({
    SEARCH: 'search',
    RANDOM: 'random',
});

const api = {
  random: () => apiRequest(endpoints.RANDOM),
  search: (params) => apiRequest(`${endpoints.SEARCH}?${params}`),
};


const renderContext = Object.freeze({
    container: document.querySelector('#recipe-list'),
    templateSelector: '#recipe-list-template',
    healthProgressSelector: 'circle-progress',
});

const renderRecipeList = recipes => recipes.forEach(recipe => recipeCard(recipe, renderContext));
const searchForm = document.querySelector('form');
const errorDiv = document.querySelector('#error-tag');

renderSearchForm();
api.random().then(handleRandomRecipes);

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const params = constructSearchURLParams();
        const data = await api.search(params.toString());
        const { results: recipes, code, message } = data;
        if (paymentIsRequired(code)) {
            errorDiv.innerHTML = errorMessageTag(message);
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
        errorDiv.innerHTML = errorMessageTag("Whoops, we couldn't find any recipes...", 'Please try again');
        clearRecipes();
        return;
    }
    showFilteredRecipes(recipes);
}

function showFilteredRecipes(recipes) {
    errorDiv.innerHTML = '';
    clearRecipes();
    renderRecipeList(recipes);
}

function handleRandomRecipes({ recipes }) {
    if (recipes) {
        renderRecipeList(recipes);
        return;
    }
    errorDiv.innerHTML = errorMessageTag('There was an error retrieving random recipes', data.message);
    document.querySelector('#button-search').disabled = true;
}



