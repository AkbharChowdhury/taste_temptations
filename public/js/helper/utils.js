export function changeMetaData(metaData) {
    const metas = document.getElementsByTagName("meta");
    for (const [key, value] of Object.entries(metaData)) {
        metas[key]['content'] = value;
    }

}

export const titleCase = sentence => sentence
    .toLowerCase()
    .split(' ')
    .map(word => word.replace(word[0], word[0].toUpperCase()))
    .join(' ');

export const sortedArray = (arr = []) => arr.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
export const getRandomItem = arr => arr[(Math.random() * arr.length) | 0];
export const isValidNumber = num => !isNaN(num) || num !== 0;
export const createLi = text => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(text));
    return li;
}

export const getClone = selector => document.querySelector(selector).content.cloneNode(true);