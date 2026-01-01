"use strict";
import { recipeCard } from './helper/recipe-card.js'
import { fetchRandomRecipes, constructSearchURLParams, errorMessageTag, paymentIsRequired, fetchRequest } from './helper/functions.js';
const searchForm = document.querySelector('form');
const errorDiv = document.querySelector('#error-tag');
const searchData = [
    { endpoint: 'meals', div: '#meal' },
    { endpoint: 'cuisines', div: '#cuisines-container' },
    { endpoint: 'intolerances', div: '#intolerances' },
    { endpoint: 'record', div: '#number' },
];

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
const hasRecipes = _ => document.querySelectorAll('article');

function removeRecipes() {
    const prevRecipes = document.querySelectorAll('article');
    prevRecipes.forEach(recipe => recipe.parentElement.remove());
}

function showSearchResults(recipes) {
    if (!recipes) return;
    if (recipes.length === 0) {
        errorDiv.innerHTML = errorMessageTag("Whoops, we couldn't find any recipes...", 'Please try again');
        hasRecipes() && removeRecipes();
        return;
    }
    showFilteredRecipes(recipes);
}

function showFilteredRecipes(recipes){
    errorDiv.innerHTML = '';
    hasRecipes() && removeRecipes();
    renderRecipeList(recipes);
}

async function renderSearchForm() {
    try {
        const endpoints = Object.values(searchData).map(({endpoint}) => endpoint);
        const response = await Promise.all(endpoints.map(endpoint => fetch(endpoint)));
        const htmlData = await Promise.all(response.map(r => r.text()));
        const arrLength = htmlData.length;
        for (let i = 0; i < arrLength; i++) {
            const div = searchData.at(i).div;
            const html = htmlData.at(i);
            document.querySelector(div).innerHTML = html;
        }
    } catch (err) {
        console.error('There was an error rendering search form. Review message:\n', err)
    }

}

renderSearchForm();
const renderRecipeList = recipes => recipes.forEach(recipeCard);
fetchRandomRecipes().then(handleRandomRecipes);

function handleRandomRecipes(data) {
    const { recipes } = data;
    if (recipes) {
        renderRecipeList(recipes);
        return;
    }
    errorDiv.innerHTML = errorMessageTag('There was an error retrieving random recipes', data.message);
    document.querySelector('#button-search').disabled = true;
}