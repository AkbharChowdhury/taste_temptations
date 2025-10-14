
import { titleCase } from './utils.js';

const getListItem = (items, key) => items.map(item => createLi(item[key]));

const createLi = (text) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(text));
    return li;
}



export const getIngredientsList = ({ extendedIngredients }) => getListItem(extendedIngredients, 'original');
export const getSteps = ({ steps }) => getListItem(steps, 'step');
export function showExtraInfo({ vegan, vegetarian, glutenFree, diets }) {
    const showTag = (type, value) => value ? /*html*/`<span class="badge text-bg-success">${titleCase(type)}</span>` : '';
    const tags = [showTag('vegan', vegan), showTag('vegetarian', vegetarian), showTag('gluten free', glutenFree)];
    const container = document.querySelector('#tags-data');
    const hasDiet = diets.length > 0;
    const availableTags = tags.filter(i => i).join();
    const dietText = `<p class="pt-2">Suitable for diets: <strong>${diets}</strong></p>`;
    container.insertAdjacentHTML('beforebegin', availableTags.replaceAll(',', ''));
    if (hasDiet) container.insertAdjacentHTML('beforebegin', dietText);
    const isContainerEmpty = availableTags.length === 0 && !hasDiet;
    if (isContainerEmpty) document.querySelector('#tags').remove();

}


