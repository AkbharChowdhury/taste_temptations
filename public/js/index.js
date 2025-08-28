"use strict";
import { recipeCard } from './helper/recipe-card.js';
import { fetchRandomRecipes, searchRecipes, constructSearchURLParams, errorMessageTag } from './helper/functions.js';


const populateSearchDiv = async (url, div) => {
    const response = await fetch(url);
    document.querySelector(div).innerHTML = await response.text();

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




populateSearchDiv('/meals', '#meal');
populateSearchDiv('/cuisines', '#cuisines-container');
fetchRandomRecipes().then(data => {
    console.log("random recipes:", data);
    if (data.status === 'failure') {
        const errorDiv = document.getElementById('recipe-list');
        errorDiv.innerHTML = errorMessageTag(data);
        searchForm.addEventListener('submit', e=> {
            console.log('form submission prevented')
            return false;
           
        })
        return;
    }
    populateSearchContainer(renderRecipeList(data.recipes))
});



if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        console.log('form submitted')
        const urlSearchParams = constructSearchURLParams();
        console.log(urlSearchParams)
        searchRecipes(urlSearchParams).then(data => showSearchResults(data));
    });
}

