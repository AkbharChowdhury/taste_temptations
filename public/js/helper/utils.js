export const titleCase = (sentance) => sentance
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
export const sortedArray = (array) => array.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
