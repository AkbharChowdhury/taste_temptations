export const getSteps = steps => /*html*/`
    <ol>
        ${steps.map(step => `<li>${step.step}</li>`).join().replaceAll(',', '')}
    </ol>   
    `;
export const getIngredientsList = ({ extendedIngredients }) => {
    const ingredients = extendedIngredients.map(ingredient => ingredient.original);
    const html =
       /*html*/`
    <ul>
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join().replaceAll(',', '')}
    </ul>`;
    return html;
}

