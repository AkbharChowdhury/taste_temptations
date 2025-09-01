const recipeDetailURL = id => `detail.html?recipeID=${id}`
export const recipeCard = ({image, title, id}) => 
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


const columnClassLookup = Object.freeze({
        0: 'col-sm-6 mb-3 mb-sm-0 mt-3',
        'default': 'col-sm-6'
  });
const getRecipeImage = id => `https://img.spoonacular.com/recipes/${id}-556x370.jpg`;

export const similarRecipeCard = (recipe, index) => {
  const columnClass = columnClassLookup[index] || columnClassLookup['default'];
  const {id, title, readyInMinutes: minutes, servings} = recipe;
  return /*html*/`
      <div class="${columnClass}">
    <div class="card h-100">
      <img src="${getRecipeImage(id)}" class="card-img-top" alt="${title}">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">Ready in ${minutes} mins | servings ${servings}</p>
        <a href="${recipeDetailURL(id)}" target="_blank" class="btn btn-primary">View</a>
      </div>
    </div>
  </div>`;
}
