import { getCheckboxValues } from './dom-utils.js';

const getSearchParams = () => {
  const query = document.querySelector('#text').value.trim();
  const meal = document.querySelector('#meal').value;
  const number = document.querySelector('#number').value;

  const cuisines = getCheckboxValues('cuisines');
  const intolerances = getCheckboxValues('intolerances');

  return { query, meal, number, cuisines, intolerances };
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
