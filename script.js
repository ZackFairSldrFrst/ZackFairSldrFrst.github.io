// script.js
document.addEventListener('DOMContentLoaded', () => {
  const diceContainer = document.getElementById('dice-container');
  const resultsDiv = document.getElementById('results');
  const historyDiv = document.getElementById('history');
  const statsDiv = document.getElementById('statistics');
  const rollSound = document.getElementById('roll-sound');
  const soundToggle = document.getElementById('sound-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const saveResultsBtn = document.getElementById('save-results');
  const shareResultsBtn = document.getElementById('share-results');

  let rollHistory = [];
  let avgRoll = 0, maxRoll = 0, minRoll = Infinity;

  function createDice(sides) {
      const dice = document.createElement('div');
      dice.className = `dice d${sides}`;
      dice.id = `dice-${sides}`;
      dice.innerText = `d${sides}`;
      dice.addEventListener('click', () => rollDice(dice, sides));
      diceContainer.appendChild(dice);
  }

  function rollDice(diceElement, sides) {
      if (!soundToggle.checked) {
          rollSound.pause();
          rollSound.currentTime = 0;
      } else {
          rollSound.play();
      }

      diceElement.classList.add('rolling');

      setTimeout(() => {
          diceElement.classList.remove('rolling');
      }, 500);

      const roll = Math.floor(Math.random() * sides) + 1;
      updateStatistics(roll);
      displayResult(roll, sides);
      addToHistory(roll, sides);
  }

  function updateStatistics(roll) {
      rollHistory.push(roll);
      avgRoll = rollHistory.reduce((a, b) => a + b, 0) / rollHistory.length;
      maxRoll = Math.max(maxRoll, roll);
      minRoll = Math.min(minRoll, roll);

      statsDiv.innerHTML = `
          <p>Average Roll: ${avgRoll.toFixed(2)}</p>
          <p>Highest Roll: ${maxRoll}</p>
          <p>Lowest Roll: ${minRoll}</p>
      `;
  }

  function displayResult(result, sides) {
      resultsDiv.innerHTML = `You rolled a <strong>${result}</strong> on a d${sides}.`;
  }

  function addToHistory(result, sides) {
      const entry = document.createElement('div');
      entry.innerText = `d${sides}: ${result}`;
      historyDiv.appendChild(entry);
  }

  function saveResults() {
      const blob = new Blob([JSON.stringify(rollHistory)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dice-results.json';
      a.click();
      URL.revokeObjectURL(url);
  }

  function shareResults() {
      if (navigator.share) {
          navigator.share({
              title: 'Dice Results',
              text: `I rolled: ${rollHistory.join(', ')}`,
              url: window.location.href
          }).catch(console.error);
      } else {
          alert('Share feature is not supported in this browser.');
      }
  }

  // Initialize default dice
  [4, 6, 8, 10, 12, 20].forEach(createDice);

  saveResultsBtn.addEventListener('click', saveResults);
  shareResultsBtn.addEventListener('click', shareResults);

  themeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-theme', themeToggle.checked);
  });
});
