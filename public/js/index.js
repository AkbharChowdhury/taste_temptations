"use strict";
import { recipeCard } from './helper/recipe-card.js';
import { fetchRandomRecipes, searchRecipes, constructSearchURLParams, errorMessageTag, paymentIsRequired } from './helper/functions.js';
const searchForm = document.querySelector('#search-form');
const errorDiv = document.getElementById('recipe-list');





const populateSearchDiv = async (url, div) => {
    const response = await fetch(url);
    const data = await response.text();
    document.querySelector(div).innerHTML = data;
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
    const { recipes } = data;
    if (recipes) {
        renderPage(recipes);
        return;
    }

    errorDiv.innerHTML = errorMessageTag('There was an error retreving  randome recipes', data.message);
    document.querySelector('#button-search').disabled = true;


}).catch(error => console.warn(error));

function renderPage(recipes) {
    populateSearchContainer(renderRecipeList(recipes));
    populateSearchDiv('/meals', '#meal');
    populateSearchDiv('/cuisines', '#cuisines-container');

}
if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const urlSearchParams = constructSearchURLParams();
        searchRecipes(urlSearchParams).then(data => {
            console.log({data})
            // if (paymentIsRequired(data.code)) {
            //     errorDiv.innerHTML = errorMessageTag(data);
            //     return;
            // }
            showSearchResults(data);

        });

    });
}

