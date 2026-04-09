function displayTemplate(html, divSelector) {
    const div = document.querySelector(divSelector);
    div.insertAdjacentHTML("beforebegin", html)
    div.remove();
}

async function renderTemplate() {
    try {
        const templateFolder = 'template';
        const files = ['header.html', 'footer.html'];
        const requests = files.map(file => fetch(`${templateFolder}/${file}`))
        const data = await Promise.all(requests);
        const [header, footer] = await Promise.all(data.map(r => r.text()));
        return { header, footer }
    } catch (err) {
        console.log('There was an error rendering template', err);
    }

}

renderTemplate().then(({ header, footer }) => {
    displayTemplate(header, '#header');
    displayTemplate(footer, '#footer');
    document.querySelector('#load-template').remove();
});


