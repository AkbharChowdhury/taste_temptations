"use strict";
import { titleCase } from './utils.js';

document.title = 'Taste Temptations'
function fetchRecipeID() {
    const recipeID = 'recipeID';
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(recipeID)) return parseInt(searchParams.get(recipeID));
    return 0;
}
async function fetchRequestJSON(recipeID, url) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'recipeID': recipeID

        }),
    });
    const data = await response.json();
    return data;

}





function displaySimilarRecipes(recipeList) {
    let outputHtml = '';
    // <img src="${recipe.image}" class="card-img-top" alt="${title}">
    recipeList.forEach((recipe, index) => {
        const columnClassLookup = {
            0: 'col-sm-6 mb-3 mb-sm-0',
            1: 'col-sm-6',
            'default': () => 'col-sm-6 mt-2'
        };
        let columnClass = columnClassLookup[index] || columnClassLookup['default']();

        const title = recipe.title;
        outputHtml += /*html*/`
      <div class="${columnClass}">
    <div class="card">
      
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">Ready in ${recipe.readyInMinutes} mins | servings ${recipe.servings}</p>
        <a href="detail.html?recipeID=${recipe.id}" target="_blank" class="btn btn-primary">View</a>
      </div>
    </div>
  </div>
    `;

        document.querySelector('#similar-recipe-list').innerHTML = outputHtml;

    })

}





function showIngredientList(ingredientlist) {
    let html = /*html*/`<ul>`;
    ingredientlist.map(ingredient => html += /*html*/`<li>${ingredient}</li>`);
    html += /*html*/`</ul>`;
    return html;

}



const showDishTypeTags = (dishes) => dishes.map(dish => `<span class="badge bg-secondary text-decoration-none link-light m-2">${ titleCase(dish) }</span>`).join().replaceAll(',', '')


function getSteps(steps) {
    let htmlSteps = '<ol>';
    steps.forEach(step => htmlSteps += `<li>${step.step}</li>`);
    console.log({htmlSteps})
    return htmlSteps += '</ol>';
}
const recipeID = fetchRecipeID()

// get recipe details
fetchRequestJSON(recipeID, '/detail').then(data => {
    const ingredients = data.extendedIngredients.map(ingredient => ingredient.original);
    document.querySelector('#ingredient-list').innerHTML = showIngredientList(ingredients);

    const title = document.querySelector('#title');
    const image = document.querySelector('#image');
    title.textContent = data.title;
    image.setAttribute('src', data.image)
    image.setAttribute('alt', data.title);
    const cuisines = data.cuisines;
 
    const cuisinesText = cuisines.length !== 0 ? `| ${cuisines.join(', ')}`: '';
    document.querySelector('#additional-details').textContent = `Serves ${data.servings}, ready in ${data.readyInMinutes} minutes ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = data.summary;
    document.querySelector('#dish-types').innerHTML = showDishTypeTags(data.dishTypes);
   
    if(data.analyzedInstructions[0] === undefined){
         document.querySelector('#instructions-header').style.display = 'none';
         return;
    }

    const steps = data.analyzedInstructions[0]['steps'];
    document.querySelector('#steps-container').innerHTML = getSteps(steps);

});


fetchRequestJSON(recipeID, '/similarRecipes').then(data => displaySimilarRecipes(data));


