"use strict";

import { calcDuration, DurationFormat, getClone } from './utils.js';

const recipeDetailURL = id => `detail.html?recipeID=${id}`;
const getRecipeImage = id => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;

export const recipeCard = recipe => {
  const {
    image, title, id, servings,
    aggregateLikes: likes,
    healthScore, readyInMinutes: minutes,
    veryPopular,
    weightWatcherSmartPoints: healthPoints,
    glutenFree,
    cheap,
    dairyFree,
  } = recipe;

  const container = document.querySelector('#recipe-list');
  const clone = getClone('#recipe-list-template');
  clone.querySelector('circle-progress').setAttribute('value', healthScore);

  const img = clone.querySelector('img');

  Object.assign(img, { src: image, alt: title });
  clone.querySelector('.card-title').textContent = title;
  clone.querySelector('#serving').innerText = servings;
  clone.querySelector('#likes').innerText = likes.toLocaleString();
  clone.querySelector('#duration').textContent = calcDuration(minutes, DurationFormat.NARROW);

  clone.querySelector('.card-link').setAttribute('href', recipeDetailURL(id));
  clone.querySelector('#weightWatcherSmartPoints').innerText = healthPoints;
  const glutenFreeDiv = clone.querySelector('#gluten-free');
  if (glutenFree) {
    glutenFreeDiv.classList.remove('text-bg-danger');
    glutenFreeDiv.classList.add('text-bg-success');

  }

  const popularDiv = clone.querySelector('#popular-div');
  !veryPopular && popularDiv.remove();
  const cheapTag = clone.querySelector('#isCheap');
  const costIcon = cheap ? `<i class="fa-solid fa-tag"></i>` : `<i class="fa-solid fa-tags"></i>`;
  cheapTag.innerHTML = costIcon;
  clone.querySelector('#dairy-free').innerHTML = !dairyFree ? dairyIcon() : dairyIcon('success', 'dairy free');
  container.append(clone);
};
function dairyIcon(badgeCol = 'danger', text = 'Contains Dairy') {
  return `<span class="badge rounded-pill text-bg-${badgeCol} text-capitalize"><i class="fa-solid fa-cow me-1"></i>${text}</span>`
}

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

