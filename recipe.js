import axios from 'axios';
import { getRandomItem } from './public/js/helper/utils.js';
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './tags.js';
import { RecipeUI } from './recipe-ui.js';

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/';
const RECORDS_PER_PAGE = 6;

axios.defaults.headers.common['x-api-key'] = API_KEY;
axios.defaults.baseURL = BASE_URL;

export class Recipe {
    #recipeUI;
    constructor() {
        if (Recipe.instance) return Recipe.instance;
        Recipe.instance = this;
        this.#recipeUI = new RecipeUI(RECORDS_PER_PAGE);
    }

    get recipeUI() {
        return this.#recipeUI;
    }

    async #request(url, { params = new URLSearchParams(), headers = {} } = {}) {
        const response = await axios.get(url, {
            params,
            headers,
        });
        return response.data;
    }

    async search(urlSearchParams) {
        const baseParams = Object.fromEntries(urlSearchParams);
        const additionalParams = {
            number: urlSearchParams.get('number') ?? RECORDS_PER_PAGE,
            addRecipeInformation: true,
            sort: 'random',
        };

        const params = new URLSearchParams({
            ...baseParams,
            ...additionalParams,
        });

        return this.#request('complexSearch', { params });
    }

    async similar(id) {
        const params = new URLSearchParams({ number: 8 });
        return this.#request(`${id}/similar`, { params });
    }

    async details(id) {
        return this.#request(`${id}/information`);
    }

    async random() {
        const randomCuisine = getRandomItem(cuisines);
        const randomMeal = getRandomItem(mealTypes);
        const tags = [randomMeal, randomCuisine];
        const params = new URLSearchParams({
            number: RECORDS_PER_PAGE,
            'include-tags': tags.join()
        });
        return this.#request('random', { params });
    }

    async nutritionLabelWidget(id) {
        const headers = { Accept: 'text/html' }
        return this.#request(`${id}/nutritionLabel`, { headers });
    }
}
