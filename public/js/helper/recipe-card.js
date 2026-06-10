"use strict";

import { getTemplateClone } from './utils.js';
import { formatDuration, DurationFormatStyle } from './duration.js';
const renderIcon = (name) => `<i class="fa-solid fa-${name}"></i>`;
const renderCheapBadge = (isCheap) => `<i class="fa-solid fa-${isCheap ? 'tag' : 'tags'}"></i>`;

const recipeDetailURL = (id) => `detail.html?recipeID=${id}`;
const getRecipeImage = (id) => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;
const getDataSelector = (name) => `[data-${name}]`;


function renderDairyIcon(badgeCol = 'danger', text = 'Contains Dairy') {
  return `<span class="badge rounded-pill text-bg-${badgeCol} text-capitalize"><i class="fa-solid fa-cow me-1"></i>${text}</span>`;
}

export const recipeCard = (recipe, renderContext) => {
  const { healthProgressSelector, templateSelector } = renderContext;
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

  const clone = getTemplateClone(templateSelector);
  

  const badges = {
    glutenFree: clone.querySelector(getDataSelector('gluten-free')),
    dairyFree: clone.querySelector(getDataSelector('dairy-free')),
    popular: clone.querySelector(getDataSelector('popular')),
    cheap: clone.querySelector(getDataSelector('is-cheap')),
  };


  const img = clone.querySelector('img');
  img.src = image;
  img.alt = title;
  

  clone.querySelector('.card-title').textContent = title;
  clone.querySelector(getDataSelector('servings')).innerText = servings;
  clone.querySelector(getDataSelector('likes')).innerText = likes.toLocaleString();
  clone.querySelector(getDataSelector('duration')).textContent = formatDuration(minutes, DurationFormatStyle.NARROW);
  clone.querySelector('a').href = recipeDetailURL(id)
  clone.querySelector(getDataSelector('weightWatcherSmartPoints')).innerText = healthPoints;

  clone.querySelector(healthProgressSelector).value = healthScore;

  // ─── BADGES ───────────────────
  glutenFree && badges.glutenFree.classList.replace('text-bg-danger', 'text-bg-success');
  !veryPopular && badges.popular.remove();
  badges.cheap.innerHTML = renderCheapBadge(cheap);
  badges.dairyFree.innerHTML = !dairyFree ? renderDairyIcon() : renderDairyIcon('success', 'dairy free');

  return clone;

};

export const similarRecipeCard = (recipe, renderContext) => {
  const { templateSelector } = renderContext;
  const { id, title, readyInMinutes: minutes, servings } = recipe;
  const clone = getTemplateClone(templateSelector);

  const img = clone.querySelector('img');
  img.src = getRecipeImage(id);
  img.alt = title;
  img.title = title;
  
  
  clone.querySelector(getDataSelector('servings')).textContent = `serves ${servings}`;
  clone.querySelector(getDataSelector('title')).textContent = title;
  clone.querySelector(getDataSelector('duration')).textContent = formatDuration(minutes, DurationFormatStyle.SHORT);
  clone.querySelector('a').href = recipeDetailURL(id);

  return clone;

}

