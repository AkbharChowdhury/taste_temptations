import { recipeCard } from './helper/recipe-card.js';
import { fetchRandomRecipes, constructSearchURLParams, errorMessageTag, paymentIsRequired, fetchRequest } from './helper/functions.js';

const endpoints = Object.freeze({ SEARCH: 'search' });
const searchData = [
    { endpoint: 'meals', div: '#meal' },
    { endpoint: 'cuisines', div: '#cuisines-container' },
    { endpoint: 'intolerances', div: '#intolerances' }
];

const searchForm = document.querySelector('#search-form');
const errorDiv = document.querySelector('#recipe-list');

const populateSearchDiv = async ({ url, div }) => {
    const response = await fetch(url);
    document.querySelector(div).innerHTML = await response.text();
}
const populateSearchContainer = content => document.querySelector('#result').innerHTML = content;

const renderRecipeList = recipes => recipes.map(recipeCard).join().replaceAll(',', '');

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

    errorDiv.innerHTML = errorMessageTag('There was an error retrieving random recipes', data.message);
    document.querySelector('#button-search').disabled = true;


}).catch(error => console.warn(error));

function renderPage(recipes) {
    populateSearchContainer(renderRecipeList(recipes));
    searchData.forEach(item => populateSearchDiv({ url: item.endpoint, div: item.div }))
}
if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const urlSearchParams = constructSearchURLParams();
        fetchRequest(endpoints.SEARCH, urlSearchParams).then(data => {
            if (paymentIsRequired(data.code)) {
                errorDiv.innerHTML = errorMessageTag(data.message);
                return;
            }
            showSearchResults(data);

        });

    });
}