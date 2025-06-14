function renderHomeContent() {
    renderAmruthavachana();
    renderShlokas();
    renderPanchanga();  // Add this line
}

function renderAmruthavachana() {
    const container = document.querySelector('#amruthavachana');
    if (!container) return;

    // Group quotes by week
    const weeklyQuotes = content.quotes.map(week => {
        return {
            date: week.date,
            items: week.items
        };
    });

    const html = `
        <div class="content-text">
            ${weeklyQuotes.map(week => `
                <div class="card mb-4">
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
            `).join('')}
        </div>
    `;
    container.innerHTML = html;
}

function renderShlokas() {
    const container = document.querySelector('#shloka');
    if (!container) return;

    const html = `
        <div class="accordion" id="shlokaAccordion">
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
                        data-bs-parent="#shlokaAccordion">
                        <div class="accordion-body p-0">
                            ${week.items.map(shloka => `
                                <div class="col-lg-4 my-3">
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
    container.innerHTML = html;
}

// Add this new function
async function renderPanchanga() {
    const container = document.querySelector('#panchanga .card-body');
    if (!container) return;

    try {
        const response = await fetch('https://gnanasangama.pythonanywhere.com/api/get/home/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const panchanga = data.sections?.[1]?.items?.[0]?.content?.content || '';
        
        const html = `
            <img src="assets/images/om.webp" style="width: 12%; margin-bottom: 1rem;">
            <p class="mb-0">
                ${panchanga.replace(/\n/g, '<br>')}
            </p>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error fetching panchanga:', error);
        container.innerHTML = `
            <img src="assets/images/om.webp" style="width: 12%; margin-bottom: 1rem;">
            <p class="mb-0">
                ಕಲಿಯುಗಾಬ್ದ 5126, ಶ್ರೀ ಶಾಲಿವಾಹನ ಶಕ 1947,<br>
                ಶ್ರೀ ವಿಶ್ವವಸು ನಾಮ ಸಂವತ್ಸರ,<br>
                ಜ್ಯೇಷ್ಠ ಮಾಸ
            </p>
        `;
    }
}