export function showIngredientList(ingredientlist) {
    const ingredientListDiv = document.querySelector('#IngredientsList');
    let html = /*html*/`<ul>`;
    ingredientlist.map(ingredient => html += /*html*/`<li>${ingredient}</li>`);
    html += /*html*/`</ul>`;
    ingredientListDiv.innerHTML = html;

}
export function showDishTypeTags(dishes) {
    let html = '';
    dishes.forEach(dish => html += `<a class="badge bg-secondary text-decoration-none link-light" href="#!">${dish}</a>`)
    return html;

}
export function showSteps(steps){
    // data.analyzedInstructions[0]['steps']
    let htmlSteps = '<ol>';
    steps.forEach(step => htmlSteps+= `<li>${step.step}</li>`);
    htmlSteps+= '</ol>';
    return htmlSteps;
}
