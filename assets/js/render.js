function renderQuotes() {
    const quotesContainer = document.getElementById('quotes-container');
    content.quotes.forEach(week => {
        const weekElement = `
            <div class="col-lg-4 px-1">
                <div class="card">
                    <div class="card-header">
                        <small class="text-body-secondary">${week.date}</small>
                    </div>
                    <ul class="list-group list-group-flush">
                        ${week.items.map(quote => `
                            <li class="list-group-item">
                                <blockquote class="mb-0">
                                    <p>${quote.text}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <footer class="blockquote-footer mb-0 mt-0">${quote.author}</footer>
                                        <span class="badge rounded-pill" 
                                            style="background-color: ${quote.category === 'ವಿದ್ಯಾರ್ಥಿ' ? '#dd9b2a' : '#d8755f'}">
                                            ${quote.category}
                                        </span>
                                    </div>
                                </blockquote>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        quotesContainer.innerHTML += weekElement;
    });
}

function renderShlokas() {
    const shlokasContainer = document.getElementById('shlokas-container');
    
    const accordionHtml = `
        <div class="accordion p-0" id="accordionExample">
            ${content.shlokas.map((week, index) => `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                            aria-expanded="${index === 0 ? 'true' : 'false'}" 
                            aria-controls="collapse${index}">
                            <small class="text-body-secondary">${week.date}</small>
                        </button>
                    </h2>
                    <div id="collapse${index}" 
                        class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                        aria-labelledby="heading${index}" 
                        data-bs-parent="#accordionExample">
                        <div class="accordion-body p-0">
                            ${week.items.map(shloka => `
                                <div class="col-lg-4 px-0">
                                    <div class="card">
                                        <div class="card-header text-center">
                                            <span class="badge rounded-pill" 
                                                style="background-color: ${shloka.category === 'ವಿದ್ಯಾರ್ಥಿ' ? '#dd9b2a' : '#d8755f'}">
                                                ${shloka.category}
                                            </span>
                                        </div>
                                        <div class="card-body">
                                            <p class="text-center">${shloka.text}</p>
                                            <hr>
                                            <p class="mb-0" style="text-align: justify;">
                                                <b>ಅರ್ಥ : </b>${shloka.meaning}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    shlokasContainer.innerHTML = accordionHtml;
}

function renderBaudhik() {
    const baudhikContainer = document.getElementById('baudhik-container');
    content.baudhik.forEach(section => {
        const sectionElement = `
            <div class="col-lg-6 px-1">
                <div class="card">
                    <div class="card-header d-flex justify-content-center align-items-center">
                        <span class="badge rounded-pill" 
                            style="background-color: ${section.category === 'ವಿದ್ಯಾರ್ಥಿ' ? '#dd9b2a' : '#d8755f'}">
                            ${section.category}
                        </span>
                    </div>
                    <div class="card-body">
                        <table class="table table-borderless mb-0">
                            <tbody>
                                ${section.other.map(item => `
                                    <tr>
                                        <td class="text-end", style="width: 30%; white-space: nowrap;"><strong>${item.title}</strong></td>
                                        <td>${item.text}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        baudhikContainer.innerHTML += sectionElement;
    });
}

// Update initializeContent function
function initializeContent() {
    renderQuotes();
    renderShlokas();
    renderBaudhik();
}