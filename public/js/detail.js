"use strict";
import { titleCase, calcDuration, isValidNumber, changeMetaData, DurationFormat } from './helper/utils.js';
import { similarRecipeCard } from './helper/recipe-card.js';
import { fetchRequest, errorMessageTag, paymentIsRequired, fetchRecipeID } from './helper/functions.js';
import { getSteps, showExtraInfo, getIngredientsList } from './helper/detail-snippets.js';


// const getRecipeImage = id => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;

// const similarRecipeCard = (recipe, i) => {
//   const { id, title, readyInMinutes: minutes, servings } = recipe;

//   const template = document.querySelector('template');
//   const container = document.querySelector('#similar-recipe-list');
//   const clone = template.content.cloneNode(true);

//   const img = clone.querySelector('img');
//   const image = i === 2 ? 'https://t3.ftcdn.net/jpg/02/36/88/12/360_F_236881295_odo9H1vtTZUvewumPdeRE4tHUtVa2UJg.jpg': getRecipeImage(id) 
//   Object.assign(img, { src: image, alt: title });

//   clone.querySelector('#recipe-title-similar').textContent = title;
//   clone.querySelector('a').setAttribute('href', 'https://www.google.com');
//   clone.querySelector('p').textContent = `${calcDuration(minutes, DurationFormat.SHORT)}`;
//   clone.querySelector('h3').textContent = `serves ${servings}`;

//   container.append(clone);
// }
// const displaySimilarRecipes = recipes => recipes.forEach(similarRecipeCard);

// const recipes = [
//     {
//     "id": 645707,
//     "image": "Grilled-Figs-With-Blue-Cheese-and-Citrus-Honey-645707.jpgs",
//     "imageType": "jpg",
//     "title": "Grilled Figs With Blue Cheese and Citrus Honey",
//     "readyInMinutes": 45,
//     "servings": 12,
//     "sourceUrl": "https://www.foodista.com/recipe/PQMPGWMG/grilled-figs-with-blue-cheese-and-citrus-honey"
// },
// {
//     "id": 647310,
//     "image": "Honey-Glazed-Citrus-Roasted-Carrots-647310.jpg",
//     "imageType": "jpg",
//     "title": "Honey-Glazed Citrus-Roasted Carrots",
//     "readyInMinutes": 45,
//     "servings": 4,
//     "sourceUrl": "https://www.foodista.com/recipe/VWMS5RF5/honey-glazed-citrus-roasted-carrots"
// },
// {
//     "id": 639520,
//     "image": "Citrus-Chicken-With-Apricot--Peanuts---Mint-639520.jpg",
//     "imageType": "jpg",
//     "title": "Citrus Chicken With Apricot, Peanuts & Mint",
//     "readyInMinutes": 45,
//     "servings": 6,
//     "sourceUrl": "https://www.foodista.com/recipe/ZZX2G5Z6/citrus-chicken-with-apricot-peanuts-mint"
// },
// {
//     "id": 634767,
//     "image": "Beet-and-Blue-Cheese-Salad-with-Citrus-Vinaigrette-Dressing-634767.jpg",
//     "imageType": "jpg",
//     "title": "Beet and Blue Cheese Salad with Citrus Vinaigrette Dressing",
//     "readyInMinutes": 45,
//     "servings": 8,
//     "sourceUrl": "https://www.foodista.com/recipe/RLCW4BRL/beet-and-blue-cheese-salad-with-citrus-vinaigrette-dressing"
// }
// ];
// recipes.at(-1).title+=' and Citrus Chicken With Apricot, Peanuts & Mint'
// recipes.at(2).image = 'https://t3.ftcdn.net/jpg/02/36/88/12/360_F_236881295_odo9H1vtTZUvewumPdeRE4tHUtVa2UJg.jpg'
// displaySimilarRecipes(recipes);




const id = fetchRecipeID();

const showDishTypeTags = dishes => dishes.map(dish => `<span class="badge bg-secondary text-decoration-none link-light m-2">${titleCase(dish)}</span>`).join().replaceAll(',', '');

const displaySimilarRecipes = recipes => recipes.forEach(similarRecipeCard);

const endpoints = Object.freeze({
    DETAIL: 'detail',
    SIMILAR: 'similar',
    NUTRITION_LABEL: 'nutrition-label',
});

isValidNumber(id) && fetchRequest(endpoints.DETAIL, id).then(handleRecipeDetails);

function handleRecipeDetails(data) {
    const { status, message } = data
    if (paymentIsRequired(status)) {
        const errorDiv = document.querySelector('#recipe-details-container');
        errorDiv.innerHTML = errorMessageTag(message);
        return;
    }

    displayRecipeDetails(data);
    // fetchRequest(endpoints.SIMILAR, id).then(displaySimilarRecipes)
    fetchRequest(endpoints.SIMILAR, id).then(data => {
        console.log(data);
        displaySimilarRecipes(data)
    })

    getNutritionLabel(endpoints.NUTRITION_LABEL, id).then(displayNutritionLabel)
}

async function getNutritionLabel(url, id) {

    try {
        const response = await axios.post(url, { id });
        return response.data;
    } catch (error) {
        console.error('There was an error fetching nutrition label', error)

    }
}

function displayNutritionLabel(data) {
    const nutritionLabel = data.split('</style>')[1];
    const container = document.querySelector('#nutrition-label-widget');
    container.insertAdjacentHTML('beforebegin', nutritionLabel);
    container.remove();
}




function displayRecipeDetails(data) {
    const titleTag = document.querySelector('#title');
    const imageTag = document.querySelector('#image');
    const {
        title,
        image,
        cuisines,
        summary,
        servings,
        readyInMinutes: minutes,
        dishTypes,
        analyzedInstructions
    } = data;

    changeMetaData({ description: summary, keywords: title });

    const cuisinesText = cuisines.length > 0 ? `| ${cuisines.join(', ')}` : '';
    document.title = `Taste Temptations: ${title}`;

    renderListItem('#ingredients', getIngredientsList(data));

    titleTag.textContent = title;
    Object.assign(imageTag, { src: image, alt: title });

    document.querySelector('#additional-details').innerText = `Serves ${servings}, ready in ${calcDuration(minutes)} ${cuisinesText}`;
    document.querySelector('#summary').innerHTML = summary;
    document.querySelector('#dish-types').innerHTML = showDishTypeTags(dishTypes);

    const instructions = analyzedInstructions[0];
    showInstructions(instructions);
    showExtraInfo(data);

}

function showInstructions(instructions) {
    const hasInstructions = instructions !== undefined;
    const showSteps = _ =>  renderListItem('#steps', getSteps(instructions));
    hasInstructions ? showSteps() : hideSteps();
}

function hideSteps() {
    const instructionSection = {
        'header': 'instructions-header',
        'steps': 'steps-container'
    }
    const hideEl = el => document.querySelector(`#${el}`).style.display = 'none';
    Object.values(instructionSection).forEach(hideEl);
}

function renderListItem(selector, arr) {
    const fragment = new DocumentFragment();
    const ul = document.querySelector(selector);
    arr.forEach(li => fragment.append(li));
    ul.append(fragment);
}