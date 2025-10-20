
import { titleCase, createLi } from './utils.js';

const getListItem = (items, key) => items.map(item => createLi(item[key]));
export const getIngredientsList = ({ extendedIngredients }) => getListItem(extendedIngredients, 'original');
export const getSteps = ({ steps }) => getListItem(steps, 'step');

const getTagsHtml = tags => {
    let html = `<div class="d-flex flex-row mb-3">`;
    const tagsHtmlArr = tags.filter(i => i).map(tag => /*html*/ `<div class="p-2">${tag}</div>`);
    if (tagsHtmlArr.length === 0) {
        return '';
    }
    html += tagsHtmlArr.join().replaceAll(',', '')
    html += `</div>`;
    return html;

}
export function showExtraInfo({ vegan, vegetarian, glutenFree, diets }) {
    const showTag = (type, value) => value ? /*html*/`<span class="badge text-bg-success p-2">${titleCase(type)}</span>` : '';
    const tags = [showTag('vegan', vegan), showTag('vegetarian', vegetarian), showTag('gluten free', glutenFree)];
    const container = document.querySelector('#tags-data');
    const hasDiet = diets.length > 0;
    const availableTags = tags.filter(i => i).join();
    const dietText = `<p class="pt-2">Suitable for diets: <strong>${diets}</strong></p>`;
    const htmlTags = getTagsHtml(tags);
    if (htmlTags) container.insertAdjacentHTML('beforebegin', htmlTags);
    if (hasDiet) container.insertAdjacentHTML('beforebegin', dietText);
    const isContainerEmpty = availableTags.length === 0 && !hasDiet;
    if (isContainerEmpty) document.querySelector('#tags').remove();

}


