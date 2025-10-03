const templateFolder = 'template/';
async function getContent(url) {
      const response = await fetch(url);
      return await response.text();
}

function displayContent(html, divSelector) {
    const div = document.querySelector(divSelector);
    div.insertAdjacentHTML("beforebegin", html)
    div.remove();
}

getContent(`${templateFolder}header.html`).then(html => displayContent(html, '#header'))
getContent(`${templateFolder}footer.html`).then(html => displayContent(html, '#footer'))

// render('header.html', '#header');
// render('footer.html', '#footer');