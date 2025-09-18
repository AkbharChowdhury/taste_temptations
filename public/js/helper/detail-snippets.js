export const getSteps = steps => /*html*/`
    <ol>
        ${steps.map(step => `<li>${step.step}</li>`).join().replaceAll(',', '')}
    </ol>   
    `;
    const table = i =>`
    <tr>
      <td>${i.amount}${i.unit} ${i.name}</td>
    </tr>
    `;
export const nutritionDetails = nutrients => {
        console.log(nutrients);
        const names = ["Calories", "Fat", "Carbohydrates", "Sugar", "Protein", "Cholesterol"];
        const filtered = nutrients.filter( i => names.includes(i.name));
        return filtered.map(table)
        .join()
        .replaceAll(',', '');

    }