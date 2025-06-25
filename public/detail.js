
  // const ingredientlist = ['1 teaspoon Baking cocoa', '7 grams Baking powder', 'test apple']

function showIngredientList(ingredientlist) {
  const ingredientListDiv = document.querySelector('#IngredientsList');
  let html = /*html*/`<ul>`;
  ingredientlist.map(ingredient => html += /*html*/`<li>${ingredient}</li>`);
  html += /*html*/`</ul>`;
  ingredientListDiv.insertAdjacentHTML("afterbegin", html);

}


const recipeID = 'recipeID';
const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has(recipeID)) {
  console.log(searchParams.has(recipeID))
  getRecipeDetails(recipeID);

}
async function getRecipeDetails(recipeID) {
  const response = await fetch('/detail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'recipeID': searchParams.get(recipeID)

    }),
  });
  const data = await response.json();
  console.log({data})
  const title = document.querySelector('#item-title');
  const image = document.querySelector('#item-image');
 
  const ingredientlist = data.extendedIngredients.map(ingredient => ingredient.original)
  showIngredientList(ingredientlist)


  title.textContent = data.title;
  image.setAttribute('src', data.image)
  image.setAttribute('alt', data.title)


}