"use strict";

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
        searchRecipes(searchData).then(data => document.querySelector('#result').innerHTML = data);
    })
}


async function searchRecipes(searchData) {
    const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
    });
    return await response.text();


}
function getSelectedCuisines() {

    const selectedCuisines = [...document.querySelectorAll('input[name="cuisines"]:checked')].map(e => e.value);
    return selectedCuisines;


}


async function fetchRandomRecipes() {
    const response = await fetch('randomrecipes');
    return await response.text();

}
fetchRandomRecipes().then(data => document.querySelector('#result').innerHTML = data);
populateFoodDiv('/meals', '#meal');
populateFoodDiv('/cuisines', '#cuisines-container');