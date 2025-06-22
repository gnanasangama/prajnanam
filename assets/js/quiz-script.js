let allQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizMeta = {}; // For displaying category & group info

window.onload = async function () {
    const quizInfo = JSON.parse(localStorage.getItem("quizStatus") || "{}");
    const todayStr = new Date().toISOString().split("T")[0];

    // 🧹 Clear old data if it's from a previous day
    if (quizInfo.date && quizInfo.date !== todayStr) {
        localStorage.removeItem("quizStatus");
    }
    
    // Always show splash
    setTimeout(() => {
        document.getElementById("splash").classList.add("hidden");
        document.getElementById("header").classList.remove("hidden");

        if (quizInfo.date === todayStr) {
            // Already attempted today, show summary after splash
            showSummary(quizInfo.data);
            return;
        }

        // Else: start the quiz normally
        document.getElementById("start-screen").classList.remove("hidden");

        setTimeout(() => {
            document.getElementById("start-screen").classList.add("hidden");
            document.getElementById("quiz").classList.remove("hidden");
            showQuestion();
        }, 2000);

    }, 3000); // splash delay

    // Load today's questions regardless (needed for quiz)
    await loadQuestions();
};

async function loadQuestions() {
    const res = await fetch("assets/js/quiz-questions.json");
    const data = await res.json();

    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const todayEntry = data["weekly-special"][today];

    const { category, groupCode } = todayEntry;
    const groupQuestions = data.questions?.[category]?.[groupCode] ?? [];

    if (!groupQuestions.length) {
        alert("ಇಂದು ಯಾವುದೇ ರಸಪ್ರಶ್ನೆ ಲಭ್ಯವಿಲ್ಲ.");
        return;
    }

    allQuestions = groupQuestions.map(q => ({
        ...q,
        category,
        groupCode
    }));

    quizMeta = { category, groupCode };
}


function showQuestion() {
    const q = allQuestions[currentQuestionIndex];

    document.getElementById("question").textContent = `${currentQuestionIndex + 1}. ${q.question}`;
    document.getElementById("quiz-category").textContent = q.category;
    document.getElementById("quiz-progress").textContent = `ಪ್ರಶ್ನೆ ${currentQuestionIndex + 1} / ${allQuestions.length}`;

    const percent = ((currentQuestionIndex) / allQuestions.length) * 100;
    document.getElementById("progress-bar").style.width = `${percent}%`;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.className = "w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-left hover:bg-blue-100 transition";
        btn.onclick = () => handleAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selected) {
    const q = allQuestions[currentQuestionIndex];
    const isCorrect = selected === q.answer;

    userAnswers.push({
        question: q.question,
        yourAnswer: selected,
        correctAnswer: q.answer,
        isCorrect,
        description: q.description
    });

    showResultModal(isCorrect);

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < allQuestions.length) {
            showQuestion();
        } else {
            showSummary();
        }
    }, 1200);
}

function showResultModal(isCorrect) {
    const modal = document.getElementById("result-modal");
    const icon = document.getElementById("result-icon");
    const text = document.getElementById("result-text");

    icon.textContent = isCorrect ? "✅" : "❌";
    text.textContent = isCorrect ? "ಸರಿ!" : "ತಪ್ಪು!";
    modal.classList.remove("hidden");

    setTimeout(() => {
        modal.classList.add("hidden");
    }, 1000);
}

function showSummary(savedAnswers = null) {
    document.getElementById("quiz").classList.add("hidden");

    const summaryContainer = document.getElementById("summary");
    const cards = document.getElementById("summary-cards");
    summaryContainer.classList.remove("hidden");
    cards.innerHTML = "";

    const answers = savedAnswers || userAnswers;
    const correctCount = answers.filter(a => a.isCorrect).length;
    const total = answers.length;

    document.getElementById("quiz-score-value").textContent = `${correctCount} / ${total}`;

    let message = correctCount === total
        ? "ಅಭಿನಂದನೆಗಳು! ಎಲ್ಲಾ ಉತ್ತರ ಸರಿಯಾದವು!"
        : correctCount >= total * 0.7
            ? "ಅತ್ಯುತ್ತಮ ಪ್ರಯತ್ನ! ಇನ್ನಷ್ಟು ಅಭ್ಯಾಸ ಮಾಡಿ."
            : "ಚಿಂತಿಸಬೇಡಿ – ಅಭ್ಯಾಸ ಮುಂದುವರಿಸಿ!";
    document.getElementById("quiz-score-message").textContent = message;

    answers.forEach((entry, index) => {
        const card = document.createElement("div");
        card.className = `bg-white shadow-sm border-l-4 ${entry.isCorrect ? "border-green-500" : "border-red-500"} rounded-lg p-5 hover:shadow-md transition-shadow`;
        card.innerHTML = `
      <h4 class="font-semibold text-gray-800 mb-2">
        ${index + 1}. ${entry.question} <span class="ms-1">${entry.isCorrect ? "✅" : "❌"}</span>
      </h4>
      <p class="mb-1 ${entry.isCorrect ? "text-green-600" : "text-red-600"}">
        ನಿಮ್ಮ ಉತ್ತರ: <strong>${entry.yourAnswer}</strong>
      </p>
      ${!entry.isCorrect ? `<p class="mb-1 text-blue-700">ಸರಿಯಾದ ಉತ್ತರ: <strong>${entry.correctAnswer}</strong></p>` : ""}
      <p class="text-sm text-gray-500 italic mt-2">${entry.description}</p>
    `;
        cards.appendChild(card);
    });

    // ✅  Only persist the first time
    if (!savedAnswers) {
        const todayStr = new Date().toISOString().split("T")[0];
        localStorage.setItem("quizStatus", JSON.stringify({
            date: todayStr,
            data: answers
        }));
    }
}

function goBack() {
    window.location.href = "/";
}

function shareWhatsApp() {
    const quizURL = `${window.location.origin}/quiz`;
    const message = `ನಾನು ಈ ರಸಪ್ರಶ್ನೆಯಲ್ಲಿ ಭಾಗವಹಿಸಿದ್ದೆ - ತುಂಬಾ ಮಾಹಿತಿಯುತ ಹಾಗೂ ಆಸಕ್ತಿದಾಯಕವಾಗಿದೆ! ನೀವೂ ಓಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.\n\nನೀವು ಈ ರಸಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಆಡಬಹುದು: ${quizURL}`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/?text=${encodedMessage}`;
    window.open(url, "_blank");
}
