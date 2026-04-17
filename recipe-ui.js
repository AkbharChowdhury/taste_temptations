import { genNextNumber } from './public/js/helper/utils.js';
import { renderMeals, renderCuisines, renderIntolerances } from './ui/render.js';
import { SelectOptions } from './ui/select-options.js';

export class RecipeUI {
    #DEFAULT_RECORDS_PER_PAGE;
    constructor({ defaultRecordsPerPage }) {
        this.#DEFAULT_RECORDS_PER_PAGE = defaultRecordsPerPage;
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
        const nextNum = genNextNumber({ initialValue: this.#DEFAULT_RECORDS_PER_PAGE, n: nearestNumber });
        const values = Array.from({ length: numItems }, () => nextNum());
        return SelectOptions.selectMenu({ options: values, defaultValue: this.#DEFAULT_RECORDS_PER_PAGE });
    }
}

