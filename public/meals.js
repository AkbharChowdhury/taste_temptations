async function getMeals() {
    const response = await fetch('/meals');
    const data = await response.text();
    document.getElementById('meal_type').insertAdjacentHTML("afterbegin", data);

}
getMeals();