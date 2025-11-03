const templateFolder = 'template/';

function displayTemplate(html, divSelector) {
    const div = document.querySelector(divSelector);
    div.insertAdjacentHTML("beforebegin", html)
    div.remove();
}

async function renderTemplate() {
    try {
        const data = await Promise.all([fetch(`${templateFolder}header.html`), fetch(`${templateFolder}footer.html`)]);
        const [header, footer] = await Promise.all(data.map(r => r.text()));
        return { header, footer }
    } catch (err) {
        console.log('There was an error rendering template', err)
    }

}

renderTemplate().then(({ header, footer }) => {
    displayTemplate(header, '#header');
    displayTemplate(footer, '#footer');
});

