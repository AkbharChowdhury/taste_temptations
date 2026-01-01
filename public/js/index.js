"use strict";
import { updateRecipeUI } from './helper/recipe-template.js';
import { recipeCard } from './helper/recipe-card.js';
import { renderSearchForm } from './helper/search-form.js';
import { fetchRandomRecipes, constructSearchURLParams, errorMessageTag, paymentIsRequired, fetchRequest } from './helper/functions.js';
const renderRecipeList = recipes => recipes.forEach(recipeCard);

const searchForm = document.querySelector('form');
const errorDiv = document.querySelector('#error-tag');


searchForm.addEventListener('submit', e => {
    e.preventDefault();
    searchRecipes({ urlSearchParams: constructSearchURLParams() })
});

function searchRecipes({ urlSearchParams }) {
    fetchRequest('search', urlSearchParams).then(({results: recipes, code, message}) => {
        if(!paymentIsRequired(code)){
             showSearchResults(recipes);
             return;
        }
        errorDiv.innerHTML = errorMessageTag(message);


    });

}

function showSearchResults(recipes) {
    if (!recipes) return;
    if (recipes.length === 0) {
        errorDiv.innerHTML = errorMessageTag("Whoops, we couldn't find any recipes...", 'Please try again');
        updateRecipeUI();
        return;
    }
    showFilteredRecipes(recipes);
}

function showFilteredRecipes(recipes){
    errorDiv.innerHTML = '';
    updateRecipeUI();
    renderRecipeList(recipes);
}

renderSearchForm();
fetchRandomRecipes().then(handleRandomRecipes);

function handleRandomRecipes({recipes}) {
    if (recipes) {
        renderRecipeList(recipes);
        return;
    }
    errorDiv.innerHTML = errorMessageTag('There was an error retrieving random recipes', data.message);
    document.querySelector('#button-search').disabled = true;
}