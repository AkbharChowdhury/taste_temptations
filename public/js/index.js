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
    searchRecipes({ params: constructSearchURLParams() })
});

function searchRecipes({ params }) {
    fetchRequest('search', params).then(data => {
        if (paymentIsRequired(data.code)) {
            errorDiv.innerHTML = errorMessageTag(data.message);
            return;
        }
        showSearchResults(data);

    });

}
const hasRecipes = _ => document.querySelectorAll('article');

function removeRecipes() {
    const prevRecipes = document.querySelectorAll('article');
    prevRecipes.forEach(recipe => recipe.parentElement.remove());
}

function showSearchResults(data) {
    const { results } = data;
    if (!results) return;
    if (results.length === 0) {
        errorDiv.innerHTML = errorMessageTag("Whoops, we couldn't find any recipes...", 'Please try again');
        hasRecipes() && removeRecipes();
        return;
    }
    showFilteredRecipes(results);
}

function showFilteredRecipes(results){
    errorDiv.innerHTML = '';
    hasRecipes() && removeRecipes();
    renderRecipeList(results);
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