// script.js
document.addEventListener('DOMContentLoaded', () => {
  const diceContainer = document.getElementById('dice-container');
  const resultsDiv = document.getElementById('results');
  const historyDiv = document.getElementById('history');
  const rollSound = document.getElementById('roll-sound');

  // Create dice buttons
  [4, 6, 8, 10, 12, 20].forEach(sides => {
      const dice = document.createElement('div');
      dice.className = 'dice';
      dice.id = `dice-${sides}`;
      dice.innerText = `d${sides}`;
      dice.addEventListener('click', () => rollDice(dice, sides));
      diceContainer.appendChild(dice);
  });

  function rollDice(diceElement, sides) {
      rollSound.play();
      // Add rolling class to the specific dice clicked
      diceElement.classList.add('rolling');

      setTimeout(() => {
          diceElement.classList.remove('rolling');
      }, 500); // Match this duration to the animation duration

      const roll = Math.floor(Math.random() * sides) + 1;
      displayResult(roll, sides);
      addToHistory(roll, sides);
  }

  function displayResult(result, sides) {
      resultsDiv.innerHTML = `You rolled a <strong>${result}</strong> on a d${sides}.`;
  }

  function addToHistory(result, sides) {
      const entry = document.createElement('div');
      entry.innerText = `d${sides}: ${result}`;
      historyDiv.appendChild(entry);
  }
});
