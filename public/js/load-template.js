const templateFolder = 'template/';

function displayTemplate(html, divSelector) {
    const div = document.querySelector(divSelector);
    div.insertAdjacentHTML("beforebegin", html)
    div.remove();
}

// function renderTemplate() {
//     const fetchHeader = fetch(`${templateFolder}header.html`);
//     const fetchFooter = fetch(`${templateFolder}footer.html`);
//     Promise.all([fetchHeader, fetchFooter])
//         .then(values => Promise.all(values.map(r => r.text())))
//         .then(([header, footer]) => {
//             displayTemplate(header, '#header');
//             displayTemplate(footer, '#footer');
//         }).catch(err => console.error('There was an error rendering template', err))
// }

// renderTemplate()

const renderTemplate = async () => {
    try {
        const data = await Promise.all([fetch(`${templateFolder}header.html`), fetch(`${templateFolder}footer.html`)]);
        const [header, footer] = await Promise.all(data.map(r => r.text()));
        return { header, footer }
    } catch (err) {
        console.error('There was an error rendering template', err)
    }
}
renderTemplate().then(data => {
    const { header, footer } = data;
    displayTemplate(header, '#header');
    displayTemplate(footer, '#footer');

});