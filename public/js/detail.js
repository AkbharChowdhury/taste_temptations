"use strict";
import { titleCase } from './utils.js';
import { similarRecipeCard } from './recipe-card.js';

const recipeID = fetchRecipeID();

function fetchRecipeID() {
    const recipeIDParam = 'recipeID';
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(recipeIDParam)) return parseInt(searchParams.get(recipeIDParam));
    return 0;
}
async function fetchRequest(recipeID, url) {
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
           recipeID
        }),
    });
    return await response.json();   

    } catch (error) {
        console.error(`There was an error with this request ${error.message}`)
        
    }

}



const showIngredientList = ingredientlist => /*html*/`
    <ul>
        ${ingredientlist.map(ingredient => `<li>${ingredient}</li>`).join().replaceAll(',', '')}
    </ul>   
    `;



const showDishTypeTags = (dishes) => dishes.map(dish => `<span class="badge bg-secondary text-decoration-none link-light m-2">${titleCase(dish)}</span>`).join().replaceAll(',', '')

const getSteps = steps => /*html*/`
    <ol>
        ${steps.map(step => `<li>${step.step}</li>`).join().replaceAll(',', '')}
    </ol>   
    `;



const nutritionDetails = (nutrients) => nutrients.map(i => `
    <tr>
      <td>${i.amount}${i.unit} ${i.name}</td>
      <td>${i.percentOfDailyNeeds}%</td>
    </tr>
    `).join().replaceAll(',', '');

fetchRequest(recipeID, '/detail').then(data => {
    const {title, image, cuisines} =  data;

    document.title = `Taste Temptations: ${title}`;

    document.querySelector('#nutrients').innerHTML = nutritionDetails(data.nutrition.nutrients);
    const ingredients = data.extendedIngredients.map(ingredient => ingredient.original);
    document.querySelector('#ingredient-list').innerHTML = /*html*/`
    <ul>
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join().replaceAll(',', '')}
    </ul>`;

    const titleTag = document.querySelector('#title');
    const imageTag = document.querySelector('#image');
    titleTag.textContent = title;
    
    Object.assign(imageTag, {
        src: image,
        alt: title
       
    });
    const cuisinesText = cuisines.length !== 0 ? `| ${cuisines.join(', ')}` : '';
    document.querySelector('#additional-details').innerText = `Serves ${data.servings}, ready in ${data.readyInMinutes} minutes ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = data.summary;
    document.querySelector('#dish-types').innerHTML = showDishTypeTags(data.dishTypes);
    const instructions = data.analyzedInstructions[0];
    if (instructions === undefined) {
        document.querySelector('#instructions-header').style.display = 'none';
        return;
    }

    document.querySelector('#steps-container').innerHTML = getSteps(instructions.steps);
});


fetchRequest(recipeID, '/similarRecipes').then(recipes => {
    console.log({recipes})
    const list = recipes.map((recipe, index) => similarRecipeCard(recipe, index)).join().replaceAll(',', '');
    document.querySelector('#similar-recipe-list').innerHTML = list;
});



