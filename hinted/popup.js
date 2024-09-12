// Replace the code you had in your script tag with this

const today = new Date().toISOString().split('T')[0];
const defaultHint = "A large, majestic mammal often seen in African safaris.";
const answer = "elephant";
const answerLength = answer.length;
const totalPlayers = 1000000;
let startTime = performance.now();

function loadGuesses() {
    const storedDate = localStorage.getItem('date');
    if (storedDate !== today) {
        localStorage.clear();
        localStorage.setItem('date', today);
    }
    return JSON.parse(localStorage.getItem('guesses')) || {};
}

function saveGuesses(guesses) {
    localStorage.setItem('guesses', JSON.stringify(guesses));
}

function getGuessCount() {
    return parseInt(localStorage.getItem('guessCount')) || 0;
}

function incrementGuessCount() {
    const guessCount = getGuessCount() + 1;
    localStorage.setItem('guessCount', guessCount);
    return guessCount;
}

function displayGuesses() {
    const guesses = loadGuesses();
    const list = document.getElementById('guesses-list');
    list.innerHTML = Object.keys(guesses).map(word => `<li>${word}</li>`).join('');
}

function displayGuessCount() {
    const guessCount = getGuessCount();
    document.getElementById('guess-count').textContent = `Total guesses: ${guessCount}`;
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = milliseconds % 1000;

    return `${hours}h ${minutes}m ${seconds}s ${Math.floor(ms / 10)}ms`;
}

function calculateGlobalRank(timeTaken) {
    return Math.min(totalPlayers, Math.ceil(totalPlayers * (timeTaken / 60000)));
}

function displayGlobalRank(rank) {
    document.getElementById('global-rank').textContent = `Global rank: #${rank} of all players today`;
    document.getElementById('global-rank').style.display = 'block';
}

function createLetterBoxes() {
    const container = document.getElementById('letter-boxes');
    container.innerHTML = '';
    for (let i = 0; i < answerLength; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = 'letter-box';
        input.dataset.index = i;
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeyDown);
        container.appendChild(input);
    }
    if (container.firstChild) {
        container.firstChild.focus();
    }
}

function handleInput(event) {
    const input = event.target;
    const index = parseInt(input.dataset.index);
    const value = input.value;

    if (value) {
        const nextBox = document.querySelector(`.letter-box[data-index="${index + 1}"]`);
        if (nextBox) {
            nextBox.focus();
        }
    }
}

function handleKeyDown(event) {
    const input = event.target;
    const index = parseInt(input.dataset.index);

    if (event.key === 'Backspace') {
        if (input.value === '') {
            const prevBox = document.querySelector(`.letter-box[data-index="${index - 1}"]`);
            if (prevBox) {
                prevBox.focus();
                prevBox.value = '';
            }
        }
    } else if (event.key === 'Enter') {
        event.preventDefault();
        submitGuess();
    }
}

function submitGuess() {
    const inputs = document.querySelectorAll('#letter-boxes input');
    let guess = '';
    inputs.forEach(input => {
        guess += input.value.toLowerCase();
    });
    guess = guess.trim();

    if (guess.length !== answerLength) {
        alert('Please fill all letter boxes.');
        return;
    }

    const guesses = loadGuesses();
    guesses[guess] = (guesses[guess] || 0) + 1;
    saveGuesses(guesses);
    displayGuesses();

    const result = document.getElementById('result');
    const guessCount = incrementGuessCount();
    displayGuessCount();

    if (guess === answer) {
        const endTime = performance.now();
        const timeTaken = endTime - startTime;

        result.textContent = `Correct! You guessed "${guess}" in ${formatTime(timeTaken)}, taking ${guessCount} guesses.`;
        result.className = "correct";

        document.getElementById('time-taken').textContent = `Time taken: ${formatTime(timeTaken)}`;
        document.getElementById('time-taken').style.display = 'block';

        const globalRank = calculateGlobalRank(timeTaken);
        displayGlobalRank(globalRank);

        localStorage.setItem('lastResult', JSON.stringify({
            correctGuess: guess,
            timeTaken: formatTime(timeTaken),
            guessCount: guessCount,
            globalRank: globalRank
        }));
    } else {
        result.textContent = `Incorrect. You guessed "${guess}".`;
        result.className = "incorrect";
    }

    inputs.forEach(input => input.value = '');
}

function loadLastResult() {
    const lastResult = JSON.parse(localStorage.getItem('lastResult'));
    if (lastResult) {
        const result = document.getElementById('result');
        result.textContent = `Your last result: Guessed "${lastResult.correctGuess}" in ${lastResult.timeTaken}, taking ${lastResult.guessCount} guesses.`;
        result.className = "correct";
        document.getElementById('time-taken').textContent = `Time taken: ${lastResult.timeTaken}`;
        document.getElementById('time-taken').style.display = 'block';
        document.getElementById('global-rank').textContent = `Global rank: #${lastResult.globalRank} of all players today`;
        document.getElementById('global-rank').style.display = 'block';
    }
}

function getHintFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('hint') || defaultHint;
}

document.getElementById('hint').textContent = `Hint: ${getHintFromURL()}`;
createLetterBoxes();
displayGuesses();
displayGuessCount();
loadLastResult();
