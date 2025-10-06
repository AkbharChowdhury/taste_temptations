import axios from 'axios';
import { getRandomItem, titleCase, sortedArray } from './public/js/helper/utils.js';
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './recipe-tags.js';

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/';
const RECORDS_PER_PAGE = 12;

axios.defaults.headers['x-api-key'] = API_KEY;
axios.defaults.baseURL = BASE_URL;

const requestData = (url, contentType = 'application/json') => new Request(url, { headers: { 'x-api-key': API_KEY, 'Content-Type': contentType } });

export class Recipe {


    async #request(url, params = new URLSearchParams()) {
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            console.error('There was an error with this request', error)
        }
    }

    async search(urlSearchParams) {
        const params = new URLSearchParams(urlSearchParams);
        params.append('number', RECORDS_PER_PAGE);
        return this.#request('complexSearch', params)
    }

    async similar(id) {

        const number = 8;
        const params = new URLSearchParams({ number });
        return this.#request(`${id}/similar`, params);

    }


    async details(id) {
        return this.#request(`${id}/information`);
    }


    async random() {

        const randomCuisine = getRandomItem(cuisines);
        const randomMeal = getRandomItem(mealTypes);
        const tags = [randomMeal, randomCuisine];
        const params = new URLSearchParams({ 'number': RECORDS_PER_PAGE, 'include-tags': tags.join() });
        return this.#request('random', params);

    }

    async nutritionLabelWidget(id) {
        try {
            const headers = { 'Content-Type': 'text/html' };
            const response = await fetch(requestData(`${BASE_URL}${id}/nutritionLabel`, headers['Content-Type']));
            return await response.text();
        } catch (error) {
            console.log('There was an error fetching nutrition label', error);
            return error;

        }
    }
    
    sortedMeals() {

        const html =
    /*html*/`
        <option selected value="">No preference</option>
        ${sortedArray(mealTypes).map(meal => /*html*/`
            <option value="${meal}">${titleCase(meal)}</option>
                `).join().replaceAll(',', '')}
    `;
        return html;

    }

    sortedCuisines() {

        return sortedArray(cuisines).map(cuisine => /*html*/`
         <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${cuisine}" id="${cuisine}" name="cuisines">
            <label class="form-check-label" for="${cuisine}">
                ${cuisine}
            </label>
        </div>
        `).join().replaceAll(',', '');

    }
}
