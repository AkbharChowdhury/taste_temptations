const hasRecipes = () => document.querySelectorAll('article');
const removeRecipes = () => {
    const prevRecipes = document.querySelectorAll('article');
    prevRecipes.forEach(recipe => recipe.parentElement.remove());
}
export const clearRecipes = _ => hasRecipes() && removeRecipes();