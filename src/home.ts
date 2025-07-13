import { recipeCard } from '../public/js/helper/recipe-card.js';

"use strict";
type SearchParams = {
    readonly query: string,
    readonly meal:  string,
    readonly cuisines:  string[]
}

const renderRecipeList = (recipes: any) => recipes.map((recipe) => recipeCard(recipe)).join().replaceAll(',', '');


const constructSearchURLParams = (searchParams: SearchParams): string => {
    const cuisines: string[] = searchParams.cuisines;
    const query: string = searchParams.query;
    const meal: string = searchParams.meal;
    let url: string = '';
    if (query) url += `&query=${query}`;
    if (meal) url += `&type=${meal}`;
    if (cuisines.length !== 0) url += `&cuisine=${cuisines.join()}`;
    return url;

}

const getSelectedCuisines = (): string[] =>  {
    const list: string[] = [];
    const allCheckBoxes = document.querySelectorAll('input[name="cuisines"]:checked') as NodeListOf<HTMLInputElement>;
    
    allCheckBoxes.forEach(c => {
        if(c.checked){
             list.push(c.value)
        }
        
    });
    return list;

    
}
const getSearchParams = (): SearchParams => {

    const text = document.querySelector('#recipeSearchText') as HTMLInputElement;
    const selectedMeal = document.querySelector('#meal') as HTMLSelectElement;
    const params: SearchParams =  {
        query: text.value.trim(),
        meal: selectedMeal.value,
        cuisines: getSelectedCuisines()
    };
    return params;
}

const populateFoodDiv = async (url: string, div: string) => {
    const response = await fetch(url);
    const container = document.querySelector(div) as HTMLDivElement | HTMLSelectElement;
    container.insertAdjacentHTML("afterbegin", await response.text());
}
const populateSearchContainer = (content: string) => {
    const div = document.querySelector('#result') as HTMLDivElement
    div.innerHTML = content;
}

const noRecipesFoundMessage = `
                    <div class="alert alert-danger" role="alert">
                    Whoops we couldn't find any recipes...  
                    </div>
                    `;
const showSearchResults = (data: any) => {
    const { results } = data;
    if (results.length === 0) {
        populateSearchContainer(noRecipesFoundMessage);
        return;
    }

    populateSearchContainer(renderRecipeList(results));
}
const searchForm = document.querySelector('#search-form') as HTMLFormElement;
if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const params = getSearchParams();
        const urlSearchParams = constructSearchURLParams(params);
        searchRecipes(urlSearchParams).then(data => showSearchResults(data));
    });
}
async function searchRecipes(urlSearchParams: string) {
    try {

        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                urlSearchParams
            }),
        });
        return await response.json();

    } catch (error: any) {
        console.error(`There was an error searching for recipes ${error.message}`)

    }


}



async function fetchRandomRecipes() {
    try {
        const response = await fetch('random-recipes');
        return await response.json();
    } catch (error) {
        console.error('there was an error fetching random recipes')
    }


}
populateFoodDiv('/meals', '#meal');
populateFoodDiv('/cuisines', '#cuisines-container');

