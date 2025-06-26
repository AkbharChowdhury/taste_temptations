"use strict";
import { recipeCard } from './recipe-card.js';

const populateFoodDiv = async (url, div) => {
    const response = await fetch(url);
    const data = await response.text();
    document.querySelector(div).insertAdjacentHTML("afterbegin", data);
}
const populateSearchContainer = content => document.querySelector('#result').innerHTML = content;

const getSelectedCuisines = () => [...document.querySelectorAll('input[name="cuisines"]:checked')].map(e => e.value);
const getSearchParams = () => {
    const cuisines = getSelectedCuisines();
    const query = document.querySelector('#recipeSearchText').value.trim();
    const meal = document.querySelector('#meal').value;
    return Object.freeze({ meal, query, cuisines });

}

const constructSearchURL = searchParams => {
    let url = '';
    if (searchParams.query) url += `&query=${searchParams.query}`;
    if (searchParams.meal) url += `&type=${searchParams.meal}`;
    if (searchParams.cuisines.length !== 0) url += `&cuisine=${searchParams.cuisines.join()}`;
    return url;

}
const searchForm = document.querySelector('#search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const urlSearchParams = constructSearchURL(getSearchParams());
        searchRecipes(urlSearchParams).then(data => {
            console.log({ data })

            let html = '';
            data['results'].forEach((recipe) => html += recipeCard(recipe));
            populateSearchContainer(html)

        });

    })
}


async function searchRecipes(urlSearchParams) {
    try {

        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                urlSearchParams
            }),
        });
        return await response.json();

    } catch (error) {
        console.error(`There was an error searching for recipes ${error.message}`)

    }


}



async function fetchRandomRecipes() {
    try {
        const response = await fetch('random-recipes');
        return await response.json();
    } catch (error) {
        console.error('there was an error fetching random recipes', error.message)
    }


}

populateFoodDiv('/meals', '#meal');
populateFoodDiv('/cuisines', '#cuisines-container');

fetchRandomRecipes().then(data => {
    let html = '';
    data['recipes'].forEach((recipe) => html += recipeCard(recipe));
    populateSearchContainer(html)
});

