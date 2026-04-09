// function displayTemplate(html, divSelector) {
//     const div = document.querySelector(divSelector);
//     div.insertAdjacentHTML("beforebegin", html)
//     div.remove();
// }

// async function renderTemplate() {
//     try {
//         const templateFolder = 'template';
//         const files = ['header.html', 'footer.html'];
//         const data = await Promise.all(files.map(file => fetch(`${templateFolder}/${file}`)));
//         const [header, footer] = await Promise.all(data.map(r => r.text()));
//         return { header, footer }
//     } catch (err) {
//         console.log('There was an error rendering template', err);
//     }

// }

// renderTemplate().then(({ header, footer }) => {
//     displayTemplate(header, '#header');
//     displayTemplate(footer, '#footer');
//     document.querySelector('#load-template')?.remove();
// });

async function loadTemplates() {

    const templateFolder = 'template';
    const templates = [
        { selector: '#header', file: 'header.html' },
        { selector: '#footer', file: 'footer.html' }
    ];

    try {
        const responses = await Promise.all(templates.map(t => fetch(`${templateFolder}/${t.file}`)));
        const htmlTexts = await Promise.all(responses.map(res => res.text()) );

        return templates.map((t, index) => ({
            selector: t.selector,
            html: htmlTexts[index]
        }));

    } catch (err) {
        console.error('Error loading templates:', err);
        return [];
    }
}

function renderTemplates(templatesData) {
    templatesData.forEach(({ selector, html }) => {
        const div = document.querySelector(selector);
        if(!div) return;
        div.insertAdjacentHTML("beforebegin", html);
        div.remove();
    });
}
loadTemplates()
.then(renderTemplates)
.finally(() => document.querySelector('#load-template')?.remove());





