const hasRecipes = _ => document.querySelectorAll('article');
const removeRecipes = _ => {
    const prevRecipes = document.querySelectorAll('article');
    prevRecipes.forEach(recipe => recipe.parentElement.remove());
}
export const updateRecipeUI = _ => hasRecipes() && removeRecipes();