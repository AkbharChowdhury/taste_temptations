"use strict";
import { recipeCard } from './recipe-card.js';

async function populateFoodDiv(url, div) {
    const response = await fetch(url);
    const data = await response.text();
    document.querySelector(div).insertAdjacentHTML("afterbegin", data);

}


const searchForm = document.querySelector('#search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cuisines = getSelectedCuisines();
        const query = document.querySelector('#recipeSearchText').value.trim();
        const meal = document.querySelector('#meal').value;
        const searchData = Object.freeze({meal, query, cuisines});
        // searchRecipes(searchData).then(data => document.querySelector('#result').innerHTML = data);
         searchRecipes(searchData).then(data => {
            let html = '';
            data['results'].forEach((recipe) => html+= recipeCard(recipe));
            populateSearchContainer(html)
          
         });

    })
}


async function searchRecipes(searchData) {
    try {

        const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
    });
    return await response.json();
        
    } catch (error) {
        console.error(`There was an error searching for recipes ${error.message}`)
        
    }


}
function getSelectedCuisines() {

    const selectedCuisines = [...document.querySelectorAll('input[name="cuisines"]:checked')].map(e => e.value);
    return selectedCuisines;


}


async function fetchRandomRecipes() {
    try {
        const response = await fetch('random-recipes');
        return await response.json();
    } catch (error) {
        console.error('there was an error fetching random recipes', error.message)
    }


}
function populateSearchContainer(content){
    document.querySelector('#result').insertAdjacentHTML("afterbegin", content);

}
populateFoodDiv('/meals', '#meal');
populateFoodDiv('/cuisines', '#cuisines-container');

fetchRandomRecipes().then(data => {
    let html = '';
    data['recipes'].forEach((recipe) => html+= recipeCard(recipe));
    populateSearchContainer(html)
});

