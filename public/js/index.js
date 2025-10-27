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

const showSearchResults = data => {
    const { results } = data;
    if (!results) return;
    if (results.length === 0) {
        errorDiv.innerHTML = errorMessageTag("Whoops, we couldn't find any recipes...", 'Please try again');
        return;
    }
    renderRecipeList(results);
}

fetchRandomRecipes().then(data => handleRandomRecipes(data));

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
        fetchRequest('search', urlSearchParams).then(data => {
            console.log('search recipes');
            console.log(data)
            if (paymentIsRequired(data.code)) {
                errorDiv.innerHTML = errorMessageTag(data.message);
                return;
            }

            removeRecipes();
            showSearchResults(data);

        });

    });
}
function removeRecipes(){
    const prevRecipes = document.querySelectorAll('article');
    prevRecipes.forEach(recipe => recipe.parentElement.remove())
}