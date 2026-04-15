const searchSections = [
  { resource: 'meals', container: '#meal' },
  { resource: 'cuisines', container: '#cuisines-container' },
  { resource: 'intolerances', container: '#intolerances' },
  { resource: 'record', container: '#number' },
];

export async function renderSearchForm() {
  try {
    await Promise.all(
      searchSections.map(async ({ resource, container }) => {
        const html = await fetch(resource).then(response => response.text());
        document.querySelector(container).innerHTML = html;

      })
    );
  } catch (err) {
    console.error('Error rendering search form:', err);
  }
}