"use strict";

async function populateFoodDiv(url, div) {
    const response = await fetch(url);
    const data = await response.text();
    document.querySelector(div).insertAdjacentHTML("afterbegin", data);

}

populateFoodDiv('/meals', '#meal');
populateFoodDiv('/cuisines', '#cuisines-container');

const searchForm = document.querySelector('#search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCuisines = getSelectedCuisines();
        const query = document.querySelector('#recipeSearchText').value;
        const meal = document.querySelector('#meal').value;
        console.log(selectedCuisines, query)
        console.log({ meal })


    })
}
function getSelectedCuisines() {

    const selectedCuisines = [...document.querySelectorAll('input[name="cuisines"]:checked')].map(e => e.value);
    return selectedCuisines;


}


async function fetchRandomRecipes() {
    const response = await fetch('randomrecipes');
    const data = await response.text();
    console.log({ data })
    document.getElementById('result').innerHTML = data;
}
//   fetchRandomRecipes();