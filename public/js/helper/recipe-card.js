"use strict";

import { calcDuration, DurationFormat, getClone } from './utils.js';

const recipeDetailURL = id => `detail.html?recipeID=${id}`;
const getRecipeImage = id => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;

export const recipeCard = ({ image, title, id, servings }) => {
  
  const container = document.querySelector('#recipe-list');
  const clone = getClone('template');
  const img = clone.querySelector('img');
  Object.assign(img, { src: image, alt: title });
  clone.querySelector('h5').textContent = title;
  clone.querySelector('p').innerHTML = `Serves ${servings} `;
  clone.querySelector('.card-link').setAttribute('href', recipeDetailURL(id));
  container.append(clone);
};

export const similarRecipeCard = recipe => {
  const { id, title, readyInMinutes: minutes, servings } = recipe;
  const container = document.querySelector('#similar-recipe-list');
  const clone = getClone('#similar-recipes-template');
  const img = clone.querySelector('img');
  Object.assign(img, { src: getRecipeImage(id), alt: title });
  clone.querySelector('#recipe-title-similar').textContent = title;
  clone.querySelector('a').setAttribute('href', recipeDetailURL(id));
  clone.querySelector('#duration').textContent = calcDuration(minutes, DurationFormat.SHORT);
  clone.querySelector('h3').textContent = `serves ${servings}`;
  container.append(clone);
}

