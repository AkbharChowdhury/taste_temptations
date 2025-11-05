import { recipeCard } from './helper/recipe-card.js';
import { fetchRandomRecipes, constructSearchURLParams, errorMessageTag, paymentIsRequired, fetchRequest } from './helper/functions.js';
const searchForm = document.querySelector('form');
const errorDiv = document.querySelector('#recipe-list');

const searchData = [
    { endpoint: 'meals', div: '#meal' },
    { endpoint: 'cuisines', div: '#cuisines-container' },
    { endpoint: 'intolerances', div: '#intolerances' },
    { endpoint: 'number', div: '#number' },
];

const renderSearchForm = async _ => {
    try {
        const endpoints = Object.values(searchData).map(row => row['endpoint']);
        const fetches = endpoints.map(endpoint => fetch(endpoint));
        const response = await Promise.all(fetches);
        const htmlData = await Promise.all(response.map(r => r.text()));
        const arrLength = htmlData.length;
        for (let i = 0; i < arrLength; i++) {
            const div = searchData.at(i).div;
            const html = htmlData.at(i);
            document.querySelector(div).innerHTML = html;
        }
    } catch (err) {
        console.error('There was an error rendering search form. Review message:\n', err)
    }

}

renderSearchForm();

const renderRecipeList = recipes => recipes.forEach(recipeCard);

fetchRandomRecipes().then(handleRandomRecipes);

function handleRandomRecipes(data) {

    const { recipes } = data;
    console.log({recipes});
    if (recipes) {
        renderRecipeList(recipes);
        return;
    }

    errorDiv.innerHTML = errorMessageTag('There was an error retrieving random recipes', data.message);
    document.querySelector('#button-search').disabled = true;
}

