"use strict";
import { titleCase } from './utils.js';
import { similarRecipeCard } from './recipe-card.js';


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



const showIngredientList = ingredientlist => /*html*/`
    <ul>
        ${ingredientlist.map(ingredient =>  `<li>${ingredient}</li>`).join().replaceAll(',', '')}

    </ul>   
    `;



const showDishTypeTags = (dishes) => dishes.map(dish => `<span class="badge bg-secondary text-decoration-none link-light m-2">${titleCase(dish)}</span>`).join().replaceAll(',', '')

const getSteps = steps => /*html*/`
    <ol>
        ${steps.map(step => `<li>${step.step}</li>`).join().replaceAll(',', '')}

    </ol>   
    `;

const recipeID = fetchRecipeID()


const nutritionDetails = (nutrients) => nutrients.map(i => `
    <tr>
      <td>${i.amount}${i.unit} ${i.name}</td>
      <td>${i.percentOfDailyNeeds}%</td>
    </tr>
    
    `).join().replaceAll(',', '')




fetchRequestJSON(recipeID, '/detail').then(data => {

    document.querySelector('#nutrients').innerHTML = nutritionDetails(data.nutrition.nutrients);
    const ingredients = data.extendedIngredients.map(ingredient => ingredient.original);
    document.querySelector('#ingredient-list').innerHTML = showIngredientList(ingredients);

    const titleTag = document.querySelector('#title');
    const imageTag = document.querySelector('#image');
    const {title, image} =  data;
    titleTag.textContent = title;
    // imageTag.setAttribute('src', image)
    // imageTag.setAttribute('alt', title);

    Object.assign(imageTag, {
        src: image,
        alt: title
       
    });
    console.log('image:' ,imageTag.getAttribute('src'))
    const cuisines = data.cuisines;

    const cuisinesText = cuisines.length !== 0 ? `| ${cuisines.join(', ')}` : '';
    document.querySelector('#additional-details').textContent = `Serves ${data.servings}, ready in ${data.readyInMinutes} minutes ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = data.summary;
    document.querySelector('#dish-types').innerHTML = showDishTypeTags(data.dishTypes);
    const instructions = data.analyzedInstructions[0];

    if (instructions === undefined) {
        document.querySelector('#instructions-header').style.display = 'none';
        return;
    }

    document.querySelector('#steps-container').innerHTML = getSteps(instructions.steps);

});


fetchRequestJSON(recipeID, '/similarRecipes').then(recipeList => {
    console.log('similar recipes');
    console.log({recipeList});

    const similarRecipeList = recipeList.map((recipe, index) => similarRecipeCard(recipe, index)).join().replaceAll(',', '');
    document.querySelector('#similar-recipe-list').innerHTML = similarRecipeList;
});



