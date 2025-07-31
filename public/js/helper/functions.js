export async function fetchRandomRecipes() {
    try {
        const response = await fetch('random-recipes');
        return await response.json();
    } catch (error) {
        console.error('there was an error fetching random recipes', error.message)
    }


}

export async function searchRecipes(urlSearchParams) {
    const headers = Object.freeze({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ urlSearchParams });
    try {

        const response = await fetch('/search', {
            method: 'POST',
            headers,
            body,
        });
        return await response.json();

    } catch (error) {
        console.error(`There was an error searching for recipes ${error.message}`)

    }


}

const getSelectedCuisines = () => [...document.querySelectorAll('input[name="cuisines"]:checked')].map(e => e.value);
const getSearchParams = () => {
    const cuisines = getSelectedCuisines();
    const query = document.querySelector('#recipeSearchText').value.trim();
    const meal = document.querySelector('#meal').value;
    return Object.freeze({ meal, query, cuisines });
}


export const constructSearchURLParams = _ => {
    const params = getSearchParams();
    const url = [];
    if (params.query) url.push(`&query=${params.query}`);
    if (params.meal) url.push(`&type=${params.meal}`);
    if (params.cuisines.length !== 0) url.push(`&cuisine=${params.cuisines.join()}`);
    return url.join();

}
export async function fetchRequest(recipeID, url) {
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
           recipeID
        }),
    });
    return await response.json();   

    } catch (error) {
        console.error(`There was an error with this request ${error.message}`)
        
    }

}