export const serializeURLSearchParams = urlSearchParams => {
    // This is the default delimiter used by URLSearchParams within arrays in the toString method
    const coma = '%2C';
    // Used to seperate spaces in strings
    const sep = '+';
    return urlSearchParams.toString()
        .replaceAll(coma, ',')
        .replaceAll(sep, ' ');
}

export const titleCase = sentance => sentance
    .toLowerCase()
    .split(' ')
    .map(word => word.replace(word[0], word[0].toUpperCase()))
    .join(' ');

export const sortedArray = arr => arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
export const getRandomItem = arr => arr[(Math.random() * arr.length) | 0];

export const getRandomMeals = (numberOfMeals, arr) => {
    const randomMeals = new Set();
    for (let i = 0; i < numberOfMeals; i++) randomMeals.add(getRandomItem(arr));
    const MIN_NUM_MEALS = 2;
    const isMealSizeSmall = randomMeals.size < MIN_NUM_MEALS;
    if (randomMeals.size < numberOfMeals) {
        while (randomMeals.size < numberOfMeals) randomMeals.add(getRandomItem(arr));
    }
    if (isMealSizeSmall) {
        while (randomMeals.size < MIN_NUM_MEALS) randomMeals.add(getRandomItem(arr));
    }
    return randomMeals;
}


export const DurationFormat = Object.freeze({
    LONG: 'long',
    SHORT: 'short',
    NARROW: 'narrow',
})


export const calcDuration = (totalMinutes, style = DurationFormat.LONG) =>  new Intl.DurationFormat('en', { style }).format(timeFormat(totalMinutes));

function timeFormat(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return {hours, minutes}

}


export const isValidNumber = num => !isNaN(num) || num !== 0;
export const createLi = (text) => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(text));
    return li;
}

