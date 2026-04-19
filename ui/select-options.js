import { titleCase } from '#utils/utils.js';
const displayItem = item => typeof item === 'string' ? titleCase(item) : item;
export class SelectOptions {
   static selectMenu({ options = [], defaultValue }) {
    const items = options.map(item =>
        `<option value="${item}">${displayItem(item)}</option>`
    );
    return [
        `<option value="" selected disabled hidden>${defaultValue}</option>`,
        ...items,
    ].join('');
}

}