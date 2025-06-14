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
                        <button class="accordion-button ${index === 2 ? '' : 'collapsed'}" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                            aria-expanded="${index === 0 ? 'true' : 'false'}" 
                            aria-controls="collapse${index}">
                            <small class="text-body-secondary">${week.date}</small>
                        </button>
                    </h2>
                    <div id="collapse${index}" 
                        class="accordion-collapse collapse ${index === 2 ? 'show' : ''}" 
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

function renderBaudhikYojane() {
    const container = document.querySelector('#baudhik-screen .content-area');
    if (!container) return;

    const html = `
        <div class="row g-2">
            <div class="col-12">
                <div class="card app-card">
                    <div class="card-body">
                        <h5 class="card-title mb-3 text-center">
                            <span class="badge rounded-pill" style="background-color: #dd9b2a">
                                ವಿದ್ಯಾರ್ಥಿ
                            </span>
                        </h5>
                        <hr/>
                        <ul class="list-group list-group-flush">
                            ${content.baudhik[0].other.map(item => `
                                <li class="list-group-item">
                                    <small class="text-muted d-block">${item.title}</small>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>${item.text}</span>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card app-card">
                    <div class="card-body">
                        <h5 class="card-title mb-3 text-center">
                            <span class="badge rounded-pill" style="background-color: #d8755f">
                                ಉದ್ಯೋಗಿ
                            </span>
                        </h5>
                        <hr/>
                        <ul class="list-group list-group-flush">
                            ${content.baudhik[1].other.map(item => `
                                <li class="list-group-item">
                                    <small class="text-muted d-block">${item.title}</small>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>${item.text}</span>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}

function renderSharirik() {
    const container = document.querySelector('#sharirik-screen .content-area');
    if (!container) return;

    const html = `
        ${content.sharirik.map(month => `
            <div class="card app-card mb-3">
                <div class="card-body">
                    <h5 class="card-title mb-3 text-center">${month.month}</h5>
                    <hr/>
                    <ul class="list-unstyled mb-0">
                        ${month.items.map(item => {
                            // Split the item at ':' and make the first part bold
                            const parts = item.split(' : ');
                            const boldPart = parts[0];
                            const restPart = parts[1] ? ` : ${parts[1]}` : '';
                            
                            return `
                                <li class="mb-2">
                                    <i class="bi bi-dot"></i>
                                    <b>${boldPart}</b>${restPart}
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            </div>
        `).join('')}
    `;
    container.innerHTML = html;
}

function renderShakha() {
    const container = document.querySelector('#shakha-screen .content-area');
    if (!container) return;

    const html = `
        ${content.shakha.map(section => `
            <div class="card app-card mb-3">
                <div class="card-body">
                    <h5 class="card-title mb-3 text-center">${section.title}</h5>
                    <hr/>
                    <ul class="list-unstyled mb-0">
                        ${section.items.map(item => `
                            <li class="mb-2">
                                <i class="bi bi-dot"></i>
                                ${item}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('')}
    `;
    container.innerHTML = html;
}

function renderCalendar() {
    const container = document.querySelector('#calendar-screen .content-area');
    if (!container) return;

    const html = `
        <!-- Current Month Events -->
        <div class="card app-card mb-3">
            <div class="card-body">
                <h5 class="card-title text-center">ಮಾಸಿಕ ವಿಶೇಷ</h5>
                <hr/>
                <ul class="list-group list-group-flush">
                    ${content.calendar.current.map(event => `
                        <li class="list-group-item">
                            <div>🔶 <b>${event.title}</b></div>
                            <small class="ms-3">${event.date}</small>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>

        <!-- Annual Calendar -->
        <div class="card app-card">
            <div class="card-body">
                <h5 class="card-title text-center">ವಾರ್ಷಿಕ ಯೋಜನೆ</h5>
                <hr/>
                <ul class="list-group list-group-flush">
                    ${content.calendar.annual.map(event => `
                        <li class="list-group-item">
                            <div><b>${event.title}</b></div>
                            <small>${event.date}</small>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
    container.innerHTML = html;
}