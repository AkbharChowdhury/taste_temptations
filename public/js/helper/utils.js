export const titleCase = (sentance) => sentance
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
export const sortedArray = (array) => array.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export const getRandomItem = (arr) => arr[(Math.random() * arr.length) | 0];


export const getRandomMeals = (numberOfMeals, itemArray) => {
    let randomMeals = new Set();
    for (let i = 0; i < numberOfMeals; i++) {
        randomMeals.add(getRandomItem(itemArray));
    }
    console.log(randomMeals);
    if (randomMeals.size === 1) {
        while (randomMeals.size === 1) {
            randomMeals.add(getRandomItem(itemArray));
        }

    }
    return randomMeals;

}



