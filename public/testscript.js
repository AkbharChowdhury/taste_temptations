const recipeList = ['recipe 1', 'recipe 2', 'recipe 3', 'recipe 4'];
 function displaySimilarRecipes(recipeList) {
     let outputHtml = '';
  recipeList.forEach((recipe, index) => {
    const columnClassLookup = {
      0: 'col-sm-6 mb-3 mb-sm-0',
      1: 'col-sm-6',
    'default': () =>'col-sm-6 mt-2'
    };
    let columnClass = columnClassLookup[index] || columnClassLookup['default']();

    
    outputHtml+= /*html*/`
      <div class="${columnClass}">
    <div class="card">
      <img src="http://www.seriouseats.com/recipes/2009/06/dinner-tonight-chickpea-bruschetta-babbo-nyc-recipe.html" class="card-img-top" alt="image 1">
      <div class="card-body">
        <h5 class="card-title">${recipe}</h5>
        <p class="card-text">Ready in 45 mins | servings 2</p>
        <a href="#" class="btn btn-primary">View</a>
      </div>
    </div>
  </div>
    `;

    document.getElementById('similar-recipe-list').innerHTML = outputHtml;
  
  })
    
 }