const templateFolder = 'template/';

function displayTemplate(html, divSelector) {
    const div = document.querySelector(divSelector);
    div.insertAdjacentHTML("beforebegin", html)
    div.remove();
}

const fetchHeader = fetch(`${templateFolder}header.html`);
const fetchFooter = fetch(`${templateFolder}footer.html`);

Promise.all([fetchHeader, fetchFooter])
.then(values => Promise.all(values.map(r => r.text())) )
.then(([header, footer]) =>{
    displayTemplate(header, '#header');
    displayTemplate(footer,'#footer');
}).catch(err=> console.error('There was an error rendering template', err))
