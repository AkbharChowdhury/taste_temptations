import { titleCase } from './public/js/helper/utils.js';
const displayItem = item => typeof item === 'string' ? titleCase(item) : item;
export class SelectOptions {
    static selectMenu({ arr = [], defaultVal }) {
        const options = arr.map(item => `<option value="${item}">${displayItem(item)}</option>`);
        options.unshift(`<option value="" selected>${defaultVal}</option>`);
        return options.join('');
    }
}