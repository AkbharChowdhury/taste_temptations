import { serializeURLSearchParams } from  './utils.js';
const headers = Object.freeze({ 'Content-Type': 'application/json' });
export async function fetchRandomRecipes() {
    try {
        const response = await fetch('random-recipes');
        return await response.json();
    } catch (error) {
        console.error(`There was an error fetching random recipes ${error}`)
    }


}

export async function searchRecipes(urlSearchParams) {
    const body = JSON.stringify({ urlSearchParams });
    try {

        const response = await fetch('/search', {
            method: 'POST',
            headers,
            body,
        });
        return await response.json();

    } catch (error) {
        console.error(`There was an error searching for recipes ${error}`)

    }


}
const getSelectedCuisines = () => [...document.querySelectorAll('input[name="cuisines"]:checked')].map(e => e.value);
const getSearchParams = () => {
    const cuisines = getSelectedCuisines();
    const query = document.querySelector('#recipeSearchText').value.trim();
    const meal = document.querySelector('#meal').value;
    return Object.freeze({ meal, query, cuisines });
}

export const constructSearchURLParams = _ => {
    const searchParams = new URLSearchParams();
    const params = getSearchParams();
    if(params.query) searchParams.append('query', params.query);
    if(params.meal) searchParams.append('meal', params.meal);
    console.log('c',params.cuisines)
    if(params.cuisines.length !== 0) searchParams.append('cuisine',  params.cuisines);
    const url = serializeURLSearchParams(searchParams);
    return `&${url}`;

}
export async function fetchRequest(recipeID, url) {
    const body = JSON.stringify({ recipeID });
    const init = Object.freeze({
        method: 'POST',
        headers,
        body,
    });
    try {
        const response = await fetch(url, init);
        return await response.json();

    } catch (error) {
        console.error(`There was an error with this request ${error}`)

    }

}

export const errorMessageTag = data =>  /*html*/ `<div class="alert alert-danger" role="alert">
  <h4 class="alert-heading">Cannot fetch recipe details!</h4>
  <p>Please view message below for more details</p>
  <hr>
  <p class="mb-0">${data.message}</p>
</div>`;

