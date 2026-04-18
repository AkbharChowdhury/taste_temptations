import axios from 'axios';
import dotenv from 'dotenv';

import { getRandomItem } from './public/js/helper/utils.js';
import { mealTypes, cuisines } from './ui/recipe-tags.js';
import { RecipeUI } from './ui/recipe-ui.js';

dotenv.config();

const API_KEY = process.env.API_KEY;

const DEFAULT_RECORDS_PER_PAGE = 6;

const api = axios.create({
    baseURL: 'https://api.spoonacular.com/recipes/',
    params: {
        apiKey: API_KEY
    }

});

export class Recipe {
    #recipeUI;

    constructor() {
        if (Recipe.instance) return Recipe.instance;
        Recipe.instance = this;

        this.#recipeUI = new RecipeUI({
            defaultRecordsPerPage: DEFAULT_RECORDS_PER_PAGE,
        });
    }

    get recipeUI() {
        return this.#recipeUI;
    }

    async #request(url, options = {}) {
        const response = await api.get(url, options);
        return response.data;
    }


    async random() {
        const randomCuisine = getRandomItem(cuisines);
        const randomMeal = getRandomItem(mealTypes);
        const includedTags = [randomCuisine, randomMeal];

        const params = new URLSearchParams({
            'number': DEFAULT_RECORDS_PER_PAGE,
            'include-tags': includedTags.join(','),
        });

        return this.#request('random', { params });
    }

    async search(urlSearchParams) {

        const params = new URLSearchParams(urlSearchParams);
        params.set('number', urlSearchParams.get('number') ?? DEFAULT_RECORDS_PER_PAGE);
        params.set('addRecipeInformation', 'true');
        params.set('sort', 'random');
        return this.#request('complexSearch', { params });
    }

    async details(id) {
        return this.#request(`${id}/information`);
    }

    async similar(id) {
        const params = new URLSearchParams({ number: 8 });
        return this.#request(`${id}/similar`, { params });
    }

    async nutritionLabelWidget(id) {
        return this.#request(`${id}/nutritionLabel`, {
            headers: {
                Accept: 'text/html',
            },
        });
    }
}
