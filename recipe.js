import axios from 'axios';
import { getRandomItem, titleCase, sortedArray, genNextNumber } from './public/js/helper/utils.js';
import dotenv from 'dotenv';
import { mealTypes, cuisines, intolerances } from './tags.js';

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/';
const RECORDS_PER_PAGE = 12;
axios.defaults.headers['x-api-key'] = API_KEY;
axios.defaults.baseURL = BASE_URL;

const requestData = (url, contentType = 'application/json') => new Request(url, { headers: { 'x-api-key': API_KEY, 'Content-Type': contentType } });

export class Recipe {
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

    meals() {
        const html =
    /*html*/`
        <option selected value="">No preference</option>
        ${sortedArray(mealTypes).map(meal => /*html*/`
            <option value="${meal}">${titleCase(meal)}</option>
                `).join().replaceAll(',', '')}
    `;
        return html;

    }

    cuisines() {
        return sortedArray(cuisines).map(cuisine => /*html*/`
         <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${cuisine}" id="${cuisine}" name="cuisines">
            <label class="form-check-label" for="${cuisine}">
                ${cuisine}
            </label>
        </div>
        `).join().replaceAll(',', '');

    }
    intolerances() {
        return sortedArray(intolerances).map(intolerance => /*html*/`
              <span class="p-2">
                <input type="checkbox" class="btn-check" id="${intolerance}" autocomplete="off" name="intolerances" value="${intolerance}">
                <label class="btn btn-outline-danger mt-2" for="${intolerance}">${intolerance}</label> 
              </span>
        `).join().replaceAll(',', '');
    }

    number() {
        let html = /*html*/`<option value="">${RECORDS_PER_PAGE}</option>`;
        const nextNum = genNextNumber({ initalValue: RECORDS_PER_PAGE, n: 5 });
        const nums = [nextNum(), nextNum(), nextNum()]
        const others = nums.map(num => /*html*/ `
            <option value="${num}">${num}</option>
            `).join().replaceAll(',', '');
        html += others;
        return html;

    }

}