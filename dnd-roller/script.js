document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const diceContainer = document.getElementById('dice-container');
    const currentRollDisplay = document.getElementById('current-roll');
    const resultsDiv = document.getElementById('results');
    const historyDiv = document.getElementById('history');
    const statsDiv = document.getElementById('statistics');
    const rollSound = document.getElementById('roll-sound');
    const critSuccessSound = document.getElementById('crit-success-sound');
    const critFailSound = document.getElementById('crit-fail-sound');
    const soundToggle = document.getElementById('sound-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const animationToggle = document.getElementById('animation-toggle');
    const autoSaveToggle = document.getElementById('auto-save-toggle');
    const soundVolume = document.getElementById('sound-volume');
    const saveResultsBtn = document.getElementById('save-results');
    const shareResultsBtn = document.getElementById('share-results');
    const clearHistoryBtn = document.getElementById('clear-history');
    const exportHistoryBtn = document.getElementById('export-history');
    const generateReportBtn = document.getElementById('generate-report');
    const quickRollBtn = document.getElementById('quick-roll-btn');
    const diceCount = document.getElementById('dice-count');
    const diceType = document.getElementById('dice-type');
    const modifier = document.getElementById('modifier');
    const historyDiceFilter = document.getElementById('history-dice-filter');
    const historySearch = document.getElementById('history-search');
    const toastContainer = document.getElementById('toast-container');
  
    // Character Sheet Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const abilityScoreInputs = document.querySelectorAll('.score-input input');
    const skillCheckboxes = document.querySelectorAll('.skill-header input');
    const quickActionButtons = document.querySelectorAll('.action-buttons .btn');
    const saveCharacterBtn = document.getElementById('save-character-btn');
    const loadCharacterBtn = document.getElementById('load-character-btn');
    const exportCharacterBtn = document.getElementById('export-character-btn');
  
    // State management
    const state = {
      rollHistory: [],
      statistics: {
        totalRolls: 0,
        avgRoll: 0,
        maxRoll: 0,
        minRoll: Infinity,
        critSuccesses: 0,
        critFailures: 0,
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
      soundEnabled: localStorage.getItem('sound') === 'true' || false,
      animationsEnabled: localStorage.getItem('animations') === 'true' || true,
      autoSaveEnabled: localStorage.getItem('autoSave') === 'true' || true,
      soundVolume: parseInt(localStorage.getItem('soundVolume')) || 50,
      character: {
        info: {
          name: '',
          class: '',
          level: 1,
          race: '',
          background: '',
          alignment: ''
        },
        abilityScores: {
          str: { score: 10, modifier: 0, saveProficient: false },
          dex: { score: 10, modifier: 0, saveProficient: false },
          con: { score: 10, modifier: 0, saveProficient: false },
          int: { score: 10, modifier: 0, saveProficient: false },
          wis: { score: 10, modifier: 0, saveProficient: false },
          cha: { score: 10, modifier: 0, saveProficient: false }
        },
        skills: {
          acrobatics: { proficient: false, modifier: 0 },
          animalHandling: { proficient: false, modifier: 0 },
          arcana: { proficient: false, modifier: 0 },
          athletics: { proficient: false, modifier: 0 },
          deception: { proficient: false, modifier: 0 },
          history: { proficient: false, modifier: 0 },
          insight: { proficient: false, modifier: 0 },
          intimidation: { proficient: false, modifier: 0 },
          investigation: { proficient: false, modifier: 0 },
          medicine: { proficient: false, modifier: 0 },
          nature: { proficient: false, modifier: 0 },
          perception: { proficient: false, modifier: 0 },
          performance: { proficient: false, modifier: 0 },
          persuasion: { proficient: false, modifier: 0 },
          religion: { proficient: false, modifier: 0 },
          sleightOfHand: { proficient: false, modifier: 0 },
          stealth: { proficient: false, modifier: 0 },
          survival: { proficient: false, modifier: 0 }
        }
      }
    };
  
    // Initialize
    init();
  
    function init() {
      // Set initial preferences
      setTheme(state.currentTheme);
      soundToggle.checked = state.soundEnabled;
      animationToggle.checked = state.animationsEnabled;
      autoSaveToggle.checked = state.autoSaveEnabled;
      soundVolume.value = state.soundVolume;
      
      // Create dice
      [4, 6, 8, 10, 12, 20].forEach(createDice);
      
      // Load any saved history
      loadHistory();
      
      // Setup event listeners
      setupEventListeners();
      
      // Initialize distribution chart
      updateDistributionChart();
      
      // Show welcome toast
      showToast('Welcome to D&D Dice Roller!', 'success');
      
      // Load character data if exists
      loadCharacter();
      
      // Setup character sheet event listeners
      setupCharacterSheetListeners();
    }
  
    function setupEventListeners() {
      // Quick roll functionality
      quickRollBtn.addEventListener('click', () => {
        const count = parseInt(diceCount.value);
        const type = parseInt(diceType.value);
        const mod = parseInt(modifier.value) || 0;
        
        if (count > 0 && count <= 100) {
          rollMultipleDice(count, type, mod);
        } else {
          showToast('Please enter a valid number of dice (1-100)', 'error');
        }
      });
      
      // History filters
      historyDiceFilter.addEventListener('change', filterHistory);
      historySearch.addEventListener('input', filterHistory);
      
      // Sound and theme preferences
      soundToggle.addEventListener('change', (e) => {
        state.soundEnabled = e.target.checked;
        localStorage.setItem('sound', state.soundEnabled);
      });
      
      soundVolume.addEventListener('input', (e) => {
        state.soundVolume = parseInt(e.target.value);
        localStorage.setItem('soundVolume', state.soundVolume);
        updateSoundVolume();
      });
      
      themeToggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        setTheme(theme);
        localStorage.setItem('theme', theme);
      });
      
      animationToggle.addEventListener('change', (e) => {
        state.animationsEnabled = e.target.checked;
        localStorage.setItem('animations', state.animationsEnabled);
      });
      
      autoSaveToggle.addEventListener('change', (e) => {
        state.autoSaveEnabled = e.target.checked;
        localStorage.setItem('autoSave', state.autoSaveEnabled);
      });
      
      // Button actions
      saveResultsBtn.addEventListener('click', saveResults);
      shareResultsBtn.addEventListener('click', shareResults);
      clearHistoryBtn.addEventListener('click', clearHistory);
      exportHistoryBtn.addEventListener('click', exportHistory);
      generateReportBtn.addEventListener('click', generateReport);
    }
  
    function setupCharacterSheetListeners() {
      // Tab switching
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const tab = button.dataset.tab;
          switchTab(tab);
        });
      });
      
      // Ability score changes
      abilityScoreInputs.forEach(input => {
        input.addEventListener('change', () => {
          const ability = input.id.replace('-score', '');
          updateAbilityScore(ability, parseInt(input.value));
        });
      });
      
      // Skill proficiency changes
      skillCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const skill = checkbox.id;
          updateSkillProficiency(skill, checkbox.checked);
        });
      });
      
      // Quick action buttons
      quickActionButtons.forEach(button => {
        button.addEventListener('click', () => {
          const action = button.dataset.action;
          handleQuickAction(action);
        });
      });
      
      // Character save/load
      saveCharacterBtn.addEventListener('click', saveCharacter);
      loadCharacterBtn.addEventListener('click', loadCharacter);
      exportCharacterBtn.addEventListener('click', exportCharacter);
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
      if (state.soundEnabled) {
        playRollSound();
      }
  
      if (state.animationsEnabled) {
        diceElement.classList.add('rolling');
        currentRollDisplay.classList.remove('result-display');
      }
  
      const roll = Math.floor(Math.random() * sides) + 1;
      
      if (state.animationsEnabled) {
        await new Promise(resolve => setTimeout(resolve, 800));
        diceElement.classList.remove('rolling');
      }
      
      diceElement.querySelector('.dice-value').textContent = roll;
      currentRollDisplay.textContent = roll;
      currentRollDisplay.classList.add('result-display');
      
      updateState(roll, sides);
      updateStatisticsDisplay();
      updateHistoryDisplay(roll, sides);
      updateResultDisplay(roll, sides);
      
      if (state.autoSaveEnabled) {
        saveHistory();
      }
    }
  
    async function rollMultipleDice(count, sides, modifier = 0) {
      const rolls = [];
      let total = 0;
      
      for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
      }
      
      total += modifier;
      
      // Update UI
      updateRollBreakdown(rolls, modifier);
      updateRollTotal(total);
      
      // Update state
      rolls.forEach(roll => {
        updateState(roll, sides);
      });
      
      updateStatisticsDisplay();
      updateHistoryDisplay(rolls, sides, modifier);
      updateResultDisplay(rolls, sides, modifier);
      
      if (state.autoSaveEnabled) {
        saveHistory();
      }
      
      // Play appropriate sound
      if (state.soundEnabled) {
        if (rolls.some(roll => roll === sides)) {
          playSound(critSuccessSound);
        } else if (rolls.some(roll => roll === 1)) {
          playSound(critFailSound);
        } else {
          playRollSound();
        }
      }
    }
  
    function updateRollBreakdown(rolls, modifier = 0) {
      const breakdown = document.querySelector('.roll-breakdown');
      breakdown.innerHTML = rolls.map(roll => 
        `<span class="roll-value">${roll}</span>`
      ).join(' + ');
      
      if (modifier !== 0) {
        breakdown.innerHTML += ` ${modifier > 0 ? '+' : ''} ${modifier}`;
      }
    }
  
    function updateRollTotal(total) {
      const totalElement = document.querySelector('.roll-total');
      totalElement.textContent = `Total: ${total}`;
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
      
      // Update critical successes and failures
      if (roll === sides) {
        state.statistics.critSuccesses++;
      } else if (roll === 1) {
        state.statistics.critFailures++;
      }
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
        <div class="stat-card">
          <h3>Critical Successes</h3>
          <p>${state.statistics.critSuccesses}</p>
        </div>
        <div class="stat-card">
          <h3>Critical Failures</h3>
          <p>${state.statistics.critFailures}</p>
        </div>
      `;
      
      updateDistributionChart();
    }
  
    function updateDistributionChart() {
      const chart = document.querySelector('.distribution-chart');
      const maxCount = Math.max(...Object.values(state.statistics.diceCounts));
      
      chart.innerHTML = Object.entries(state.statistics.diceCounts)
        .map(([dice, count]) => `
          <div class="distribution-bar" 
               style="height: ${(count / maxCount) * 100}%"
               data-value="${count}">
            <div class="distribution-label">${dice}</div>
          </div>
        `).join('');
    }
  
    function updateResultDisplay(result, sides, modifier = 0) {
      const isArray = Array.isArray(result);
      const rolls = isArray ? result : [result];
      const total = isArray ? rolls.reduce((sum, roll) => sum + roll, 0) + modifier : result;
      
      resultsDiv.innerHTML = `
        <p>You rolled ${rolls.length > 1 ? rolls.join(' + ') : rolls[0]} on ${rolls.length > 1 ? `${rolls.length}d${sides}` : `d${sides}`}</p>
        ${modifier !== 0 ? `<p>Modifier: ${modifier > 0 ? '+' : ''}${modifier}</p>` : ''}
        <p>Total: <strong>${total}</strong></p>
        <p>${getRollDescription(total, sides)}</p>
      `;
    }
  
    function getRollDescription(result, sides) {
      const percentage = (result / sides) * 100;
      
      if (result === 1) return 'Critical failure!';
      if (result === sides) return 'Critical success!';
      if (percentage >= 80) return 'Excellent roll!';
      if (percentage >= 60) return 'Good roll!';
      if (percentage >= 40) return 'Average roll.';
      if (percentage >= 20) return 'Below average roll.';
      return 'Poor roll.';
    }
  
    function updateHistoryDisplay(result, sides, modifier = 0) {
      const isArray = Array.isArray(result);
      const rolls = isArray ? result : [result];
      const total = isArray ? rolls.reduce((sum, roll) => sum + roll, 0) + modifier : result;
      
      const entry = document.createElement('div');
      entry.className = 'history-entry';
      entry.innerHTML = `
        <span class="history-dice">${rolls.length > 1 ? `${rolls.length}d${sides}` : `d${sides}`}</span>
        <span class="history-result">${rolls.join(' + ')}${modifier !== 0 ? ` ${modifier > 0 ? '+' : ''}${modifier}` : ''}</span>
        <span class="history-total">${total}</span>
        <span class="history-time">${new Date().toLocaleTimeString()}</span>
      `;
      
      historyDiv.insertBefore(entry, historyDiv.firstChild);
      
      // Limit history to 50 entries
      if (historyDiv.children.length > 50) {
        historyDiv.removeChild(historyDiv.lastChild);
      }
    }
  
    function filterHistory() {
      const diceFilter = historyDiceFilter.value;
      const searchTerm = historySearch.value.toLowerCase();
      
      Array.from(historyDiv.children).forEach(entry => {
        const dice = entry.querySelector('.history-dice').textContent;
        const result = entry.querySelector('.history-result').textContent;
        const matchesDice = diceFilter === 'all' || dice.includes(diceFilter);
        const matchesSearch = result.toLowerCase().includes(searchTerm);
        
        entry.style.display = matchesDice && matchesSearch ? 'flex' : 'none';
      });
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
            
            // Update dice counts and criticals
            parsedHistory.forEach(roll => {
              state.statistics.diceCounts[roll.diceType]++;
              if (roll.value === parseInt(roll.diceType.substring(1))) {
                state.statistics.critSuccesses++;
              } else if (roll.value === 1) {
                state.statistics.critFailures++;
              }
            });
          }
          
          // Update UI
          updateStatisticsDisplay();
          parsedHistory.slice().reverse().forEach(roll => {
            updateHistoryDisplay(roll.value, parseInt(roll.diceType.substring(1)));
          });
        } catch (e) {
          console.error('Failed to load history:', e);
          showToast('Failed to load roll history', 'error');
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
      
      showToast('Results saved successfully!', 'success');
    }
  
    function exportHistory() {
      const data = {
        history: state.rollHistory,
        statistics: state.statistics,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dice-roll-history-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('History exported successfully!', 'success');
    }
  
    function generateReport() {
      const report = generateRollReport();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dice-roll-report-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Report generated successfully!', 'success');
    }
  
    function generateRollReport() {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      
      return `D&D Dice Roll Report
Generated on ${date} at ${time}

Total Rolls: ${state.statistics.totalRolls}
Average Roll: ${state.statistics.avgRoll.toFixed(2)}
Highest Roll: ${state.statistics.maxRoll}
Lowest Roll: ${state.statistics.minRoll}
Critical Successes: ${state.statistics.critSuccesses}
Critical Failures: ${state.statistics.critFailures}

Dice Distribution:
${Object.entries(state.statistics.diceCounts)
  .map(([dice, count]) => `${dice}: ${count} rolls`)
  .join('\n')}

Recent Rolls:
${state.rollHistory.slice(-10).reverse()
  .map(roll => `${new Date(roll.timestamp).toLocaleString()} - ${roll.diceType}: ${roll.value}`)
  .join('\n')}`;
    }
  
    async function shareResults() {
      const lastFiveRolls = state.rollHistory.slice(-5).reverse();
      const shareText = `My recent D&D dice rolls:
${lastFiveRolls.map(roll => `${roll.diceType}: ${roll.value}`).join('\n')}

Average roll: ${state.statistics.avgRoll.toFixed(2)}
Total rolls: ${state.statistics.totalRolls}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'D&D Dice Rolls',
            text: shareText
          });
          showToast('Results shared successfully!', 'success');
        } catch (err) {
          console.error('Error sharing:', err);
          showToast('Failed to share results', 'error');
        }
      } else {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(shareText);
          showToast('Results copied to clipboard!', 'success');
        } catch (err) {
          console.error('Error copying to clipboard:', err);
          showToast('Failed to copy results', 'error');
        }
      }
    }
  
    function clearHistory() {
      if (confirm('Are you sure you want to clear all roll history?')) {
        state.rollHistory = [];
        state.statistics = {
          totalRolls: 0,
          avgRoll: 0,
          maxRoll: 0,
          minRoll: Infinity,
          critSuccesses: 0,
          critFailures: 0,
          diceCounts: {
            d4: 0,
            d6: 0,
            d8: 0,
            d10: 0,
            d12: 0,
            d20: 0
          }
        };
        
        updateStatisticsDisplay();
        historyDiv.innerHTML = '';
        showToast('History cleared successfully!', 'success');
      }
    }
  
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      state.currentTheme = theme;
    }
  
    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      `;
      
      toastContainer.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  
    function playRollSound() {
      playSound(rollSound);
    }
  
    function playSound(audioElement) {
      audioElement.volume = state.soundVolume / 100;
      audioElement.currentTime = 0;
      audioElement.play().catch(err => console.warn('Audio playback prevented:', err));
    }
  
    function updateSoundVolume() {
      rollSound.volume = state.soundVolume / 100;
      critSuccessSound.volume = state.soundVolume / 100;
      critFailSound.volume = state.soundVolume / 100;
    }
  
    function switchTab(tabId) {
      tabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabId);
      });
      
      tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
      });
    }
  
    function updateAbilityScore(ability, score) {
      if (score < 3) score = 3;
      if (score > 20) score = 20;
      
      const modifier = Math.floor((score - 10) / 2);
      state.character.abilityScores[ability].score = score;
      state.character.abilityScores[ability].modifier = modifier;
      
      // Update modifier display
      document.getElementById(`${ability}-mod`).textContent = 
        modifier >= 0 ? `+${modifier}` : modifier.toString();
      
      // Update related skills
      updateSkillModifiers();
    }
  
    function updateSkillProficiency(skill, proficient) {
      state.character.skills[skill].proficient = proficient;
      updateSkillModifiers();
    }
  
    function updateSkillModifiers() {
      const proficiencyBonus = Math.floor((state.character.info.level - 1) / 4) + 2;
      
      Object.entries(state.character.skills).forEach(([skill, data]) => {
        const ability = getSkillAbility(skill);
        const abilityMod = state.character.abilityScores[ability].modifier;
        const modifier = data.proficient ? abilityMod + proficiencyBonus : abilityMod;
        
        data.modifier = modifier;
        document.getElementById(`${skill}-mod`).textContent = 
          modifier >= 0 ? `+${modifier}` : modifier.toString();
      });
    }
  
    function getSkillAbility(skill) {
      const skillAbilities = {
        acrobatics: 'dex',
        animalHandling: 'wis',
        arcana: 'int',
        athletics: 'str',
        deception: 'cha',
        history: 'int',
        insight: 'wis',
        intimidation: 'cha',
        investigation: 'int',
        medicine: 'wis',
        nature: 'int',
        perception: 'wis',
        performance: 'cha',
        persuasion: 'cha',
        religion: 'int',
        sleightOfHand: 'dex',
        stealth: 'dex',
        survival: 'wis'
      };
      return skillAbilities[skill];
    }
  
    function handleQuickAction(action) {
      const [ability, type] = action.split('-');
      let modifier = state.character.abilityScores[ability].modifier;
      
      if (type === 'save' && state.character.abilityScores[ability].saveProficient) {
        const proficiencyBonus = Math.floor((state.character.info.level - 1) / 4) + 2;
        modifier += proficiencyBonus;
      }
      
      // Roll d20 with modifier
      rollMultipleDice(1, 20, modifier);
    }
  
    function saveCharacter() {
      localStorage.setItem('dndCharacter', JSON.stringify(state.character));
      showToast('Character saved successfully!', 'success');
    }
  
    function loadCharacter() {
      const savedCharacter = localStorage.getItem('dndCharacter');
      if (savedCharacter) {
        try {
          state.character = JSON.parse(savedCharacter);
          updateCharacterUI();
          showToast('Character loaded successfully!', 'success');
        } catch (e) {
          console.error('Failed to load character:', e);
          showToast('Failed to load character', 'error');
        }
      }
    }
  
    function updateCharacterUI() {
      // Update character info
      Object.entries(state.character.info).forEach(([key, value]) => {
        const element = document.getElementById(`char-${key}`);
        if (element) element.value = value;
      });
      
      // Update ability scores
      Object.entries(state.character.abilityScores).forEach(([ability, data]) => {
        document.getElementById(`${ability}-score`).value = data.score;
        document.getElementById(`${ability}-mod`).textContent = 
          data.modifier >= 0 ? `+${data.modifier}` : data.modifier.toString();
        document.getElementById(`${ability}-save`).checked = data.saveProficient;
      });
      
      // Update skills
      Object.entries(state.character.skills).forEach(([skill, data]) => {
        document.getElementById(skill).checked = data.proficient;
        document.getElementById(`${skill}-mod`).textContent = 
          data.modifier >= 0 ? `+${data.modifier}` : data.modifier.toString();
      });
    }
  
    function exportCharacter() {
      const data = {
        character: state.character,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dnd-character-${state.character.info.name || 'unnamed'}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Character exported successfully!', 'success');
    }
});