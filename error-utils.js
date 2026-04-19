export const errorMessages = {
  recipe: {
    search: 'We could not find recipes matching your search.',
    random: 'We could not fetch random recipes right now.',
    details: 'We could not retrieve recipe details.',
    similar: 'We could not find similar recipes.',
    nutrition: 'We could not find that nutrition label.',
  },
  ui: {
    record: 'We could not load the selection options.',
    intolerance: 'We could not load food intolerances.',
    cuisine: 'We could not load cuisines.',
    meal: 'We could not load meal options.'
  }
};

export function handleError(res, err, message = 'Whoops something went wrong from our end!') {
  console.error(err);
  res.status(500).send({ error: message });
}