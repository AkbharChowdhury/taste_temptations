export const getSteps = steps => /*html*/`
    <ol>
        ${steps.map(step => `<li>${step.step}</li>`).join().replaceAll(',', '')}
    </ol>   
    `;
const table = i => `
    <tr>
      <td>${i.amount}${i.unit} ${i.name}</td>
    </tr>
    `;
const nutritionalContent = ["Calories", "Fat", "Carbohydrates", "Sugar", "Protein", "Cholesterol"];
export const nutritionDetails = nutrients => nutrients
    .filter(item => nutritionalContent.includes(item.name))
    .map(table)
    .join()
    .replaceAll(',', '');

