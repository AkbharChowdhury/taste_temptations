export const recipeCard = (recipe) => {
    return /*html*/`
   <div class="col-sm-6 col-md-4 mt-5">
            <div class="card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                  <h5 class="card-title">${recipe.title}</h5>
                  <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
                   <a href="detail.html?recipeID=${recipe.id}" class="card-link" target="_blank">View More</a>
                </div>
              </div>
        </div>
`;
}

     

