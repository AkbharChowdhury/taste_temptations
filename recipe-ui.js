import { titleCase, sortedArray, genNextNumber } from './public/js/helper/utils.js';
import { mealTypes, cuisines, intolerances } from './tags.js';

class SelectOptions {
    static selectMenu({arr=[], defaultVal}){
        const displayItem = item => typeof item === 'string' ? titleCase(item) : item;
        const select = arr.map(item => /*html*/ `<option value="${item}">${displayItem(item)}</option>`);
        select.unshift(/*html*/`<option selected value="">${defaultVal}</option>`);
        return select;
    }
}
export class RecipeUI {
    #RECORDS_PER_PAGE;
    constructor(RECORDS_PER_PAGE) {
        this.#RECORDS_PER_PAGE = RECORDS_PER_PAGE;
    }

    intolerances = _ => sortedArray(intolerances).map(intolerance =>
               /*html*/`<span class="p-2">
                 <input type="checkbox" class="btn-check" id="${intolerance}" autocomplete="off" name="intolerances" value="${intolerance}">
                 <label class="btn btn-outline-danger mt-2" for="${intolerance}">${intolerance}</label> 
              </span>`

    ).join().replaceAll(',', '');

    cuisines = _ => sortedArray(cuisines).map(cuisine =>/*html*/ `<div class="form-check">
            <input class="form-check-input" type="checkbox" value="${cuisine}" id="${cuisine}" name="cuisines">
            <label class="form-check-label" for="${cuisine}">
                ${cuisine}
            </label>
        </div>`).join().replaceAll(',', '');

    meals = _ => SelectOptions.selectMenu({arr: sortedArray(mealTypes),  defaultVal:'No preference'}).join().replaceAll(',', '');

    record({ numItems, nearestNumber }) {
        const records = this.#RECORDS_PER_PAGE;
        const nextNum = genNextNumber({initialValue: records, n: nearestNumber});
        const nums = Array(numItems).fill(0).map(_ => nextNum());
        return SelectOptions.selectMenu({arr:nums, defaultVal: records }).join().replaceAll(',', '');
    }
}
