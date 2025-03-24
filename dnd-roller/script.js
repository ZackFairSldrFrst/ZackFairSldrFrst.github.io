document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const diceContainer = document.getElementById('dice-container');
    const currentRollDisplay = document.getElementById('current-roll');
    const resultsDiv = document.getElementById('results');
    const historyDiv = document.getElementById('history');
    const statsDiv = document.getElementById('statistics');
    const rollSound = document.getElementById('roll-sound');
    const soundToggle = document.getElementById('sound-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const saveResultsBtn = document.getElementById('save-results');
    const shareResultsBtn = document.getElementById('share-results');
    const clearHistoryBtn = document.getElementById('clear-history');
  
    // State management
    const state = {
      rollHistory: [],
      statistics: {
        totalRolls: 0,
        avgRoll: 0,
        maxRoll: 0,
        minRoll: Infinity,
        diceCounts: {
          d4: 0,
          d6: 0,
          d8: 0,
          d10: 0,
          d12: 0,
          d20: 0
        }
      },
      currentTheme: localStorage.getItem('theme') || 'light',
      soundEnabled: localStorage.getItem('sound') === 'true' || false
    };
  
    // Initialize
    init();
  
    function init() {
      // Set initial theme and sound preferences
      setTheme(state.currentTheme);
      soundToggle.checked = state.soundEnabled;
      
      // Create dice
      [4, 6, 8, 10, 12, 20].forEach(createDice);
      
      // Load any saved history
      loadHistory();
      
      // Event listeners
      setupEventListeners();
    }
  
    function setupEventListeners() {
      saveResultsBtn.addEventListener('click', saveResults);
      shareResultsBtn.addEventListener('click', shareResults);
      clearHistoryBtn.addEventListener('click', clearHistory);
      
      soundToggle.addEventListener('change', (e) => {
        state.soundEnabled = e.target.checked;
        localStorage.setItem('sound', state.soundEnabled);
      });
      
      themeToggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        setTheme(theme);
        localStorage.setItem('theme', theme);
      });
    }
  
    function createDice(sides) {
      const dice = document.createElement('div');
      dice.className = `dice d${sides}`;
      dice.dataset.sides = sides;
      dice.innerHTML = `
        <span class="dice-label">d${sides}</span>
        <span class="dice-value"></span>
      `;
      dice.addEventListener('click', () => rollDice(dice, sides));
      diceContainer.appendChild(dice);
    }
  
    async function rollDice(diceElement, sides) {
      // Play sound if enabled
      if (state.soundEnabled) {
        rollSound.currentTime = 0;
        try {
          await rollSound.play();
        } catch (err) {
          console.warn('Audio playback prevented:', err);
        }
      }
  
      // Add rolling animation
      diceElement.classList.add('rolling');
      currentRollDisplay.classList.remove('result-display');
  
      // Generate random roll after animation delay
      setTimeout(() => {
        const roll = Math.floor(Math.random() * sides) + 1;
        
        // Update UI
        diceElement.classList.remove('rolling');
        diceElement.querySelector('.dice-value').textContent = roll;
        currentRollDisplay.textContent = roll;
        currentRollDisplay.classList.add('result-display');
        
        // Update state
        updateState(roll, sides);
        
        // Update displays
        updateStatisticsDisplay();
        updateHistoryDisplay(roll, sides);
        updateResultDisplay(roll, sides);
      }, 800); // Match this with CSS animation duration
    }
  
    function updateState(roll, sides) {
      // Update history
      state.rollHistory.push({
        value: roll,
        diceType: `d${sides}`,
        timestamp: new Date().toISOString()
      });
      
      // Update statistics
      state.statistics.totalRolls++;
      state.statistics.avgRoll = state.rollHistory.reduce((sum, roll) => sum + roll.value, 0) / state.rollHistory.length;
      state.statistics.maxRoll = Math.max(state.statistics.maxRoll, roll);
      state.statistics.minRoll = Math.min(state.statistics.minRoll, roll);
      state.statistics.diceCounts[`d${sides}`]++;
    }
  
    function updateStatisticsDisplay() {
      statsDiv.innerHTML = `
        <div class="stat-card">
          <h3>Total Rolls</h3>
          <p>${state.statistics.totalRolls}</p>
        </div>
        <div class="stat-card">
          <h3>Average</h3>
          <p>${state.statistics.avgRoll.toFixed(2)}</p>
        </div>
        <div class="stat-card">
          <h3>Highest</h3>
          <p>${state.statistics.maxRoll}</p>
        </div>
        <div class="stat-card">
          <h3>Lowest</h3>
          <p>${state.statistics.minRoll}</p>
        </div>
      `;
    }
  
    function updateResultDisplay(result, sides) {
      resultsDiv.innerHTML = `
        <p>You rolled a <strong>${result}</strong> on a d${sides}</p>
        <p>That's ${getRollDescription(result, sides)}</p>
      `;
    }
  
    function getRollDescription(result, sides) {
      const percentage = (result / sides) * 100;
      
      if (result === 1) return 'a critical failure!';
      if (result === sides) return 'a critical success!';
      if (percentage >= 80) return 'an excellent roll!';
      if (percentage >= 60) return 'a good roll!';
      if (percentage >= 40) return 'an average roll.';
      if (percentage >= 20) return 'a below average roll.';
      return 'a poor roll.';
    }
  
    function updateHistoryDisplay(result, sides) {
      const entry = document.createElement('div');
      entry.className = 'history-entry';
      entry.innerHTML = `
        <span class="history-dice">d${sides}</span>
        <span class="history-result">${result}</span>
        <span class="history-time">${new Date().toLocaleTimeString()}</span>
      `;
      historyDiv.insertBefore(entry, historyDiv.firstChild);
      
      // Limit history to 50 entries
      if (historyDiv.children.length > 50) {
        historyDiv.removeChild(historyDiv.lastChild);
      }
    }
  
    function loadHistory() {
      const savedHistory = localStorage.getItem('diceRollHistory');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          state.rollHistory = parsedHistory;
          
          // Recalculate statistics
          if (parsedHistory.length > 0) {
            state.statistics.totalRolls = parsedHistory.length;
            state.statistics.avgRoll = parsedHistory.reduce((sum, roll) => sum + roll.value, 0) / parsedHistory.length;
            state.statistics.maxRoll = Math.max(...parsedHistory.map(roll => roll.value));
            state.statistics.minRoll = Math.min(...parsedHistory.map(roll => roll.value));
            
            // Update dice counts
            parsedHistory.forEach(roll => {
              state.statistics.diceCounts[roll.diceType]++;
            });
          }
          
          // Update UI
          updateStatisticsDisplay();
          parsedHistory.slice().reverse().forEach(roll => {
            updateHistoryDisplay(roll.value, parseInt(roll.diceType.substring(1)));
          });
        } catch (e) {
          console.error('Failed to load history:', e);
        }
      }
    }
  
    function saveHistory() {
      localStorage.setItem('diceRollHistory', JSON.stringify(state.rollHistory));
    }
  
    function saveResults() {
      const data = {
        rolls: state.rollHistory,
        statistics: state.statistics,
        generatedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dice-rolls-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  
    async function shareResults() {
      const lastFiveRolls = state.rollHistory.slice(-5).reverse();
      const shareText = `My recent D&D dice rolls:
  ${lastFiveRolls.map(roll => `${roll.diceType}: ${roll.value}`).join('\n')}
  
  Average roll: ${state.statistics.avgRoll.toFixed(2)}
  Total rolls: ${state.statistics.totalRolls}`;
  
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'My D&D Dice Rolls',
            text: shareText,
            url: window.location.href
          });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          alert('Results copied to clipboard!');
        } else {
          throw new Error('Sharing not supported');
        }
      } catch (err) {
        console.error('Sharing failed:', err);
        // Fallback to download
        saveResults();
      }
    }
  
    function clearHistory() {
      if (confirm('Are you sure you want to clear your roll history?')) {
        state.rollHistory = [];
        state.statistics = {
          totalRolls: 0,
          avgRoll: 0,
          maxRoll: 0,
          minRoll: Infinity,
          diceCounts: {
            d4: 0,
            d6: 0,
            d8: 0,
            d10: 0,
            d12: 0,
            d20: 0
          }
        };
        historyDiv.innerHTML = '';
        updateStatisticsDisplay();
        localStorage.removeItem('diceRollHistory');
      }
    }
  
    function setTheme(theme) {
      state.currentTheme = theme;
      document.body.setAttribute('data-theme', theme);
      themeToggle.checked = theme === 'dark';
      localStorage.setItem('theme', theme);
    }
  });