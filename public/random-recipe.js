async function fetchRandomRecipes() {
    const response = await fetch('randomrecipes');
    const data = await response.text();
    document.getElementById('result').innerHTML = data;
  }
  fetchRandomRecipes();