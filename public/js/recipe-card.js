export const recipeCard = (recipe) => 
     /*html*/`
   <div class="col-sm-6 col-md-4">
            <div class="card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                  <h5 class="card-title">${recipe.title}</h5>
                   <a href="detail.html?recipeID=${recipe.id}" class="card-link" target="_blank">View More</a>
                </div>
              </div>
        </div>
`;


const columnClassLookup = Object.freeze({
        0: 'col-sm-6 mb-3 mb-sm-0',
        1: 'col-sm-6 ',
        'default': () => 'col-sm-6'
  });

export const similarRecipeCard = (recipe, index) => {
  const columnClass = columnClassLookup[index] || columnClassLookup['default']();
  const {id, title} = recipe;
  const imageUrl = `https://img.spoonacular.com/recipes/${id}-556x370.jpg`
  return /*html*/`
      <div class="${columnClass}">
    <div class="card h-100">
      <img src="${imageUrl}" class="card-img-top" alt="${title}">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">Ready in ${recipe.readyInMinutes} mins | servings ${recipe.servings}</p>
        <a href="detail.html?recipeID=${id}" target="_blank" class="btn btn-primary">View</a>
      </div>
    </div>
  </div> `;
}
