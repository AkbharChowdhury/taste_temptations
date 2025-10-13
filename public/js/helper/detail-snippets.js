
const getListItem = (items, key) => items.map(item => `<li>${item[key]}</li>`).join().replaceAll(',', '');

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

