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
      <img src="${recipe.image}" class="card-img-top" alt="${title}">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">Ready in ${recipe.readyInMinutes} mins | servings ${recipe.servings}</p>
        <a href="detail.html?recipeID=${recipe.id}" target="_blank" class="btn btn-primary">View</a>
      </div>
    </div>
  </div>
    `;

        document.getElementById('similar-recipe-list').innerHTML = outputHtml;

    })

}





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

// get recipe details
fetchRequestJSON(recipeID, '/detail').then(data => {

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

fetchRequestJSON(recipeID, '/similarRecipes').then(data => displaySimilarRecipes(data));


