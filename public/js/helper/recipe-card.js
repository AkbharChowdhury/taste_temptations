"use strict";

import { calcDuration, DurationFormat } from './utils.js';

const recipeDetailURL = id => `detail.html?recipeID=${id}`;
const getRecipeImage = id => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;

const columnClassLookup = Object.freeze({
  0: 'col-sm-6 mb-3 mb-sm-0 mt-3',
  'default': 'col-sm-6',
});

export const recipeCard = ({ image, title, id }) =>
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


export const similarRecipeCard = (recipe, index) => {
  const columnClass = columnClassLookup[index] || columnClassLookup['default'];
  const { id, title, readyInMinutes: minutes, servings } = recipe;

  const template = document.querySelector('template');
  const container = document.querySelector('#similar-recipe-list');
  const clone = template.content.cloneNode(true);

  clone.querySelector('#col-class').setAttribute('class', columnClass);
  const img = clone.querySelector('img');
  Object.assign(img, { src: getRecipeImage(id), alt: title });

  clone.querySelector('h5').textContent = title;
  clone.querySelector('a').setAttribute('href', recipeDetailURL(id));
  clone.querySelector('p').textContent = `${calcDuration(minutes, DurationFormat.SHORT)}  | ${servings} serving${servings === 1 ? "" : "s"}`
  container.append(clone);
}
