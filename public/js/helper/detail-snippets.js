
const getItemStr = (items, key) => items.map(item => `<li>${item[key]}</li>`).join().replaceAll(',', '');

export const getSteps = ({steps}) =>
    `<ol>
        ${getItemStr(steps, 'step')}
    </ol>   
    `;

export const getIngredientsList = ({ extendedIngredients }) =>
    `<ul>
        ${getItemStr(extendedIngredients, 'original')}
    </ul>   
    `;

