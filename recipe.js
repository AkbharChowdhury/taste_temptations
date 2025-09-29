import axios from 'axios';
import { getRandomItem, titleCase, sortedArray } from './public/js/helper/utils.js';
import dotenv from 'dotenv';
import { mealTypes, cuisines } from './recipe-tags.js';

dotenv.config();

const requestData = (url, contentType = 'application/json') => new Request(url, { headers: { 'x-api-key': API_KEY, 'Content-Type': contentType } });
const RECORDS_PER_PAGE = 12;
const BASE_URL = 'https://api.spoonacular.com/recipes/';
const API_KEY = process.env.API_KEY;

axios.defaults.headers['x-api-key'] = API_KEY;
axios.defaults.baseURL = BASE_URL;


export class Recipe {

    async search(urlSearchParams) {
        try {
            const params = new URLSearchParams(urlSearchParams);
            params.append('number', RECORDS_PER_PAGE);
            const response = await axios.get('complexSearch', { params });
            return response.data;
        } catch (error) {
            console.error('There was an error fetching recipes', error)
        }


    }

    async similar(id) {
        try {
            const number = 8;
            const params = new URLSearchParams({ number });
            const response = await axios.get(`${id}/similar`, { params });
            return response.data;
        } catch (error) {
            console.error('There was an error fetching similar recipes', error)
            return error;
        }
    }


    async details(id) {
        try {
            const response = await axios.get(`${id}/information`);
            return response.data;
        } catch (error) {
            console.error('There was an error fetching recipe details', error)
            return error;
        }
    }


    async random() {
        try {
            const randomCuisine = getRandomItem(cuisines);
            const randomMeal = getRandomItem(mealTypes);
            const tags = [randomMeal, randomCuisine];
            const params = new URLSearchParams({ 'number': RECORDS_PER_PAGE, 'include-tags': tags.join() });
            const response = await axios.get('random', { params });
            return response.data;

        } catch (error) {
            console.log('There was a problem fetching random recipes', error.message);
        }

    }

    async nutritionLabelWidget(id) {
        try {
            const headers = { 'Content-Type': 'text/html' };
            const response = await fetch(requestData(`https://api.spoonacular.com/recipes/${id}/nutritionLabel`, headers['Content-Type']));
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
