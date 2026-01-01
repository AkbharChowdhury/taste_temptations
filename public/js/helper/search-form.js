const searchData = [
    { endpoint: 'meals', div: '#meal' },
    { endpoint: 'cuisines', div: '#cuisines-container' },
    { endpoint: 'intolerances', div: '#intolerances' },
    { endpoint: 'record', div: '#number' },
];
export async function renderSearchForm() {
    try {
        const endpoints = Object.values(searchData).map(({endpoint}) => endpoint);
        const response = await Promise.all(endpoints.map(endpoint => fetch(endpoint)));
        const htmlData = await Promise.all(response.map(r => r.text()));
        const arrLength = htmlData.length;
        for (let i = 0; i < arrLength; i++) {
            const div = searchData.at(i).div;
            const html = htmlData.at(i);
            document.querySelector(div).innerHTML = html;
        }
    } catch (err) {
        console.error('There was an error rendering search form. Review message:\n', err)
    }

}