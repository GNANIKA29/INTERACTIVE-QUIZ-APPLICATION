// ✅ script.js – Final with Summary Stats and Animations (No Sounds)

let currentLevel = parseInt(localStorage.getItem("quizLevel")) || 1;
let score = parseInt(localStorage.getItem("quizScore")) || 0;
let selectedCategory = localStorage.getItem("quizCategory") || "any";
let currentQuestionIndex = 0;
let questionPool = [];
let timer;
let timeLeft = 15;

const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");
const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress");
const usernameDisplay = document.getElementById("username-display");
const categorySelect = document.getElementById("category-select");
const finalScoreText = document.getElementById("final-score");
const highestLevelText = document.getElementById("highest-level");
const playedCategoryText = document.getElementById("played-category");

function startGame() {
  selectedCategory = categorySelect.value;
  localStorage.setItem("quizCategory", selectedCategory);
  document.getElementById("opening-screen").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  currentLevel = 1;
  score = 0;
  localStorage.setItem("quizLevel", currentLevel);
  localStorage.setItem("quizScore", score);
  startLevel(currentLevel);
}

async function startLevel(level) {
  currentLevel = level;
  currentQuestionIndex = 0;
  questionText.textContent = "Loading questions...";
  optionsContainer.innerHTML = "";

  questionPool = await generateQuestionPool(currentLevel, selectedCategory);
  if (!questionPool || questionPool.length === 0 || !questionPool[0].answer) {
    return;
  }
  updateUI();
  showQuestion();
}

function showQuestion() {
  resetTimer();
  const currentQ = questionPool[currentQuestionIndex];
  questionText.classList.remove("fade-in");
  void questionText.offsetWidth;
  questionText.classList.add("fade-in");

  questionText.textContent = currentQ.question;
  optionsContainer.innerHTML = "";
  currentQ.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn scale-hover";
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.textContent = opt;
    btn.onclick = () => {
      checkAnswer(opt);
    };
    optionsContainer.appendChild(btn);
  });
  updateProgress();
}

function checkAnswer(selected) {
  clearInterval(timer);
  const correct = questionPool[currentQuestionIndex].answer;
  if (selected === correct) {
    showToast("Correct ✅");
    score += 10;
    currentQuestionIndex++;
    localStorage.setItem("quizScore", score);
    localStorage.setItem("quizLevel", currentLevel);

    if (currentQuestionIndex >= questionPool.length) {
      showToast(`🎉 Level ${currentLevel} Completed!`, "info");
      setTimeout(() => startLevel(currentLevel + 1), 2000);
    } else {
      setTimeout(showQuestion, 1000);
    }
  } else {
    showToast("❌ Wrong Answer! Showing Summary...");
    showSummary();
  }
  updateUI();
}

function showSummary() {
  document.getElementById("quiz-container").classList.add("hidden");
  const summary = document.getElementById("summary-screen");
  summary.classList.remove("hidden");
  summary.classList.add("slide-in");

  finalScoreText.textContent = `🎯 Final Score: ${score}`;
  highestLevelText.textContent = `📈 Highest Level Reached: ${currentLevel}`;

  const catText = categorySelect.options[categorySelect.selectedIndex].textContent;
  playedCategoryText.textContent = `🧠 Category Played: ${catText}`;
}

function restartQuiz() {
  score = 0;
  currentLevel = 1;
  localStorage.removeItem("quizScore");
  localStorage.removeItem("quizLevel");
  document.getElementById("summary-screen").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  startLevel(currentLevel);
}

function updateProgress() {
  const percent = ((currentQuestionIndex) / questionPool.length) * 100;
  progressBar.style.width = `${percent}%`;
}

function updateUI() {
  levelDisplay.textContent = `Level: ${currentLevel}`;
  scoreDisplay.textContent = `Score: ${score}`;
  usernameDisplay.textContent = localStorage.getItem("quizUser") || "Player";
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerDisplay.textContent = `⏱ ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱ ${timeLeft}`;
    if (timeLeft === 0) {
      showToast("⌛ Time's up! Showing Summary...");
      showSummary();
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("quizUser") || "Player";
  usernameDisplay.textContent = user;

  if (categorySelect && selectedCategory !== "any") {
    categorySelect.value = selectedCategory;
  }
});
