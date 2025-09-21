"use strict";
import { recipeCard } from './helper/recipe-card.js';
import { fetchRandomRecipes, searchRecipes, constructSearchURLParams, errorMessageTag, paymentIsRequired } from './helper/functions.js';

const searchForm = document.querySelector('#search-form');
const errorDiv = document.getElementById('recipe-list');

const populateSearchDiv = async (url, div) => {
    const response = await fetch(url);
    document.querySelector(div).innerHTML = await response.text();
}
const populateSearchContainer = content => document.querySelector('#result').innerHTML = content;

const renderRecipeList = recipes => recipes.map(recipe => recipeCard(recipe)).join().replaceAll(',', '');

const showSearchResults = data => {
    const { results } = data;
    const container = populateSearchContainer;
    if (!results) return;

    if (results.length === 0) {
        container(`
            <div class="alert alert-danger" role="alert">
                    Whoops we couldn't find any recipes...  
            </div>`);
        return;
    }
    container(renderRecipeList(results));
}


fetchRandomRecipes().then(data => {

    if (paymentIsRequired(data.code)) {
        errorDiv.innerHTML = errorMessageTag(data);
        document.querySelector('#button-search').disabled = true;
        return;
    }

    populateSearchContainer(renderRecipeList(data.recipes));
    populateSearchDiv('/meals', '#meal');
    populateSearchDiv('/cuisines', '#cuisines-container');
});


if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const urlSearchParams = constructSearchURLParams();
        searchRecipes(urlSearchParams).then(data =>{
            if (paymentIsRequired(data.code)) {
                errorDiv.innerHTML = errorMessageTag(data);
                return;
            }
            showSearchResults(data);

        
        });

    });
}

