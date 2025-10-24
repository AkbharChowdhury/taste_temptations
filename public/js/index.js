import { recipeCard } from './helper/recipe-card.js';
import { fetchRandomRecipes, constructSearchURLParams, errorMessageTag, paymentIsRequired, fetchRequest } from './helper/functions.js';

const endpoints = Object.freeze({ SEARCH: 'search' });

const searchData = [
    { endpoint: 'meals', div: '#meal' },
    { endpoint: 'cuisines', div: '#cuisines-container' },
    { endpoint: 'intolerances', div: '#intolerances' },
    { endpoint: 'number', div: '#number' },

];

const searchForm = document.querySelector('#search-form');
const errorDiv = document.querySelector('#recipe-list');

const populateSearchDiv = async ({ endpoint, div }) => {
    const response = await fetch(endpoint);
    document.querySelector(div).innerHTML = await response.text();
}
searchData.forEach(populateSearchDiv);


async function renderSearch() {
    try {

        const endpoints = Object.values(searchData).map(i => i['endpoint']);
        const fetches = endpoints.map(endpoint => fetch(endpoint));
        const data = await Promise.all(fetches);
        const result = await Promise.all(data.map(r => r.text()));
        const res = result.length;
        for (let i = 0; i < res; i++) {
            const div = searchData.at(i).div;
            const html = result.at(i);
            document.querySelector(div).innerHTML = html;
        }
    } catch (err) {
        console.log('There was an error rendering search form', err)
    }

}
renderSearch()


const renderRecipeList = recipes => recipes.forEach(recipeCard);

const showSearchResults = data => {
    const { results } = data;
    if (!results) return;
    if (results.length === 0) {
        errorDiv.innerHTML = errorMessageTag("Whoops we couldn't find any recipes...  ", 'Please try again');

        return;
    }
    renderRecipeList(results)
}

// searchData.forEach(populateSearchDiv);
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

if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const urlSearchParams = constructSearchURLParams();
        console.log(urlSearchParams)
        fetchRequest(endpoints.SEARCH, urlSearchParams).then(data => {
            if (paymentIsRequired(data.code)) {
                errorDiv.innerHTML = errorMessageTag(data.message);
                return;
            }

            const prevRecipes = document.querySelectorAll('article');
            prevRecipes.forEach(recipe => recipe.parentElement.remove())
            showSearchResults(data);

        });

    });
}