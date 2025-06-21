let allQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizMeta = {}; // For displaying category & group info

window.onload = async function () {
  await loadQuestions();

  setTimeout(() => {
    document.getElementById("splash").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
    document.getElementById("header").classList.remove("hidden");

    setTimeout(() => {
      document.getElementById("start-screen").classList.add("hidden");
      document.getElementById("quiz").classList.remove("hidden");
      showQuestion();
    }, 2000);
  }, 3000);
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

  document.getElementById("question").textContent = q.question;
  document.getElementById("quiz-category").textContent = q.category;
  document.getElementById("quiz-progress").textContent = `ಪ್ರಶ್ನೆ ${currentQuestionIndex + 1} / ${allQuestions.length}`;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-left hover:bg-blue-100 transition";
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

function showSummary() {
  document.getElementById("quiz").classList.add("hidden");
  const summaryContainer = document.getElementById("summary");
  const cards = document.getElementById("summary-cards");
  summaryContainer.classList.remove("hidden");

  userAnswers.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "bg-white border border-gray-200 rounded-md p-4";

    card.innerHTML = `
      <h4 class="font-semibold">${index + 1}. ${entry.question}</h4>
      <p class="mt-1 ${entry.isCorrect ? "text-green-500":"text-red-500"}">ನಿಮ್ಮ ಉತ್ತರ: <strong>${entry.yourAnswer}</strong></p>
      ${!entry.isCorrect ? `<p class="">ಸರಿಯಾದ ಉತ್ತರ: <strong>${entry.correctAnswer}</strong></p>` : ""}
      <p class="text-sm text-gray-600 italic mt-2">${entry.description}</p>
    `;

    cards.appendChild(card);
  });
}

