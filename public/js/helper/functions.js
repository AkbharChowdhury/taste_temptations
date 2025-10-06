import { serializeURLSearchParams } from './utils.js';

const headers = Object.freeze({ 'Content-Type': 'application/json' });
const PAYMENT_REQUIRED_CODE = 402;

export const fetchRandomRecipes = async _ =>  (await fetch('random')).json();

const getSelectedCuisines = () => [...document.querySelectorAll('input[name="cuisines"]:checked')].map(e => e.value);

const getSearchParams = () => {
    const query = document.querySelector('#text').value.trim();
    const cuisines = getSelectedCuisines();
    const meal = document.querySelector('#meal').value;
    return Object.freeze({ meal, query, cuisines });
}

export const constructSearchURLParams = _ => {
    const searchParams = new URLSearchParams();
    const params = getSearchParams();
    const { query, meal, cuisines } = params;
    if (query) searchParams.append('query', query);
    if (meal) searchParams.append('meal', meal);
    if (cuisines.length !== 0) searchParams.append('cuisine', cuisines);
    const url = serializeURLSearchParams(searchParams);
    return url;

}

export async function fetchRequest(url, values) {
    const body = JSON.stringify({ values });
    const init = Object.freeze({
        method: 'POST',
        headers,
        body,
    });
    try {
        const response = await fetch(url, init);
        return await response.json();

    } catch (error) {
        console.error(`There was an error with this request for the URL ${url}`, error);

    }

}

export const paymentIsRequired = code => code === PAYMENT_REQUIRED_CODE;
export const errorMessageTag = message =>  /*html*/ `<div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Cannot fetch recipe details!</h4>
  <p>Please view message below for more details</p>
  <hr>
  <p class="mb-0">${message}</p>
</div>`;

export function fetchRecipeID() {
    const recipeIDParam = 'recipeID';
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(recipeIDParam)) return parseInt(searchParams.get(recipeIDParam));
    return 0;
}


