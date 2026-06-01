"use strict";

import { getTemplateClone } from './utils.js';
import { formatDuration, DurationFormatStyle } from './duration.js';
const renderIcon = name => `<i class="fa-solid fa-${name}"></i>`;
const renderCheapBadge = isCheap => `<i class="fa-solid fa-${isCheap ? 'tag' : 'tags'}"></i>`;

const recipeDetailURL = id => `detail.html?recipeID=${id}`;
const getRecipeImage = id => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;
const getDataTag = tagName => `[data-${tagName}]`;


function renderDairyIcon(badgeCol = 'danger', text = 'Contains Dairy') {
  return `<span class="badge rounded-pill text-bg-${badgeCol} text-capitalize"><i class="fa-solid fa-cow me-1"></i>${text}</span>`;
}

export const recipeCard = (recipe, renderContext) => {
  const { containerSelector, healthProgressSelector, templateSelector } = renderContext;
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
    glutenFree: clone.querySelector(getDataTag('gluten-free')), 
    dairyFree: clone.querySelector(getDataTag('dairy-free')),
    popular: clone.querySelector(getDataTag('popular')),
    cheap: clone.querySelector(getDataTag('is-cheap')),
  };

  
  const img = clone.querySelector('img');
  img.src = image;
  img.alt = title;


  clone.querySelector('.card-title').textContent = title;
  clone.querySelector(getDataTag('servings')).innerText = servings;
  clone.querySelector(getDataTag('likes')).innerText = likes.toLocaleString();
  clone.querySelector(getDataTag('duration')).textContent = formatDuration(minutes, DurationFormatStyle.NARROW);
  clone.querySelector('.card-link').setAttribute('href', recipeDetailURL(id));
  clone.querySelector(getDataTag('weightWatcherSmartPoints')).innerText = healthPoints;

  clone.querySelector(healthProgressSelector).setAttribute('value', healthScore);

  // ─── BADGES ───────────────────
  glutenFree &&  badges.glutenFree.classList.replace('text-bg-danger', 'text-bg-success');
  !veryPopular && badges.popular.remove();
  badges.cheap.innerHTML = renderCheapBadge(cheap);
  badges.dairyFree.innerHTML = !dairyFree ? renderDairyIcon() : renderDairyIcon('success', 'dairy free');

  // ─── ATTACH ───────────────────
  const container = document.querySelector(containerSelector);
  container.append(clone);
};






export const similarRecipeCard = (recipe, renderContext) => {
  const { containerSelector, templateSelector } = renderContext;
  const { id, title, readyInMinutes: minutes, servings } = recipe;
  const clone = getTemplateClone(templateSelector);

  const img = clone.querySelector('img');
  img.src = getRecipeImage(id);
  img.alt = title;
  img.title = title;

  clone.querySelector(getDataTag('title')).textContent = title;
  clone.querySelector('a').setAttribute('href', recipeDetailURL(id));
  clone.querySelector(getDataTag('duration')).textContent = formatDuration(minutes, DurationFormatStyle.SHORT);
  clone.querySelector('h3').textContent = `serves ${servings}`;
  const container = document.querySelector(containerSelector);
  container.append(clone);
}

