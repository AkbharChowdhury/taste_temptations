"use strict";
import { recipeCard } from './helper/recipe-card.js';
import { fetchRandomRecipes, searchRecipes, constructSearchURLParams } from './helper/functions.js';


const populateSearchDiv = async (url, div) => {
    const response = await fetch(url);
    document.querySelector(div).innerHTML =  await response.text();

}
const populateSearchContainer = content => document.querySelector('#result').innerHTML = content;

const renderRecipeList = recipes => recipes.map(recipe => recipeCard(recipe)).join().replaceAll(',', '');

const noRecipesFoundMessage = `
                    <div class="alert alert-danger" role="alert">
                    Whoops we couldn't find any recipes...  
                    </div>
                    `;
const showSearchResults = data => {
    const { results } = data;
    if (results.length === 0) {
        populateSearchContainer(noRecipesFoundMessage);
        return;
    }

    populateSearchContainer(renderRecipeList(results));
}
const searchForm = document.querySelector('#search-form');
if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const urlSearchParams = constructSearchURLParams();
        searchRecipes(urlSearchParams).then(data => showSearchResults(data));
    });
}



populateSearchDiv('/meals', '#meal');
populateSearchDiv('/cuisines', '#cuisines-container');
fetchRandomRecipes().then(data => populateSearchContainer(renderRecipeList(data.recipes)));

