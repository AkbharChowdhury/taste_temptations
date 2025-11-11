import { titleCase, sortedArray, genNextNumber } from './public/js/helper/utils.js';
import { mealTypes, cuisines, intolerances } from './tags.js';

export class RecipeUI {
    #RECORDS_PER_PAGE;
    constructor(RECORDS_PER_PAGE) {
        this.#RECORDS_PER_PAGE = RECORDS_PER_PAGE;
    }

    intolerances = () => sortedArray(intolerances).map(intolerance =>
               /*html*/`<span class="p-2">
                 <input type="checkbox" class="btn-check" id="${intolerance}" autocomplete="off" name="intolerances" value="${intolerance}">
                 <label class="btn btn-outline-danger mt-2" for="${intolerance}">${intolerance}</label> 
              </span>`

    ).join().replaceAll(',', '');

    cuisines = () => sortedArray(cuisines).map(cuisine =>/*html*/ `<div class="form-check">
            <input class="form-check-input" type="checkbox" value="${cuisine}" id="${cuisine}" name="cuisines">
            <label class="form-check-label" for="${cuisine}">
                ${cuisine}
            </label>
        </div>`).join().replaceAll(',', '');

    meals() {
        const arr = sortedArray(mealTypes).map(meal => /*html*/`<option value="${meal}">${titleCase(meal)}</option>`);
        arr.unshift(/*html*/`<option selected value="">No preference</option>`)
        return arr.join().replaceAll(',', '');
    }

    record({ numItems, nearestNumber }) {
        const nextNum = genNextNumber(this.#RECORDS_PER_PAGE, nearestNumber);
        const nums = Array(numItems).fill(0).map(_ => nextNum());
        const selectOptions = nums.map(num => /*html*/ `<option value="${num}">${num}</option>`);
        selectOptions.unshift(/*html*/`<option selected value="">${this.#RECORDS_PER_PAGE}</option>`);
        return selectOptions.join().replaceAll(',', '');
    }
}
