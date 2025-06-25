function showIngredientList(ingredientlist) {
      const ingredientListDiv = document.querySelector('#IngredientsList');
      let html = /*html*/`<ul>`;
      ingredientlist.map(ingredient => html += /*html*/`<li>${ingredient}</li>`);
      html += /*html*/`</ul>`;
      ingredientListDiv.innerHTML = html;

    }

  function showDishTypeTags(dishes) {
      let html = '';
      dishes.forEach(dish => html+= `<a class="badge bg-secondary text-decoration-none link-light" href="#!">${dish}</a>`)
      return html;

    }

  


    function showInstructions(Instructions) {
      // const instructionListDiv = document.querySelector('#InstructionList');
      // let html = /*html*/`<ol>`;
      // Instructions.steps.map(data => html += /*html*/`<li>${data.step}</li>`);
      // html += /*html*/`</ol>`;
      // instructionListDiv.innerHTML = html;

    }
    async function fetchRecipeDetails(recipeID) {
      const FOOD_API_KEY = 'e4676fffe7a44c199a14a757dab8b587';
      const response = await fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${FOOD_API_KEY}`);
      // // url ='https://api.spoonacular.com/recipes/638893/information?apiKey=e4676fffe7a44c199a14a757dab8b587'
      // // const response = await fetch(url);
      const data = await response.json();
      return data;

    }

    function fetchRecipeID() {
      const recipeID = 'recipeID';
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has(recipeID)) return parseInt(searchParams.get(recipeID));
      return 0;
    }



    const recipeID = fetchRecipeID();
    if (recipeID === 0) {
      console.error('recipe id cannot be found')

    } else {


     populatePage();


    }
    function populatePage(){
       fetchRecipeDetails(recipeID).then(data => {
        const title = document.querySelector('#item-title');
        const image = document.querySelector('#item-image');
        const ingredientlist = data.extendedIngredients.map(ingredient => ingredient.original)
        showIngredientList(ingredientlist)
        title.textContent = data.title;
        image.setAttribute('src', data.image)
        image.setAttribute('alt', data.title)
        document.getElementById('addtional-details').innerHTML = /*html*/`
        ${data.readyInMinutes} minutes, serves ${data.servings} `
         document.getElementById('recipe-summary').innerHTML = data.summary;
        
         document.getElementById('dishTypes').innerHTML = showDishTypeTags(data.dishTypes);

        // // showInstructions(data.analyzedInstructions)
        // console.log(data.analyzedInstructions)
        console.log('steps: ')
          console.log(data.analyzedInstructions[0])
          // console.log()

          let htmlSteps = '<ol>';
          data.analyzedInstructions[0]['steps'].forEach(step => {
           htmlSteps+= `<li>${step.step}</li>`
            
          });
          htmlSteps+= '</ol>';




        
        document.getElementById('stepsListContainer').innerHTML = htmlSteps;




      });
    }