import { serializeURLSearchParams } from  './utils.js';

const headers = Object.freeze({ 'Content-Type': 'application/json' });

export async function fetchRandomRecipes() {
    try {
        const response = await fetch('random');
        return await response.json();
    } catch (error) {
        console.error(`There was an error fetching random recipes ${error.message}`)
    }


}

export async function searchRecipes(params) {
    const body = JSON.stringify({ params });
    try {

        const response = await fetch('/search', {
            method: 'POST',
            headers,
            body,
        });
        return await response.json();

    } catch (error) {
        console.error('There was an error searching for recipes', error);

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
    if(params.cuisines.length !== 0) searchParams.append('cuisine',  params.cuisines);
    const url = serializeURLSearchParams(searchParams);
    return url;

}
export async function fetchRequest1(id, url){
    
    try {
    const response = await axios.post(url, {id});
    const data = response.data;
    console.table(data);
    return data;
        
    } catch (error) {
        console.warn('error with fetch request', error)
        
    }
} 
export async function fetchRequest(id, url) {
    const body = JSON.stringify({ id });
    const init = Object.freeze({
        method: 'POST',
        headers,
        body,
    });
    try {
        const response = await fetch(url, init);
        return await response.json();

    } catch (error) {
        console.error('There was an error with this request', error);

    }

}
const PAYMENT_REQUIRED_CODE = 402;

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


