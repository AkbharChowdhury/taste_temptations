export const titleCase = (sentance) => sentance.toLowerCase() 
           .split(' ') 
           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
           .join(' ');