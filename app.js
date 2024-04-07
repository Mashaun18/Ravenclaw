const quizContainer = document.getElementById('quiz');
const startButton = document.getElementById('start');
const timerDisplay = document.getElementById('time');
const leaderboard = document.getElementById('leaderboard');

let timer;
let timeLeft = 90;
let currentQuestion = 0;
let score = 0;

function displayQuestion() {
    const questionData = questions[currentQuestion];
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
        <h2>${questionData.question}</h2>
        <ul>
            ${questionData.options.map(option => `<li><button class="option">${option}</button></li>`).join('')}
        </ul>
    `;
    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionElement);

    document.querySelectorAll('.option').forEach(button => {
        button.addEventListener('click', () => {
            checkAnswer(button.textContent);
        });
    });
}

function checkAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestion].answer;
    if (selectedOption === correctAnswer) {
        score++;
    }

    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

function startQuiz() {
    displayQuestion();
    timer = setInterval(updateTimer, 1000);
    startButton.disabled = true;
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft + ' seconds';

    if (timeLeft <= 0) {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(timer);
    quizContainer.innerHTML = '';
    timerDisplay.textContent = 'Time is up!';
    leaderboard.innerHTML = `
        <h2>Your Score: ${score}</h2>
    `;
    saveScore();
}

function saveScore() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores.splice(5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayLeaderboard(highScores);
}

function displayLeaderboard(scores) {
    leaderboard.innerHTML += `
        <h2>High Scores</h2>
        <ol>
            ${scores.map((score, index) => `<li>${index + 1}. ${score}</li>`).join('')}
        </ol>
    `;
}

startButton.addEventListener('click', startQuiz);
