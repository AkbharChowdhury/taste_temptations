export const getCheckboxValues = (name) =>
  [...document.querySelectorAll(`input[name="${name}"]:checked`)]
    .map(el => el.value);