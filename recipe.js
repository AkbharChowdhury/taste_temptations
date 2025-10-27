import axios from 'axios';
import { getRandomItem } from './public/js/helper/utils.js';
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './tags.js';

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/';
const RECORDS_PER_PAGE = 12;
axios.defaults.headers['x-api-key'] = API_KEY;
axios.defaults.baseURL = BASE_URL;
import { RecipeUI } from './recipe-ui.js';

const requestData = (url, contentType = 'application/json') => new Request(url, { headers: { 'x-api-key': API_KEY, 'Content-Type': contentType } });

export class Recipe {
    #recipeUI;
    constructor() {
        this.#recipeUI = new RecipeUI(RECORDS_PER_PAGE);
    }
    get recipeUI() {
        return this.#recipeUI;
    }

    async #request(url, params = new URLSearchParams()) {
        const response = await axios.get(url, { params });
        return response.data;
    }

    async search(urlSearchParams) {
        const params = new URLSearchParams(urlSearchParams);
        const number = params.get('number') ?? RECORDS_PER_PAGE;
        params.append('number', number);
        params.append('addRecipeInformation', true);
        params.append('sort', 'random');
        return this.#request('complexSearch', params)
    }


    async similar(id) {
        const number = 8;
        const params = new URLSearchParams({ number });
        return this.#request(`${id}/similar`, params);
    }

    details = async (id) => this.#request(`${id}/information`);

    async random() {

        const randomCuisine = getRandomItem(cuisines);
        const randomMeal = getRandomItem(mealTypes);
        const tags = [randomMeal, randomCuisine];
        const number = RECORDS_PER_PAGE;
        const params = new URLSearchParams({
            number,
            'include-tags': tags.join()
        });
        return this.#request('random', params);

    }

    async nutritionLabelWidget(id) {
        const headers = { 'Content-Type': 'text/html' };
        const response = await fetch(requestData(`${BASE_URL}${id}/nutritionLabel`, headers['Content-Type']));
        return await response.text();
    }
}