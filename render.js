
import { SelectOptions } from './select-options.js';
import { mealTypes, cuisines, intolerances } from './recipe-filters.js';
import { titleCase, sortedArray } from './public/js/helper/utils.js';

const sortIcons = (a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase());

export const renderMeals = () =>
    SelectOptions.selectMenu({
        arr: sortedArray(mealTypes),
        defaultVal: 'No preference'
    });
    


export const renderCuisines = () => sortedArray(cuisines).map(cuisine =>/*html*/ `<div class="form-check">
            <input class="form-check-input" type="checkbox" value="${cuisine}" id="${cuisine}" name="cuisines">
            <label class="form-check-label" for="${cuisine}">
                ${cuisine}
            </label>
        </div>`).join('');

export const renderIntolerances = () =>
    intolerances.sort(sortIcons).map(({ label: intolerance, icon }) =>
               /*html*/`<span class="p-2">
                 <input type="checkbox" class="btn-check" id="${intolerance}" autocomplete="off" name="intolerances" value="${intolerance}">
                 <label class="btn btn-outline-danger mt-2" for="${intolerance}"><i class="${icon} me-1"></i> ${intolerance}</label> 
              </span>`

    ).join('');
