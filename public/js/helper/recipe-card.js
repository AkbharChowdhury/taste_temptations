"use strict";

import { calcDuration, DurationFormat } from './utils.js';

const recipeDetailURL = id => `detail.html?recipeID=${id}`;
const getRecipeImage = id => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;


export const recipeCard1 = ({ image, title, id }) =>
     /*html*/`
   <div class="col-sm-6 col-md-4">
            <div class="card h-100">
                <img src="${image}" class="card-img-top" alt="${title}">
                <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                   <a href="${recipeDetailURL(id)}" class="card-link" target="_blank">View More</a>
                </div>
              </div>
        </div>
`;

export const recipeCard = ({ image, title, id, servings }) => {
  
  const template = document.querySelector('template');
  const container = document.querySelector('#recipe-list');
  const clone = template.content.cloneNode(true);
  const img = clone.querySelector('img');
  Object.assign(img, { src: image, alt: title });
  clone.querySelector('h5').textContent = title;
  clone.querySelector('p').innerHTML = `Serves ${servings} `;
  clone.querySelector('.card-link').setAttribute('href', recipeDetailURL(id));
  container.append(clone);
}






export const similarRecipeCard = (recipe) => {
  const { id, title, readyInMinutes: minutes, servings } = recipe;
  const template = document.querySelector('template');
  const container = document.querySelector('#similar-recipe-list');
  const clone = template.content.cloneNode(true);
  const img = clone.querySelector('img');
  Object.assign(img, { src: getRecipeImage(id), alt: title });
  clone.querySelector('#recipe-title-similar').textContent = title;
  clone.querySelector('a').setAttribute('href', recipeDetailURL(id));
  clone.querySelector('#duration').textContent = calcDuration(minutes, DurationFormat.SHORT);
  clone.querySelector('h3').textContent = `serves ${servings}`;

  container.append(clone);
}
