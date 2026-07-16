
import { titleCase, createLi } from './utils.js';

const getListItem = (items, key) => items.map(item => createLi(item[key]));

export const getIngredientsList = ({ extendedIngredients }) => getListItem(extendedIngredients, 'original');

export const getSteps = ({ steps }) => getListItem(steps, 'step');

const createTagElement = (tag) => {
        const div = document.createElement('div');
        div.classList.add('p-2');
        div.innerHTML = tag;
        return div;
}

const getTags = (tags) => {

    const div = document.createElement('div');
    div.className = 'd-flex flex-row mb-3';
    const tagElements = tags.map(createTagElement);
    const fragment = getDocumentFragment(tagElements)
    div.appendChild(fragment)
    return div;
}

export function showExtraInfo({ vegan, vegetarian, glutenFree, diets }) {
    const showTag = (type, value) => value ? `<span class="badge text-bg-success p-2">${titleCase(type)}</span>` : '';
    const tags = [
        showTag('vegan', vegan),
        showTag('vegetarian', vegetarian),
        showTag('gluten free', glutenFree)
    ].filter(tag => tag);

    const container = document.querySelector('#tags-data');
    const hasDiet = diets.length > 0;
    const dietText = `<p class="pt-2">Suitable for diets: <strong>${diets}</strong></p>`;
    
    if (tags.length > 0) container.insertAdjacentElement('beforebegin', getTags(tags));
    if (hasDiet) container.insertAdjacentHTML('beforebegin', dietText);
    
    const isContainerEmpty = tags.length === 0 && !hasDiet;
    if (isContainerEmpty) document.querySelector('#tags').remove();
    container.remove()

}
export function renderListItem(selector, arr=[]) {
    const ul = document.querySelector(selector);
    const fragment = getDocumentFragment(arr);
    ul.appendChild(fragment);
}

function getDocumentFragment(arr=[]){
    const fragment = new DocumentFragment();
    arr.forEach(item => fragment.append(item));
    return fragment;
}


