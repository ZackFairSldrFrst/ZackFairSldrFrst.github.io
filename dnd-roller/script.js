// Enhanced D&D Assistant with AI capabilities
document.addEventListener('DOMContentLoaded', () => {
    // API Configuration
    const DEEPSEEK_API_KEY = 'sk-10c5d42111244584b04ebd92e3104bfc';
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
    
    // DOM Elements - Original
    const diceContainer = document.getElementById('dice-container');
    const currentRollDisplay = document.getElementById('current-roll');
    const resultsDiv = document.getElementById('results');
    const historyDiv = document.getElementById('history');
    const statsDiv = document.getElementById('statistics');
    const soundToggle = document.getElementById('sound-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const animationToggle = document.getElementById('animation-toggle');
    const autoSaveToggle = document.getElementById('auto-save-toggle');
    const soundVolume = document.getElementById('sound-volume');
    const quickRollBtn = document.getElementById('quick-roll-btn');
    const diceCount = document.getElementById('dice-count');
    const diceType = document.getElementById('dice-type');
    const modifier = document.getElementById('modifier');
    const historyDiceFilter = document.getElementById('history-dice-filter');
    const historySearch = document.getElementById('history-search');
    
    // DOM Elements - AI Features
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // AI DM Chat
    const dmChatMessages = document.getElementById('dm-chat-messages');
    const dmChatInput = document.getElementById('dm-chat-input');
    const dmSendBtn = document.getElementById('dm-send-btn');
    const contextTags = document.querySelectorAll('.context-tag');
    
    // Character Generator
    const generateCharacterBtn = document.getElementById('generate-character-btn');
    const generateBackstoryBtn = document.getElementById('generate-backstory-btn');
    const rollStatsBtn = document.getElementById('roll-stats-btn');
    const generatedCharContent = document.getElementById('generated-char-content');
    
    // Story Generator
    const generateStoryBtn = document.getElementById('generate-story-btn');
    const generateNamesBtn = document.getElementById('generate-names-btn');
    const generateLootBtn = document.getElementById('generate-loot-btn');
    const generatedStoryContent = document.getElementById('generated-story-content');
    
    // Rule Assistant
    const ruleButtons = document.querySelectorAll('.rule-btn');
    const askRuleBtn = document.getElementById('ask-rule-btn');
    const ruleQuestion = document.getElementById('rule-question');
    const ruleAnswer = document.getElementById('rule-answer');
    
    // Combat Tracker
    const startCombatBtn = document.getElementById('start-combat-btn');
    const nextTurnBtn = document.getElementById('next-turn-btn');
    const endCombatBtn = document.getElementById('end-combat-btn');
    const addCombatantBtn = document.getElementById('add-combatant-btn');
    const generateEnemyBtn = document.getElementById('generate-enemy-btn');
    const combatantsList = document.getElementById('combatants-list');
    const currentRoundSpan = document.getElementById('current-round');
    const combatActionButtons = document.querySelectorAll('.action-btn');
    
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
            diceCounts: { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 }
        },
        currentTheme: localStorage.getItem('theme') || 'light',
        soundEnabled: localStorage.getItem('sound') === 'true' || false,
        animationsEnabled: localStorage.getItem('animations') === 'true' || true,
        autoSaveEnabled: localStorage.getItem('autoSave') === 'true' || true,
        soundVolume: parseInt(localStorage.getItem('soundVolume')) || 50,
        
        // AI Chat state
        chatHistory: [],
        currentContext: null,
        
        // Combat state
        combatants: [],
        currentTurn: 0,
        currentRound: 0,
        combatActive: false,
        
        // Character state
        character: {
            info: { name: '', class: '', level: 1, race: '', background: '', alignment: '' },
            abilityScores: {
                str: { score: 10, modifier: 0, saveProficient: false },
                dex: { score: 10, modifier: 0, saveProficient: false },
                con: { score: 10, modifier: 0, saveProficient: false },
                int: { score: 10, modifier: 0, saveProficient: false },
                wis: { score: 10, modifier: 0, saveProficient: false },
                cha: { score: 10, modifier: 0, saveProficient: false }
            }
        }
    };

    // Initialize
    init();

    function init() {
        setTheme(state.currentTheme);
        if (soundToggle) soundToggle.checked = state.soundEnabled;
        if (animationToggle) animationToggle.checked = state.animationsEnabled;
        if (autoSaveToggle) autoSaveToggle.checked = state.autoSaveEnabled;
        if (soundVolume) soundVolume.value = state.soundVolume;
        
        [4, 6, 8, 10, 12, 20].forEach(createDice);
        loadHistory();
        setupEventListeners();
        setupAIEventListeners();
        updateDistributionChart();
        showToast('Welcome to your AI-powered D&D Assistant!', 'success');
    }

    // AI API Functions
    async function callDeepSeekAPI(messages, temperature = 0.7) {
        try {
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: messages,
                    temperature: temperature,
                    max_tokens: 2000,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek API Error:', error);
            throw new Error('Failed to get AI response. Please try again.');
        }
    }

    // AI DM Chat Functions
    async function sendDMMessage() {
        const message = dmChatInput.value.trim();
        if (!message) return;

        addChatMessage('user', message);
        dmChatInput.value = '';
        
        const loadingMsg = addChatMessage('ai', '', true);
        
        try {
            const context = state.currentContext || 'general';
            const systemPrompt = getDMSystemPrompt(context);
            
            const messages = [
                { role: 'system', content: systemPrompt },
                ...state.chatHistory.slice(-10), // Keep last 10 messages for context
                { role: 'user', content: message }
            ];

            const response = await callDeepSeekAPI(messages);
            
            loadingMsg.remove();
            addChatMessage('ai', response);
            
            state.chatHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: response }
            );
        } catch (error) {
            loadingMsg.remove();
            addChatMessage('ai', `Sorry, I encountered an error: ${error.message}`);
        }
    }

    function getDMSystemPrompt(context) {
        const basePrompt = `You are an expert Dungeon Master assistant for D&D 5e. You are helpful, creative, and knowledgeable about all aspects of D&D including rules, lore, character creation, storytelling, and campaign management.`;
        
        const contextPrompts = {
            rules: `${basePrompt} Focus on providing clear, accurate D&D 5e rules explanations with page references when possible.`,
            npc: `${basePrompt} Focus on creating memorable, detailed NPCs with personalities, motivations, and interesting quirks.`,
            encounter: `${basePrompt} Focus on creating balanced, engaging encounters appropriate for the party level.`,
            story: `${basePrompt} Focus on creative storytelling, plot hooks, and narrative elements that will engage players.`,
            roll: `${basePrompt} Focus on interpreting dice rolls in context and suggesting narrative outcomes.`
        };
        
        return contextPrompts[context] || basePrompt;
    }

    function addChatMessage(sender, content, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}${isLoading ? ' loading' : ''}`;
        
        if (!isLoading) {
            messageDiv.textContent = content;
        }
        
        dmChatMessages.appendChild(messageDiv);
        dmChatMessages.scrollTop = dmChatMessages.scrollHeight;
        return messageDiv;
    }

    // Character Generator Functions
    async function generateCharacter() {
        const genClass = document.getElementById('gen-class').value;
        const genRace = document.getElementById('gen-race').value;
        const genLevel = document.getElementById('gen-level').value;
        const genTheme = document.getElementById('gen-theme').value;

        showLoading(generatedCharContent);

        try {
            const prompt = `Create a detailed D&D 5e character with the following preferences:
            - Class: ${genClass || 'any appropriate class'}
            - Race: ${genRace || 'any appropriate race'}
            - Level: ${genLevel}
            - Theme: ${genTheme || 'balanced adventurer'}
            
            Please provide:
            1. Basic character info (name, race, class, background, alignment)
            2. Brief personality description
            3. Key motivations and goals
            4. Notable equipment or abilities
            5. A short backstory hook
            
            Format this as a ready-to-play character description.`;

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
            displayGeneratedContent(generatedCharContent, response, 'generated-character');
        } catch (error) {
            displayError(generatedCharContent, error.message);
        }
    }

    async function generateBackstory() {
        showLoading(generatedCharContent);

        try {
            const prompt = `Create an interesting and detailed backstory for a D&D character. Include:
            1. Family background and upbringing
            2. A defining moment that shaped them
            3. Why they became an adventurer
            4. Personal relationships and connections
            5. A secret or mystery from their past
            6. Goals and aspirations
            
            Make it engaging and give the DM hooks to work with.`;

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
            displayGeneratedContent(generatedCharContent, response, 'generated-character');
        } catch (error) {
            displayError(generatedCharContent, error.message);
        }
    }

    // Story Generator Functions
    async function generateStory() {
        const storyType = document.getElementById('story-type').value;
        const storySetting = document.getElementById('story-setting').value;
        const storyTone = document.getElementById('story-tone').value;
        const partyLevel = document.getElementById('party-level').value;
        const customPrompt = document.getElementById('custom-prompt').value;

        showLoading(generatedStoryContent);

        try {
            let prompt = `Create a ${storyType} for a D&D campaign with these specifications:
            - Setting: ${storySetting || 'fantasy'}
            - Tone: ${storyTone || 'balanced'}
            - Party Level: ${partyLevel}
            ${customPrompt ? `- Additional requirements: ${customPrompt}` : ''}
            
            `;

            switch (storyType) {
                case 'adventure':
                    prompt += 'Provide a complete adventure hook with plot, key NPCs, locations, and potential outcomes.';
                    break;
                case 'npc':
                    prompt += 'Create 3-5 detailed NPCs with names, appearances, personalities, motivations, and plot hooks.';
                    break;
                case 'location':
                    prompt += 'Describe an interesting location with history, notable features, inhabitants, and adventure possibilities.';
                    break;
                case 'encounter':
                    prompt += 'Design a balanced combat encounter with enemies, tactics, terrain, and environmental factors.';
                    break;
                case 'quest':
                    prompt += 'Create a multi-part quest with objectives, challenges, rewards, and potential complications.';
                    break;
                case 'mystery':
                    prompt += 'Design a mystery with clues, red herrings, suspects, and a satisfying resolution.';
                    break;
                case 'dungeon':
                    prompt += 'Describe an interesting dungeon room with layout, traps, treasures, and inhabitants.';
                    break;
            }

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
            displayGeneratedContent(generatedStoryContent, response, 'generated-story');
            
            document.getElementById('save-story-btn').style.display = 'inline-block';
            document.getElementById('regenerate-btn').style.display = 'inline-block';
        } catch (error) {
            displayError(generatedStoryContent, error.message);
        }
    }

    // Rule Assistant Functions
    async function askRule(question) {
        showLoading(ruleAnswer);

        try {
            const prompt = `As a D&D 5e expert, please explain the following rule or mechanic clearly and accurately: ${question}
            
            Please provide:
            1. The official rule explanation
            2. How it works in practice
            3. Common misconceptions or edge cases
            4. Examples if helpful
            
            Be precise and reference official sources when possible.`;

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }], 0.3);
            displayGeneratedContent(ruleAnswer, response, 'rule-explanation');
        } catch (error) {
            displayError(ruleAnswer, error.message);
        }
    }

    // Combat Tracker Functions
    function startCombat() {
        if (state.combatants.length < 2) {
            showToast('Add at least 2 combatants to start combat', 'warning');
            return;
        }

        state.combatants.sort((a, b) => b.initiative - a.initiative);
        state.combatActive = true;
        state.currentRound = 1;
        state.currentTurn = 0;

        updateCombatUI();
        updateCombatantsList();
        showToast('Combat started!', 'success');
    }

    function nextTurn() {
        state.currentTurn++;
        if (state.currentTurn >= state.combatants.length) {
            state.currentTurn = 0;
            state.currentRound++;
        }
        updateCombatUI();
        updateCombatantsList();
    }

    function endCombat() {
        state.combatActive = false;
        state.currentRound = 0;
        state.currentTurn = 0;
        updateCombatUI();
        updateCombatantsList();
        showToast('Combat ended!', 'success');
    }

    function addCombatant() {
        const name = document.getElementById('combatant-name').value;
        const initiative = parseInt(document.getElementById('combatant-initiative').value);
        const hp = parseInt(document.getElementById('combatant-hp').value);
        const ac = parseInt(document.getElementById('combatant-ac').value);
        const type = document.getElementById('combatant-type').value;

        if (!name || !initiative || !hp || !ac) {
            showToast('Please fill in all combatant fields', 'warning');
            return;
        }

        const combatant = {
            id: Date.now(),
            name,
            initiative,
            maxHp: hp,
            currentHp: hp,
            ac,
            type,
            conditions: []
        };

        state.combatants.push(combatant);
        updateCombatantsList();
        
        // Clear form
        document.getElementById('combatant-name').value = '';
        document.getElementById('combatant-initiative').value = '';
        document.getElementById('combatant-hp').value = '';
        document.getElementById('combatant-ac').value = '';
        
        showToast(`${name} added to combat!`, 'success');
    }

    async function generateEnemy() {
        try {
            const partyLevel = document.getElementById('party-level')?.value || 1;
            const prompt = `Create a D&D 5e enemy appropriate for a level ${partyLevel} party. Provide:
            1. Name and creature type
            2. AC, HP, and key stats
            3. Initiative modifier
            4. Brief description of abilities
            5. Suggested tactics
            
            Format it as a stat block summary.`;

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
            
            // Try to parse some basic stats from the response
            const hpMatch = response.match(/HP[:\s]*(\d+)/i);
            const acMatch = response.match(/AC[:\s]*(\d+)/i);
            const nameMatch = response.match(/Name[:\s]*([^\n\r]+)/i);
            
            if (hpMatch && acMatch) {
                document.getElementById('combatant-name').value = nameMatch ? nameMatch[1].trim() : 'Generated Enemy';
                document.getElementById('combatant-hp').value = hpMatch[1];
                document.getElementById('combatant-ac').value = acMatch[1];
                document.getElementById('combatant-initiative').value = Math.floor(Math.random() * 20) + 1;
                document.getElementById('combatant-type').value = 'enemy';
            }
            
            showToast('Enemy generated! Check the form and add to combat.', 'success');
            
            // Show the full enemy description
            const enemyDiv = document.createElement('div');
            enemyDiv.className = 'generated-enemy-info';
            enemyDiv.innerHTML = `<h4>Generated Enemy Details:</h4><pre>${response}</pre>`;
            enemyDiv.style.cssText = 'margin-top: 1rem; padding: 1rem; background: var(--background); border-radius: var(--radius-md); font-size: 0.9rem;';
            
            const form = document.querySelector('.combatant-form');
            const existing = form.querySelector('.generated-enemy-info');
            if (existing) existing.remove();
            form.appendChild(enemyDiv);
            
        } catch (error) {
            showToast(`Error generating enemy: ${error.message}`, 'error');
        }
    }

    // Utility Functions
    function showLoading(element) {
        element.innerHTML = '<div class="loading-spinner">Generating with AI...</div>';
    }

    function displayGeneratedContent(element, content, className) {
        element.innerHTML = `<div class="${className}">${content.replace(/\n/g, '<br>')}</div>`;
    }

    function displayError(element, message) {
        element.innerHTML = `<div class="error-message">Error: ${message}</div>`;
    }

    function updateCombatUI() {
        if (currentRoundSpan) currentRoundSpan.textContent = state.currentRound;
        
        if (startCombatBtn) startCombatBtn.disabled = state.combatActive;
        if (nextTurnBtn) nextTurnBtn.disabled = !state.combatActive;
        if (endCombatBtn) endCombatBtn.disabled = !state.combatActive;
    }

    function updateCombatantsList() {
        if (!combatantsList) return;
        
        if (state.combatants.length === 0) {
            combatantsList.innerHTML = '<p class="placeholder-text">Add combatants to begin tracking initiative!</p>';
            return;
        }

        combatantsList.innerHTML = state.combatants.map((combatant, index) => {
            const isActive = state.combatActive && index === state.currentTurn;
            return `
                <div class="combatant-item ${isActive ? 'active' : ''}">
                    <div class="combatant-info">
                        <div class="combatant-name">${combatant.name}</div>
                        <div class="combatant-stats">
                            <span>Init: ${combatant.initiative}</span>
                            <span>HP: ${combatant.currentHp}/${combatant.maxHp}</span>
                            <span>AC: ${combatant.ac}</span>
                            <span>Type: ${combatant.type}</span>
                        </div>
                    </div>
                    <div class="combatant-actions">
                        <button onclick="damageCombatant(${combatant.id})">Damage</button>
                        <button onclick="healCombatant(${combatant.id})">Heal</button>
                        <button onclick="removeCombatant(${combatant.id})">Remove</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Make combat functions global for onclick handlers
    window.damageCombatant = function(id) {
        const damage = prompt('Enter damage amount:');
        if (damage && !isNaN(damage)) {
            const combatant = state.combatants.find(c => c.id === id);
            if (combatant) {
                combatant.currentHp = Math.max(0, combatant.currentHp - parseInt(damage));
                updateCombatantsList();
                showToast(`${combatant.name} takes ${damage} damage`, 'warning');
            }
        }
    };

    window.healCombatant = function(id) {
        const healing = prompt('Enter healing amount:');
        if (healing && !isNaN(healing)) {
            const combatant = state.combatants.find(c => c.id === id);
            if (combatant) {
                combatant.currentHp = Math.min(combatant.maxHp, combatant.currentHp + parseInt(healing));
                updateCombatantsList();
                showToast(`${combatant.name} heals ${healing} HP`, 'success');
            }
        }
    };

    window.removeCombatant = function(id) {
        state.combatants = state.combatants.filter(c => c.id !== id);
        updateCombatantsList();
        showToast('Combatant removed', 'success');
    };

    // Event Listeners Setup
    function setupAIEventListeners() {
        // Tab navigation
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                switchTab(tab);
            });
        });

        // AI DM Chat
        if (dmSendBtn) dmSendBtn.addEventListener('click', sendDMMessage);
        if (dmChatInput) {
            dmChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendDMMessage();
                }
            });
        }

        // Context tags
        contextTags.forEach(tag => {
            tag.addEventListener('click', () => {
                contextTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                state.currentContext = tag.dataset.context;
            });
        });

        // Character Generator
        if (generateCharacterBtn) generateCharacterBtn.addEventListener('click', generateCharacter);
        if (generateBackstoryBtn) generateBackstoryBtn.addEventListener('click', generateBackstory);
        if (rollStatsBtn) rollStatsBtn.addEventListener('click', rollStats);

        // Story Generator
        if (generateStoryBtn) generateStoryBtn.addEventListener('click', generateStory);
        if (generateNamesBtn) generateNamesBtn.addEventListener('click', generateNames);
        if (generateLootBtn) generateLootBtn.addEventListener('click', generateLoot);

        // Rule Assistant
        ruleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const rule = btn.dataset.rule;
                askRule(getQuickRuleQuestion(rule));
            });
        });
        
        if (askRuleBtn) askRuleBtn.addEventListener('click', () => {
            const question = ruleQuestion.value.trim();
            if (question) askRule(question);
        });

        // Combat Tracker
        if (startCombatBtn) startCombatBtn.addEventListener('click', startCombat);
        if (nextTurnBtn) nextTurnBtn.addEventListener('click', nextTurn);
        if (endCombatBtn) endCombatBtn.addEventListener('click', endCombat);
        if (addCombatantBtn) addCombatantBtn.addEventListener('click', addCombatant);
        if (generateEnemyBtn) generateEnemyBtn.addEventListener('click', generateEnemy);

        // Combat Actions
        combatActionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                handleCombatAction(action);
            });
        });
    }

    function switchTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    function getQuickRuleQuestion(rule) {
        const questions = {
            combat: 'Explain the basic combat sequence and actions in D&D 5e',
            spellcasting: 'How does spellcasting work in D&D 5e?',
            conditions: 'List and explain the conditions in D&D 5e',
            advantage: 'How do advantage and disadvantage work?',
            grappling: 'Explain the grappling rules',
            stealth: 'How do stealth and hiding work?',
            'death-saves': 'Explain death saving throws',
            multiattack: 'How does multiattack work?'
        };
        return questions[rule] || rule;
    }

    async function rollStats() {
        showLoading(generatedCharContent);
        
        const stats = [];
        for (let i = 0; i < 6; i++) {
            const rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => b - a);
            stats.push(rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0));
        }
        
        const content = `
            <h3>Rolled Ability Scores</h3>
            <div class="rolled-stats">
                ${stats.map((stat, i) => `<div class="stat-roll">${['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'][i]}: ${stat}</div>`).join('')}
            </div>
            <p>Total modifier: ${stats.reduce((sum, stat) => sum + Math.floor((stat - 10) / 2), 0)}</p>
        `;
        
        displayGeneratedContent(generatedCharContent, content, 'rolled-stats');
    }

    async function generateNames() {
        showLoading(generatedStoryContent);
        
        try {
            const prompt = `Generate 20 fantasy names suitable for D&D, including:
            - 5 human names (mix of male/female)
            - 5 elf names
            - 5 dwarf names
            - 5 place names (cities, taverns, etc.)
            
            Format as a neat list with categories.`;

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
            displayGeneratedContent(generatedStoryContent, response, 'generated-names');
        } catch (error) {
            displayError(generatedStoryContent, error.message);
        }
    }

    async function generateLoot() {
        showLoading(generatedStoryContent);
        
        try {
            const partyLevel = document.getElementById('party-level')?.value || 1;
            const prompt = `Generate appropriate treasure for a level ${partyLevel} D&D party including:
            - Coins and gems
            - 2-3 magic items (appropriate for level)
            - Some mundane but valuable items
            - Brief descriptions of notable items
            
            Make it balanced and interesting.`;

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
            displayGeneratedContent(generatedStoryContent, response, 'generated-loot');
        } catch (error) {
            displayError(generatedStoryContent, error.message);
        }
    }

    function handleCombatAction(action) {
        switch (action) {
            case 'attack':
                rollAttack();
                break;
            case 'damage':
                rollDamage();
                break;
            case 'heal':
                rollHealing();
                break;
            case 'condition':
                addCondition();
                break;
            case 'save':
                rollSave();
                break;
        }
    }

    function rollAttack() {
        const d20Roll = Math.floor(Math.random() * 20) + 1;
        const modifier = parseInt(prompt('Enter attack modifier:') || '0');
        const total = d20Roll + modifier;
        
        showToast(`Attack Roll: ${d20Roll} + ${modifier} = ${total}${d20Roll === 20 ? ' (CRITICAL!)' : d20Roll === 1 ? ' (FUMBLE!)' : ''}`, 
                 d20Roll === 20 ? 'success' : d20Roll === 1 ? 'error' : 'info');
    }

    function rollDamage() {
        const diceInput = prompt('Enter damage dice (e.g., 2d6+3):');
        if (diceInput) {
            const result = parseDiceString(diceInput);
            showToast(`Damage: ${result}`, 'warning');
        }
    }

    function rollHealing() {
        const diceInput = prompt('Enter healing dice (e.g., 2d4+2):');
        if (diceInput) {
            const result = parseDiceString(diceInput);
            showToast(`Healing: ${result}`, 'success');
        }
    }

    function rollSave() {
        const d20Roll = Math.floor(Math.random() * 20) + 1;
        const modifier = parseInt(prompt('Enter save modifier:') || '0');
        const total = d20Roll + modifier;
        
        showToast(`Saving Throw: ${d20Roll} + ${modifier} = ${total}${d20Roll === 20 ? ' (NATURAL 20!)' : d20Roll === 1 ? ' (NATURAL 1!)' : ''}`, 
                 d20Roll === 20 ? 'success' : d20Roll === 1 ? 'error' : 'info');
    }

    function addCondition() {
        const condition = prompt('Enter condition name:');
        if (condition) {
            showToast(`Condition "${condition}" noted`, 'info');
        }
    }

    function parseDiceString(diceString) {
        // Simple dice parser for XdY+Z format
        const match = diceString.match(/(\d+)d(\d+)(?:\+(\d+))?/i);
        if (match) {
            const [, count, sides, modifier] = match;
            let total = parseInt(modifier) || 0;
            const rolls = [];
            
            for (let i = 0; i < parseInt(count); i++) {
                const roll = Math.floor(Math.random() * parseInt(sides)) + 1;
                rolls.push(roll);
                total += roll;
            }
            
            return `${rolls.join(' + ')}${modifier ? ` + ${modifier}` : ''} = ${total}`;
        }
        return diceString;
    }

    // Original dice rolling functionality (preserved)
    function setupEventListeners() {
        if (quickRollBtn) {
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
        }

        if (historyDiceFilter) historyDiceFilter.addEventListener('change', filterHistory);
        if (historySearch) historySearch.addEventListener('input', filterHistory);

        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                state.soundEnabled = e.target.checked;
                localStorage.setItem('sound', state.soundEnabled);
            });
        }

        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                const theme = e.target.checked ? 'dark' : 'light';
                setTheme(theme);
                localStorage.setItem('theme', theme);
            });
        }
    }

    function createDice(sides) {
        if (!diceContainer) return;
        
        const diceElement = document.createElement('div');
        diceElement.className = `dice d${sides}`;
        diceElement.textContent = `d${sides}`;
        diceElement.addEventListener('click', () => rollDice(diceElement, sides));
        diceContainer.appendChild(diceElement);
    }

    async function rollDice(diceElement, sides) {
        if (state.animationsEnabled) {
            diceElement.classList.add('rolling');
        }
        
        const result = Math.floor(Math.random() * sides) + 1;
        
        setTimeout(() => {
            diceElement.classList.remove('rolling');
            updateState(result, sides);
            updateResultDisplay(result, sides);
            updateHistoryDisplay(result, sides);
            updateStatisticsDisplay();
            
            if (state.soundEnabled) {
                playRollSound(result, sides);
            }
            
            if (state.autoSaveEnabled) {
                saveHistory();
            }
        }, state.animationsEnabled ? 1000 : 0);
    }

    async function rollMultipleDice(count, sides, modifier = 0) {
        const rolls = [];
        let total = modifier;
        
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
            updateState(roll, sides);
        }
        
        updateRollBreakdown(rolls, modifier);
        updateRollTotal(total);
        updateHistoryDisplay(`${count}d${sides}${modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : ''}`, sides, modifier, rolls, total);
        updateStatisticsDisplay();
        
        if (state.soundEnabled) {
            playRollSound(total, sides);
        }
        
        if (state.autoSaveEnabled) {
            saveHistory();
        }
    }

    function updateState(roll, sides) {
        state.statistics.totalRolls++;
        state.statistics.diceCounts[`d${sides}`]++;
        
        if (roll > state.statistics.maxRoll) {
            state.statistics.maxRoll = roll;
        }
        
        if (roll < state.statistics.minRoll) {
            state.statistics.minRoll = roll;
        }
        
        if (sides === 20) {
            if (roll === 20) state.statistics.critSuccesses++;
            if (roll === 1) state.statistics.critFailures++;
        }
        
        const total = state.rollHistory.reduce((sum, entry) => sum + (entry.total || entry.result), 0) + roll;
        state.statistics.avgRoll = total / (state.rollHistory.length + 1);
    }

    function updateResultDisplay(result, sides, modifier = 0) {
        if (currentRollDisplay) {
            currentRollDisplay.textContent = result + (modifier !== 0 ? ` (${modifier > 0 ? '+' : ''}${modifier}) = ${result + modifier}` : '');
        }
    }

    function updateRollBreakdown(rolls, modifier = 0) {
        const breakdown = document.querySelector('.roll-breakdown');
        if (breakdown) {
            breakdown.innerHTML = `Rolls: ${rolls.join(' + ')}${modifier !== 0 ? ` + ${modifier}` : ''}`;
        }
    }

    function updateRollTotal(total) {
        const totalDiv = document.querySelector('.roll-total');
        if (totalDiv) {
            totalDiv.innerHTML = `<strong>Total: ${total}</strong>`;
        }
    }

    function updateHistoryDisplay(roll, sides, modifier = 0, rollsArray = null, total = null) {
        const entry = {
            timestamp: new Date(),
            roll: rollsArray ? `${rollsArray.length}d${sides}` : `d${sides}`,
            result: rollsArray ? rollsArray.join(', ') : roll,
            modifier: modifier,
            total: total || (typeof roll === 'number' ? roll + modifier : null),
            sides: sides
        };
        
        state.rollHistory.unshift(entry);
        
        if (state.rollHistory.length > 100) {
            state.rollHistory = state.rollHistory.slice(0, 100);
        }
        
        renderHistory();
    }

    function renderHistory() {
        if (!historyDiv) return;
        
        historyDiv.innerHTML = state.rollHistory.map(entry => `
            <div class="history-entry">
                <span class="history-dice d${entry.sides}">${entry.roll}</span>
                <span class="history-result">${entry.result}${entry.modifier !== 0 ? ` (${entry.modifier > 0 ? '+' : ''}${entry.modifier})` : ''}</span>
                ${entry.total ? `<span class="history-total"><strong>= ${entry.total}</strong></span>` : ''}
                <span class="history-time">${entry.timestamp.toLocaleTimeString()}</span>
            </div>
        `).join('');
    }

    function updateStatisticsDisplay() {
        const stats = state.statistics;
        const statsContainer = document.getElementById('stats-container');
        
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <h3>Total Rolls</h3>
                    <p>${stats.totalRolls}</p>
                </div>
                <div class="stat-card">
                    <h3>Average</h3>
                    <p>${stats.totalRolls > 0 ? stats.avgRoll.toFixed(2) : 'N/A'}</p>
                </div>
                <div class="stat-card">
                    <h3>Highest</h3>
                    <p>${stats.maxRoll > 0 ? stats.maxRoll : '0'}</p>
                </div>
                <div class="stat-card">
                    <h3>Lowest</h3>
                    <p>${stats.minRoll !== Infinity ? stats.minRoll : '0'}</p>
                </div>
                <div class="stat-card">
                    <h3>Critical Successes</h3>
                    <p>${stats.critSuccesses}</p>
                </div>
                <div class="stat-card">
                    <h3>Critical Failures</h3>
                    <p>${stats.critFailures}</p>
                </div>
            `;
        }
    }

    function updateDistributionChart() {
        // Placeholder for distribution chart
    }

    function filterHistory() {
        // Placeholder for history filtering
    }

    function loadHistory() {
        const saved = localStorage.getItem('dndRollHistory');
        if (saved) {
            try {
                state.rollHistory = JSON.parse(saved);
                renderHistory();
            } catch (e) {
                console.error('Failed to load history:', e);
            }
        }
    }

    function saveHistory() {
        localStorage.setItem('dndRollHistory', JSON.stringify(state.rollHistory));
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        state.currentTheme = theme;
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000;';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function playRollSound(result, sides) {
        // Audio feedback for rolls
        if (sides === 20) {
            if (result === 20) {
                console.log('Critical success sound!');
            } else if (result === 1) {
                console.log('Critical failure sound!');
            }
        }
    }
});