function fetchRecipeID() {
    const recipeID = 'recipeID';
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(recipeID)) return parseInt(searchParams.get(recipeID));
    return 0;
}

async function getSelectedRecipeDetails(recipeID) {
    const response = await fetch('/detail', {
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



async function showSimilarRecipes(recipeID) {
    const response = await fetch('/similarRecipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'recipeID': recipeID

        }),
    });
    const data = await response.text();
    return data;



}
async function getSimilars(id) {


    const response = await fetch('/similarRecipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'recipeID': id

        }),
    });
    const data = await response.json();
    console.log('similar recipes')
    console.log(data)
    return data
    
}



// async function showSimilarRecipes(recipeID) {
//     const FOOD_API_KEY = 'e4676fffe7a44c199a14a757dab8b587';
//     const limit = 9;
//     const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/similar?apiKey=${FOOD_API_KEY}&number=${limit}`);
//     const data = await response.json();
//     return data;
    
// }

// similar-recipes


function showIngredientList(ingredientlist) {
    const ingredientListDiv = document.querySelector('#IngredientsList');
    let html = /*html*/`<ul>`;
    ingredientlist.map(ingredient => html += /*html*/`<li>${ingredient}</li>`);
    html += /*html*/`</ul>`;
    ingredientListDiv.innerHTML = html;

}


function showDishTypeTags(dishes) {
    let html = '';
    dishes.forEach(dish => html += `<a class="badge bg-secondary text-decoration-none link-light" href="#!">${dish}</a>`)
    return html;

}

function getSteps(steps) {
    let htmlSteps = '<ol>';
    steps.forEach(step => htmlSteps += `<li>${step.step}</li>`);
    return htmlSteps += '</ol>';
}
const recipeID = fetchRecipeID()
// showSimilarRecipes(recipeID).then(data =>{
//  document.getElementById('similar-recipes').innerHTML = data;
// })
// getSimilars(recipeID).then(data =>{
//     let html =`
//         <h1>You might also be interested in</h1>
//           <hr>
//           ${data}
//      `;

//     //  similar-recipes
//     document.getElementById('similar-recipes').innerHTML = html;
// })
getSelectedRecipeDetails(recipeID).then(data => {


    const title = document.querySelector('#item-title');
    const image = document.querySelector('#item-image');
    const ingredientlist = data.extendedIngredients.map(ingredient => ingredient.original)
    showIngredientList(ingredientlist)
    title.textContent = data.title;
    image.setAttribute('src', data.image)
    image.setAttribute('alt', data.title)
    document.getElementById('addtional-details').innerHTML = /*html*/`
        ${data.readyInMinutes} minutes, serves ${data.servings} `
    document.getElementById('recipe-summary').innerHTML = data.summary;
    document.getElementById('dishTypes').innerHTML = showDishTypeTags(data.dishTypes);

    if (data.analyzedInstructions[0] != undefined) {
        const steps = data.analyzedInstructions[0]['steps'];
        document.getElementById('stepsListContainer').innerHTML = getSteps(steps);

    } else {
        document.getElementById('instructions-header').style.display = 'none';
    }




});
