(async () => {
    const templates = await loadTemplates();
    renderTemplates(templates);
    document.querySelector('#load-template')?.remove();
})();

async function loadTemplates() {
    const templateFolder = 'template';

    const templateConfigs = [
        { selector: '#header', file: 'header.html' },
        { selector: '#footer', file: 'footer.html' },
    ];

    try {
        const templates = await Promise.all(
            templateConfigs.map(async ({ selector, file }) => {
                const response = await fetch(`${templateFolder}/${file}`);
                const html = await response.text();
                return { selector, html };
            })
        );

        return templates;

    } catch (err) {
        console.error('Error loading templates:', err);
        return [];
    }
}

function renderTemplates(templatesData) {
    templatesData.forEach(({ selector, html }) => {
        const el = document.querySelector(selector);
        if (!el) return;
        el.insertAdjacentHTML("beforebegin", html);
        el.remove();
    });
}