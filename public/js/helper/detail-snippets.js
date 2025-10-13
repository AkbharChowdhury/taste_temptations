
const getListItem = (items, key) => items.map(item => /*html*/`<li>${item[key]}</li>`).join().replaceAll(',', '');

export const getSteps = ({ steps }) =>
    `<ol>
        ${getListItem(steps, 'step')}
    </ol>   
    `;

export const getIngredientsList = ({ extendedIngredients }) =>
    `<ul>
        ${getListItem(extendedIngredients, 'original')}
    </ul>   
    `;
export function showExtraInfo({ vegan, vegetarian, glutenFree, diets }) {
    const showTag = (type, value) =>  value ? /*html*/`
                <span class="badge text-bg-success">${titleCase(type)}</span>
            ` : '';
    
    const tags = [
        showTag('vegan', vegan),
        showTag('vegetarian', vegetarian),
        showTag('gluten free', glutenFree)
    ];

    const container = document.querySelector('#tags-data');
    const availableTags = tags.filter(i => i).join();
    const dietText =`<p class="pt-2">Suitable for diets: <strong>${diets}</strong></p>` ;

    container.insertAdjacentHTML('beforebegin', availableTags.replaceAll(',',''));
    container.insertAdjacentHTML('beforebegin', dietText);


}
