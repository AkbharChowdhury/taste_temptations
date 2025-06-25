const recipeID = 'recipeID';
const searchParams = new URLSearchParams(window.location.search);
if(searchParams.has(recipeID)){
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
    const data = await response.text();
    document.querySelector('#content').innerHTML = data;

}