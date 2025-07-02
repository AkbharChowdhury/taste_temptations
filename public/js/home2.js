"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recipe_card_js_1 = require("../public/js/recipe-card.js");
"use strict";
const renderRecipeList = (recipes) => recipes.map((recipe) => (0, recipe_card_js_1.recipeCard)(recipe)).join().replaceAll(',', '');
const constructSearchURLParams = (searchParams) => {
    const cuisines = searchParams.cuisines;
    const query = searchParams.query;
    const meal = searchParams.meal;
    let url = '';
    if (query)
        url += `&query=${query}`;
    if (meal)
        url += `&type=${meal}`;
    if (cuisines.length !== 0)
        url += `&cuisine=${cuisines.join()}`;
    return url;
};
const getSelectedCuisines = () => {
    const list = [];
    const allCheckBoxes = document.querySelectorAll('input[name="cuisines"]:checked');
    allCheckBoxes.forEach(c => {
        if (c.checked) {
            list.push(c.value);
        }
    });
    return list;
};
const getSearchParams = () => {
    const text = document.querySelector('#recipeSearchText');
    const selectedMeal = document.querySelector('#meal');
    const params = {
        query: text.value.trim(),
        meal: selectedMeal.value,
        cuisines: getSelectedCuisines()
    };
    return params;
};
const populateFoodDiv = async (url, div) => {
    const response = await fetch(url);
    const container = document.querySelector(div);
    container.insertAdjacentHTML("afterbegin", await response.text());
};
const populateSearchContainer = (content) => {
    const div = document.querySelector('#result');
    div.innerHTML = content;
};
const noRecipesFoundMessage = `
                    <div class="alert alert-danger" role="alert">
                    Whoops we couldn't find any recipes...  
                    </div>
                    `;
const showSearchResults = (data) => {
    const { results } = data;
    if (results.length === 0) {
        populateSearchContainer(noRecipesFoundMessage);
        return;
    }
    populateSearchContainer(renderRecipeList(results));
};
const searchForm = document.querySelector('#search-form');
if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const params = getSearchParams();
        const urlSearchParams = constructSearchURLParams(params);
        searchRecipes(urlSearchParams).then(data => showSearchResults(data));
    });
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
    }
    catch (error) {
        console.error(`There was an error searching for recipes ${error.message}`);
    }
}
async function fetchRandomRecipes() {
    try {
        const response = await fetch('random-recipes');
        return await response.json();
    }
    catch (error) {
        console.error('there was an error fetching random recipes');
    }
}
populateFoodDiv('/meals', '#meal');
populateFoodDiv('/cuisines', '#cuisines-container');
