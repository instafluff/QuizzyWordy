// web/scripts/app.js

let wordList = [];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const questionsPerRound = 10; // You can adjust this number
let selectedLanguagePair = '';
let translationDirection = 'forward';

function init() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container text-center">
      <h1>Quizzy Wordy by Instafluff</h1>
      <p class="lead">The quizziest word memory helper app. No download required!</p>
      <div class="btn-group-vertical mt-4">
        <button class="btn btn-primary" onclick="loadWordList('cs-en', 'forward')">
          <span class="material-symbols-outlined">bolt</span> Czech to English
        </button>
        <button class="btn btn-primary" onclick="loadWordList('cs-en', 'reverse')">
          <span class="material-symbols-outlined">bolt</span> English to Czech
        </button>
        <!-- Add more language options here -->
      </div>
      &nbsp;
      <div>
        <a href="https://forms.gle/vGb3ESvKunUJX86b9">Form to add words</a>
      </div>
    </div>
  `;
}

function loadWordList(languagePair, direction = 'forward') {
  selectedLanguagePair = languagePair;
  translationDirection = direction;

  fetch(`web/data/${languagePair}.json`)
    .then(response => response.json())
    .then(data => {
      wordList = data;
      startQuiz();
    })
    .catch(error => {
      console.error('Error loading word list:', error);
      alert('Failed to load the word list.');
    });
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  generateQuestions();
  showQuestion();
}

function generateQuestions() {
  // Shuffle the word list
  const shuffledWordList = wordList.sort(() => 0.5 - Math.random());

  // Select the number of questions for the round
  const selectedWords = shuffledWordList.slice(0, questionsPerRound);

  // Map the words to questions, depending on translation direction
  questions = selectedWords.map(item => {
    if (translationDirection === 'forward') {
      return { word: item.word, translation: item.translation };
    } else {
      return { word: item.translation, translation: item.word };
    }
  });
}

function showQuestion() {
  const app = document.getElementById('app');
  const question = questions[currentQuestionIndex];

  // Generate options
  const options = generateOptions(question.translation);

  // Calculate progress percentage
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  // Build the HTML
  app.innerHTML = `
    <div class="container">
      <div class="card mt-5">
        <div class="card-body">
          <h4 class="card-title text-center">Translate:</h4>
          <h2 class="text-center mb-4"><strong>${question.word}</strong></h2>
          <div class="list-group">
            ${options
              .map(
                option => `
              <button class="list-group-item" onclick="selectOption(this, '${option}')">
                ${option}
              </button>
            `
              )
              .join('')}
          </div>
          <div class="mt-4 text-center">
            Question ${currentQuestionIndex + 1} of ${questions.length}
          </div>
          <div class="progress mt-3">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: ${progressPercent}%"
              aria-valuenow="${currentQuestionIndex}"
              aria-valuemin="0"
              aria-valuemax="${questions.length}"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateOptions(correctTranslation) {
  // Get all possible translations based on the translation direction
  let allTranslations = wordList.map(item =>
    translationDirection === 'forward' ? item.translation : item.word
  );

  // Remove the correct translation from the options
  let otherTranslations = allTranslations.filter(
    translation => translation !== correctTranslation
  );

  // Shuffle and select 3 options
  otherTranslations = otherTranslations.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Combine with the correct translation and shuffle again
  const allOptions = [...otherTranslations, correctTranslation].sort(() => 0.5 - Math.random());

  return allOptions;
}

function selectOption(buttonElement, selectedOption) {
  const question = questions[currentQuestionIndex];
  const optionsButtons = document.querySelectorAll('.list-group-item');

  // Disable all buttons to prevent multiple selections
  optionsButtons.forEach(button => (button.disabled = true));

  if (selectedOption === question.translation) {
    score++;
    buttonElement.classList.add('list-group-item-success');
  } else {
    buttonElement.classList.add('list-group-item-danger');

    // Highlight the correct answer
    optionsButtons.forEach(button => {
      if (button.textContent === question.translation) {
        button.classList.add('list-group-item-success');
      }
    });
  }

  // Proceed to the next question after a short delay (500 ms)
  setTimeout(() => {
    // Reset button states
    optionsButtons.forEach(button => {
      button.classList.remove('list-group-item-success');
      button.classList.remove('list-group-item-danger');
    });

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 500);
}

function showResults() {
  const app = document.getElementById('app');
  const percentage = ((score / questions.length) * 100).toFixed(2);

  app.innerHTML = `
    <div class="container text-center mt-5">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title">Quiz Completed!</h2>
          <p class="card-text lead">Your Score: <strong>${score} / ${questions.length}</strong></p>
          <p class="card-text">Percentage: <strong>${percentage}%</strong></p>
          <button class="btn btn-primary" onclick="startQuiz()">
            <span class="material-symbols-outlined">restart_alt</span> Restart Quiz
          </button>
          <button class="btn btn-secondary" onclick="init()">
            <span class="material-symbols-outlined">home</span> Change Language
          </button>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for using Quizzy Wordy!</p> <span class="material-symbols-outlined">favorite</span>
      </div>
    </div>
  `;
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');

  // Change icon based on mode
  const icon = document.querySelector('#dark-mode-toggle .material-symbols-outlined');
  if (body.classList.contains('dark-mode')) {
    icon.textContent = 'light_mode';
  } else {
    icon.textContent = 'dark_mode';
  }
}

// Initialize the app when the window loads
window.onload = init;
