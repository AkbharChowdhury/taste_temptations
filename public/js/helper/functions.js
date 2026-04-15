"use strict";
import {  getCheckboxValues } from './utils.js';
const headers = Object.freeze({ 'Content-Type': 'application/json' });
const PAYMENT_REQUIRED_CODE = 402;

export const apiRequest = async (url) => {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error('There was an error with this request:', error);
    throw error;
  }
};


const getSelectedCuisines = () => getCheckboxValues('cuisines');
const getSelectedIntolerances = () => getCheckboxValues('intolerances');
const getSearchParams = () => {
    const query = document.querySelector('#text').value.trim();
    const cuisines = getSelectedCuisines();
    const intolerances = getSelectedIntolerances();
    const meal = document.querySelector('#meal').value;
    const number = document.querySelector('#number').value;
    return Object.freeze({ meal, query, cuisines, intolerances, number });
}


export const constructSearchURLParams = () => {
  const { query, meal, cuisines, intolerances, number } = getSearchParams();
  const params = new URLSearchParams();
  number && params.append('number', number);
  query && params.append('query', query);
  meal && params.append('meal', meal);
  cuisines?.length && params.append('cuisine', cuisines.join(','));
  intolerances?.length && params.append('intolerances', intolerances.join(','));
  return params;
};

export async function fetchRequest(url, values) {
    const body = JSON.stringify({ values });
    const init = {
        method: 'POST',
        headers,
        body,
    };
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


