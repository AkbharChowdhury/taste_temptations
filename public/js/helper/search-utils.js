import {  getCheckboxValues } from './utils.js';

const getSelectedCuisines = () => getCheckboxValues('cuisines');
const getSelectedIntolerances = () => getCheckboxValues('intolerances');

const getSearchParams = () => {
    const query = document.querySelector('#text').value.trim();
    const cuisines = getSelectedCuisines();
    const intolerances = getSelectedIntolerances();
    const meal = document.querySelector('#meal').value;
    const number = document.querySelector('#number').value;
    return Object.freeze({ meal, query, cuisines, intolerances, number });
};

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
