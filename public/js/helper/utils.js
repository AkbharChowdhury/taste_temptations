export const titleCase = sentance => sentance
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
export const sortedArray = arr => arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
export const getRandomItem = arr => arr[(Math.random() * arr.length) | 0];

export const getRandomMeals = (numberOfMeals, arr) => {
    const randomMeals = new Set();
    for (let i = 0; i < numberOfMeals; i++) {
        randomMeals.add(getRandomItem(arr));
    }
    console.log(randomMeals);
    if (randomMeals.size === 1) {
        while (randomMeals.size === 1) {
            randomMeals.add(getRandomItem(arr));
        }

    }
    return randomMeals;

}



