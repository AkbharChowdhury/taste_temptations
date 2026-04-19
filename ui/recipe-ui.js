import { createNextNumberGenerator } from  './generate-next-number.js';
import { renderMeals, renderCuisines, renderIntolerances } from './render.js';
import { SelectOptions } from './select-options.js';

export class RecipeUI {
    #DEFAULT_RECORDS_PER_PAGE;
    constructor(DEFAULT_RECORDS_PER_PAGE) {
        this.#DEFAULT_RECORDS_PER_PAGE = DEFAULT_RECORDS_PER_PAGE;
    }

    meals() {
        return renderMeals();
    }

    cuisines() {
        return renderCuisines();
    }

    intolerances() {
        return renderIntolerances();
    }

    record({ numItems, nearestNumber }) {
        const nextNum = createNextNumberGenerator({ initialValue: this.#DEFAULT_RECORDS_PER_PAGE, n: nearestNumber });
        const values = Array.from({ length: numItems }, () => nextNum());
        return SelectOptions.selectMenu({ options: values, defaultValue: this.#DEFAULT_RECORDS_PER_PAGE });
    }
}

