// AI Enhancement for D&D Assistant - Batch 1: Core Setup
document.addEventListener('DOMContentLoaded', () => {
    // API Configuration
    const DEEPSEEK_API_KEY = 'sk-10c5d42111244584b04ebd92e3104bfc';
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
    
    // Enhanced State for AI features
    window.aiState = {
        chatHistory: [],
        currentContext: null,
        combatants: [],
        currentTurn: 0,
        currentRound: 0,
        combatActive: false
    };

    console.log('AI Enhancement loaded!');
    
    // Initialize AI features
    initializeAI();

    function initializeAI() {
        setupTabNavigation();
        setupAIDMChat();
        setupCharacterGenerator();
        setupStoryGenerator();
        setupRuleAssistant();
        setupCombatTracker();
        showToast('🤖 AI Assistant Ready!', 'success');
    }

    // Core AI API Function
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

    // Tab Navigation
    function setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                switchTab(tab);
            });
        });
        
        // Restore active tab from localStorage
        restoreActiveTab();
    }
    
    function restoreActiveTab() {
        const savedTab = localStorage.getItem('dnd-active-tab');
        const defaultTab = 'character-sheet'; // Changed from dice-roller default
        const tabToShow = savedTab || defaultTab;
        
        console.log('Restoring tab:', tabToShow, 'from localStorage:', savedTab);
        
        // Verify the tab exists before switching
        const tabExists = document.getElementById(tabToShow);
        if (tabExists) {
            switchTab(tabToShow);
        } else {
            console.warn('Saved tab not found, using default:', defaultTab);
            switchTab(defaultTab);
        }
    }

    function switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        
        if (activeBtn) activeBtn.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
        
        // Save active tab to localStorage
        localStorage.setItem('dnd-active-tab', tabId);
        console.log('Active tab saved:', tabId);
    }

    // AI DM Chat Functions
    function setupAIDMChat() {
        const dmSendBtn = document.getElementById('dm-send-btn');
        const dmChatInput = document.getElementById('dm-chat-input');
        const contextTags = document.querySelectorAll('.context-tag');

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
                window.aiState.currentContext = tag.dataset.context;
            });
        });
        
        // Load chat history from localStorage
        loadChatHistory();
    }
    
    function saveChatHistory() {
        try {
            localStorage.setItem('dnd-chat-history', JSON.stringify(window.aiState.chatHistory));
            console.log('Chat history saved, messages:', window.aiState.chatHistory.length);
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }
    
    function loadChatHistory() {
        try {
            const savedHistory = localStorage.getItem('dnd-chat-history');
            if (savedHistory) {
                window.aiState.chatHistory = JSON.parse(savedHistory);
                console.log('Chat history loaded, messages:', window.aiState.chatHistory.length);
                
                // Restore chat messages to UI
                restoreChatMessagesToUI();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            window.aiState.chatHistory = [];
        }
    }
    
    function restoreChatMessagesToUI() {
        const dmChatMessages = document.getElementById('dm-chat-messages');
        if (!dmChatMessages || window.aiState.chatHistory.length === 0) return;
        
        // Clear existing messages (except system message)
        const systemMessage = dmChatMessages.querySelector('.system-message');
        dmChatMessages.innerHTML = '';
        if (systemMessage) {
            dmChatMessages.appendChild(systemMessage);
        }
        
        // Add all saved messages
        window.aiState.chatHistory.forEach(msg => {
            if (msg.role === 'user') {
                addChatMessage('user', msg.content);
            } else if (msg.role === 'assistant') {
                addChatMessage('ai', msg.content);
            }
        });
    }

    async function sendDMMessage() {
        const dmChatInput = document.getElementById('dm-chat-input');
        const dmChatMessages = document.getElementById('dm-chat-messages');
        
        if (!dmChatInput || !dmChatMessages) return;
        
        const message = dmChatInput.value.trim();
        if (!message) return;

        addChatMessage('user', message);
        dmChatInput.value = '';
        
        const loadingMsg = addChatMessage('ai', '', true);
        
        try {
            const context = window.aiState.currentContext || 'general';
            const systemPrompt = getDMSystemPrompt(context);
            
            const messages = [
                { role: 'system', content: systemPrompt },
                ...window.aiState.chatHistory.slice(-10),
                { role: 'user', content: message }
            ];

            const response = await callDeepSeekAPI(messages);
            
            loadingMsg.remove();
            addChatMessage('ai', response);
            
            window.aiState.chatHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: response }
            );
            
            // Save chat history to localStorage
            saveChatHistory();
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
        const dmChatMessages = document.getElementById('dm-chat-messages');
        if (!dmChatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}${isLoading ? ' loading' : ''}`;
        
        if (!isLoading) {
            messageDiv.textContent = content;
        }
        
        dmChatMessages.appendChild(messageDiv);
        dmChatMessages.scrollTop = dmChatMessages.scrollHeight;
        return messageDiv;
    }

    // Character Generator Setup
    function setupCharacterGenerator() {
        const generateCharacterBtn = document.getElementById('generate-character-btn');
        const generateBackstoryBtn = document.getElementById('generate-backstory-btn');
        const rollStatsBtn = document.getElementById('roll-stats-btn');
        
        if (generateCharacterBtn) generateCharacterBtn.addEventListener('click', generateCharacter);
        if (generateBackstoryBtn) generateBackstoryBtn.addEventListener('click', generateBackstory);
        if (rollStatsBtn) rollStatsBtn.addEventListener('click', rollStats);
    }

    // Utility Functions
    function showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading-spinner">🎲 Generating with AI...</div>';
        }
    }

    function displayGeneratedContent(element, content, className) {
        if (element) {
            element.innerHTML = `<div class="${className}">${content.replace(/\n/g, '<br>')}</div>`;
        }
    }

    function displayError(element, message) {
        if (element) {
            element.innerHTML = `<div class="error-message">❌ Error: ${message}</div>`;
        }
    }

    // Batch 2: Character Generator Functions
    async function generateCharacter() {
        const genClass = document.getElementById('gen-class')?.value;
        const genRace = document.getElementById('gen-race')?.value;
        const genLevel = document.getElementById('gen-level')?.value;
        const genTheme = document.getElementById('gen-theme')?.value;
        const generatedCharContent = document.getElementById('generated-char-content');

        if (!generatedCharContent) return;
        showLoading(generatedCharContent);

        try {
            const prompt = `Create a detailed D&D 5e character with the following preferences:
            - Class: ${genClass || 'any appropriate class'}
            - Race: ${genRace || 'any appropriate race'}
            - Level: ${genLevel || 1}
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
            
            // Add import button for generated character
            const importBtn = document.createElement('button');
            importBtn.className = 'btn btn-primary';
            importBtn.textContent = '📋 Import to Character Sheet';
            importBtn.style.marginTop = '1rem';
            importBtn.onclick = () => importGeneratedCharacter(response);
            generatedCharContent.appendChild(importBtn);
            
            showToast('Character generated! Click Import to add to character sheet.', 'success');
        } catch (error) {
            displayError(generatedCharContent, error.message);
        }
    }

    async function generateBackstory() {
        const generatedCharContent = document.getElementById('generated-char-content');
        if (!generatedCharContent) return;
        
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
            showToast('Backstory generated!', 'success');
        } catch (error) {
            displayError(generatedCharContent, error.message);
        }
    }

    async function rollStats() {
        const generatedCharContent = document.getElementById('generated-char-content');
        if (!generatedCharContent) return;
        
        showLoading(generatedCharContent);
        
        const stats = [];
        for (let i = 0; i < 6; i++) {
            const rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => b - a);
            stats.push(rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0));
        }
        
        const content = `
            <h3>🎲 Rolled Ability Scores</h3>
            <div class="rolled-stats" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0;">
                ${stats.map((stat, i) => `
                    <div class="stat-roll" style="padding: 0.5rem; background: var(--background); border-radius: var(--radius-md); text-align: center;">
                        <strong>${['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'][i]}: ${stat}</strong>
                        <br><small>(${Math.floor((stat - 10) / 2) >= 0 ? '+' : ''}${Math.floor((stat - 10) / 2)})</small>
                    </div>
                `).join('')}
            </div>
            <p style="text-align: center; font-weight: bold; color: var(--primary);">
                Total modifier: ${stats.reduce((sum, stat) => sum + Math.floor((stat - 10) / 2), 0)}
            </p>
        `;
        
        displayGeneratedContent(generatedCharContent, content, 'rolled-stats');
        
        // Create stats object for import functionality
        const statsObject = {
            STR: stats[0],
            DEX: stats[1],
            CON: stats[2],
            INT: stats[3],
            WIS: stats[4],
            CHA: stats[5]
        };
        
        // Add import button for stats
        const importBtn = document.createElement('button');
        importBtn.className = 'btn btn-primary';
        importBtn.textContent = '📊 Import to Character Sheet';
        importBtn.style.marginTop = '1rem';
        importBtn.onclick = () => useGeneratedStats(statsObject);
        generatedCharContent.appendChild(importBtn);
        
        showToast('Stats rolled! Click Import to add to character sheet.', 'success');
    }

    // Batch 3: Story Generator Functions
    function setupStoryGenerator() {
        const generateStoryBtn = document.getElementById('generate-story-btn');
        const generateNamesBtn = document.getElementById('generate-names-btn');
        const generateLootBtn = document.getElementById('generate-loot-btn');
        
        if (generateStoryBtn) generateStoryBtn.addEventListener('click', generateStory);
        if (generateNamesBtn) generateNamesBtn.addEventListener('click', generateNames);
        if (generateLootBtn) generateLootBtn.addEventListener('click', generateLoot);
    }

    async function generateStory() {
        const storyType = document.getElementById('story-type')?.value || 'adventure';
        const storySetting = document.getElementById('story-setting')?.value;
        const storyTone = document.getElementById('story-tone')?.value;
        const partyLevel = document.getElementById('party-level')?.value || 1;
        const customPrompt = document.getElementById('custom-prompt')?.value;
        const generatedStoryContent = document.getElementById('generated-story-content');

        if (!generatedStoryContent) return;
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
            
            const saveBtn = document.getElementById('save-story-btn');
            const regenBtn = document.getElementById('regenerate-btn');
            if (saveBtn) saveBtn.style.display = 'inline-block';
            if (regenBtn) regenBtn.style.display = 'inline-block';
            
            showToast('Story generated!', 'success');
        } catch (error) {
            displayError(generatedStoryContent, error.message);
        }
    }

    async function generateNames() {
        const generatedStoryContent = document.getElementById('generated-story-content');
        if (!generatedStoryContent) return;
        
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
            showToast('Names generated!', 'success');
        } catch (error) {
            displayError(generatedStoryContent, error.message);
        }
    }

    async function generateLoot() {
        const generatedStoryContent = document.getElementById('generated-story-content');
        const partyLevel = document.getElementById('party-level')?.value || 1;
        if (!generatedStoryContent) return;
        
        showLoading(generatedStoryContent);
        
        try {
            const prompt = `Generate appropriate treasure for a level ${partyLevel} D&D party including:
            - Coins and gems
            - 2-3 magic items (appropriate for level)
            - Some mundane but valuable items
            - Brief descriptions of notable items
            
            Make it balanced and interesting.`;

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
            displayGeneratedContent(generatedStoryContent, response, 'generated-loot');
            
            // Add import button for loot
            const importBtn = document.createElement('button');
            importBtn.className = 'btn btn-primary';
            importBtn.textContent = '🎒 Add to Character Equipment';
            importBtn.style.marginTop = '1rem';
            importBtn.onclick = () => addToCharacterEquipment(response);
            generatedStoryContent.appendChild(importBtn);
            
            showToast('Loot generated! Click Add to import to character sheet.', 'success');
        } catch (error) {
            displayError(generatedStoryContent, error.message);
        }
    }

    // Rule Assistant Functions
    function setupRuleAssistant() {
        const ruleButtons = document.querySelectorAll('.rule-btn');
        const askRuleBtn = document.getElementById('ask-rule-btn');
        const ruleQuestion = document.getElementById('rule-question');
        
        ruleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const rule = btn.dataset.rule;
                askRule(getQuickRuleQuestion(rule));
            });
        });
        
        if (askRuleBtn && ruleQuestion) {
            askRuleBtn.addEventListener('click', () => {
                const question = ruleQuestion.value.trim();
                if (question) askRule(question);
            });
        }
    }

    async function askRule(question) {
        const ruleAnswer = document.getElementById('rule-answer');
        if (!ruleAnswer) return;
        
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
            showToast('Rule explained!', 'success');
        } catch (error) {
            displayError(ruleAnswer, error.message);
        }
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

    // Batch 4: Combat Tracker Functions
    function setupCombatTracker() {
        const startCombatBtn = document.getElementById('start-combat-btn');
        const nextTurnBtn = document.getElementById('next-turn-btn');
        const endCombatBtn = document.getElementById('end-combat-btn');
        const addCombatantBtn = document.getElementById('add-combatant-btn');
        const generateEnemyBtn = document.getElementById('generate-enemy-btn');
        
        if (startCombatBtn) startCombatBtn.addEventListener('click', startCombat);
        if (nextTurnBtn) nextTurnBtn.addEventListener('click', nextTurn);
        if (endCombatBtn) endCombatBtn.addEventListener('click', endCombat);
        if (addCombatantBtn) addCombatantBtn.addEventListener('click', addCombatant);
        if (generateEnemyBtn) generateEnemyBtn.addEventListener('click', generateEnemy);
        
        // Load combat state from localStorage
        loadCombatState();
    }
    
    function saveCombatState() {
        try {
            const combatState = {
                combatants: window.aiState.combatants,
                combatActive: window.aiState.combatActive,
                currentRound: window.aiState.currentRound,
                currentTurn: window.aiState.currentTurn
            };
            localStorage.setItem('dnd-combat-state', JSON.stringify(combatState));
            console.log('Combat state saved');
        } catch (error) {
            console.error('Error saving combat state:', error);
        }
    }
    
    function loadCombatState() {
        try {
            const savedState = localStorage.getItem('dnd-combat-state');
            if (savedState) {
                const combatState = JSON.parse(savedState);
                window.aiState.combatants = combatState.combatants || [];
                window.aiState.combatActive = combatState.combatActive || false;
                window.aiState.currentRound = combatState.currentRound || 0;
                window.aiState.currentTurn = combatState.currentTurn || 0;
                
                // Update UI to reflect loaded state
                updateCombatUI();
                updateCombatantsList();
                
                console.log('Combat state loaded:', {
                    combatants: window.aiState.combatants.length,
                    active: window.aiState.combatActive,
                    round: window.aiState.currentRound
                });
            }
        } catch (error) {
            console.error('Error loading combat state:', error);
        }
    }

    function startCombat() {
        if (window.aiState.combatants.length < 2) {
            showToast('Add at least 2 combatants to start combat', 'warning');
            return;
        }

        window.aiState.combatants.sort((a, b) => b.initiative - a.initiative);
        window.aiState.combatActive = true;
        window.aiState.currentRound = 1;
        window.aiState.currentTurn = 0;

        updateCombatUI();
        updateCombatantsList();
        saveCombatState();
        showToast('⚔️ Combat started!', 'success');
    }

    function nextTurn() {
        window.aiState.currentTurn++;
        if (window.aiState.currentTurn >= window.aiState.combatants.length) {
            window.aiState.currentTurn = 0;
            window.aiState.currentRound++;
        }
        updateCombatUI();
        updateCombatantsList();
        saveCombatState();
        showToast(`Turn: ${window.aiState.combatants[window.aiState.currentTurn]?.name || 'Unknown'}`, 'info');
    }

    function endCombat() {
        window.aiState.combatActive = false;
        window.aiState.currentRound = 0;
        window.aiState.currentTurn = 0;
        updateCombatUI();
        updateCombatantsList();
        saveCombatState();
        showToast('Combat ended!', 'success');
    }

    function addCombatant() {
        const name = document.getElementById('combatant-name')?.value;
        const initiative = parseInt(document.getElementById('combatant-initiative')?.value);
        const hp = parseInt(document.getElementById('combatant-hp')?.value);
        const ac = parseInt(document.getElementById('combatant-ac')?.value);
        const type = document.getElementById('combatant-type')?.value;

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

        window.aiState.combatants.push(combatant);
        updateCombatantsList();
        saveCombatState();
        
        // Clear form
        const nameField = document.getElementById('combatant-name');
        const initField = document.getElementById('combatant-initiative');
        const hpField = document.getElementById('combatant-hp');
        const acField = document.getElementById('combatant-ac');
        
        if (nameField) nameField.value = '';
        if (initField) initField.value = '';
        if (hpField) hpField.value = '';
        if (acField) acField.value = '';
        
        showToast(`${name} added to combat!`, 'success');
    }

    async function generateEnemy() {
        try {
            const partyLevel = document.getElementById('party-level')?.value || 1;
            const prompt = `Create a D&D 5e enemy appropriate for a level ${partyLevel} party. Provide:
            1. Name and creature type
            2. AC, HP, and key stats
            3. Initiative modifier suggestion
            4. Brief description of abilities
            5. Suggested tactics
            
            Format it as a stat block summary.`;

            const response = await callDeepSeekAPI([{ role: 'user', content: prompt }]);
            
            // Try to parse some basic stats from the response
            const hpMatch = response.match(/HP[:\s]*(\d+)/i);
            const acMatch = response.match(/AC[:\s]*(\d+)/i);
            const nameMatch = response.match(/Name[:\s]*([^\n\r]+)/i);
            
            const nameField = document.getElementById('combatant-name');
            const hpField = document.getElementById('combatant-hp');
            const acField = document.getElementById('combatant-ac');
            const initField = document.getElementById('combatant-initiative');
            const typeField = document.getElementById('combatant-type');
            
            if (hpMatch && acMatch && nameField && hpField && acField && initField && typeField) {
                nameField.value = nameMatch ? nameMatch[1].trim() : 'Generated Enemy';
                hpField.value = hpMatch[1];
                acField.value = acMatch[1];
                initField.value = Math.floor(Math.random() * 20) + 1;
                typeField.value = 'enemy';
            }
            
            showToast('🐉 Enemy generated! Check the form and add to combat.', 'success');
            
            // Show the full enemy description
            const form = document.querySelector('.combatant-form');
            if (form) {
                const existing = form.querySelector('.generated-enemy-info');
                if (existing) existing.remove();
                
                const enemyDiv = document.createElement('div');
                enemyDiv.className = 'generated-enemy-info';
                enemyDiv.innerHTML = `<h4>🎲 Generated Enemy Details:</h4><pre style="white-space: pre-wrap; font-size: 0.9rem;">${response}</pre>`;
                enemyDiv.style.cssText = 'margin-top: 1rem; padding: 1rem; background: var(--background); border-radius: var(--radius-md); border-left: 4px solid var(--primary);';
                form.appendChild(enemyDiv);
            }
            
        } catch (error) {
            showToast(`Error generating enemy: ${error.message}`, 'error');
        }
    }

    function updateCombatUI() {
        const currentRoundSpan = document.getElementById('current-round');
        const startCombatBtn = document.getElementById('start-combat-btn');
        const nextTurnBtn = document.getElementById('next-turn-btn');
        const endCombatBtn = document.getElementById('end-combat-btn');
        
        if (currentRoundSpan) currentRoundSpan.textContent = window.aiState.currentRound;
        if (startCombatBtn) startCombatBtn.disabled = window.aiState.combatActive;
        if (nextTurnBtn) nextTurnBtn.disabled = !window.aiState.combatActive;
        if (endCombatBtn) endCombatBtn.disabled = !window.aiState.combatActive;
    }

    function updateCombatantsList() {
        const combatantsList = document.getElementById('combatants-list');
        if (!combatantsList) return;
        
        if (window.aiState.combatants.length === 0) {
            combatantsList.innerHTML = '<p class="placeholder-text">Add combatants to begin tracking initiative!</p>';
            return;
        }

        combatantsList.innerHTML = window.aiState.combatants.map((combatant, index) => {
            const isActive = window.aiState.combatActive && index === window.aiState.currentTurn;
            const hpPercentage = (combatant.currentHp / combatant.maxHp) * 100;
            const hpColor = hpPercentage > 50 ? 'var(--success)' : hpPercentage > 25 ? 'var(--warning)' : 'var(--error)';
            
            return `
                <div class="combatant-item ${isActive ? 'active' : ''}" style="border-left-color: ${hpColor}">
                    <div class="combatant-info">
                        <div class="combatant-name">${combatant.name} ${isActive ? '← ACTIVE' : ''}</div>
                        <div class="combatant-stats">
                            <span>Init: ${combatant.initiative}</span>
                            <span style="color: ${hpColor}">HP: ${combatant.currentHp}/${combatant.maxHp}</span>
                            <span>AC: ${combatant.ac}</span>
                            <span>Type: ${combatant.type}</span>
                        </div>
                    </div>
                    <div class="combatant-actions">
                        <button onclick="window.aiEnhanced.damageCombatant(${combatant.id})" style="background: var(--error);">Damage</button>
                        <button onclick="window.aiEnhanced.healCombatant(${combatant.id})" style="background: var(--success);">Heal</button>
                        <button onclick="window.aiEnhanced.removeCombatant(${combatant.id})" style="background: var(--secondary);">Remove</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Combat action functions
    function damageCombatant(id) {
        const damage = prompt('💥 Enter damage amount:');
        if (damage && !isNaN(damage)) {
            const combatant = window.aiState.combatants.find(c => c.id === id);
            if (combatant) {
                combatant.currentHp = Math.max(0, combatant.currentHp - parseInt(damage));
                updateCombatantsList();
                saveCombatState();
                showToast(`${combatant.name} takes ${damage} damage${combatant.currentHp === 0 ? ' and is down!' : ''}`, 
                         combatant.currentHp === 0 ? 'error' : 'warning');
            }
        }
    }

    function healCombatant(id) {
        const healing = prompt('💚 Enter healing amount:');
        if (healing && !isNaN(healing)) {
            const combatant = window.aiState.combatants.find(c => c.id === id);
            if (combatant) {
                combatant.currentHp = Math.min(combatant.maxHp, combatant.currentHp + parseInt(healing));
                updateCombatantsList();
                saveCombatState();
                showToast(`${combatant.name} heals ${healing} HP`, 'success');
            }
        }
    }

    function removeCombatant(id) {
        const combatant = window.aiState.combatants.find(c => c.id === id);
        if (combatant && confirm(`Remove ${combatant.name} from combat?`)) {
            window.aiState.combatants = window.aiState.combatants.filter(c => c.id !== id);
            updateCombatantsList();
            saveCombatState();
            showToast(`${combatant.name} removed from combat`, 'info');
        }
    }

    // Integration functions to connect all tabs
    function importGeneratedCharacter(characterData) {
        try {
            // Switch to character sheet tab
            switchTab('character-sheet');
            
            // Parse character data and populate fields
            const lines = characterData.split('\n');
            let characterInfo = {};
            
            // Extract character information
            lines.forEach(line => {
                if (line.includes('Name:')) characterInfo.name = line.split(':')[1]?.trim();
                if (line.includes('Race:')) characterInfo.race = line.split(':')[1]?.trim();
                if (line.includes('Class:')) characterInfo.class = line.split(':')[1]?.trim();
                if (line.includes('Level:')) characterInfo.level = line.split(':')[1]?.trim();
                if (line.includes('Background:')) characterInfo.background = line.split(':')[1]?.trim();
                if (line.includes('Alignment:')) characterInfo.alignment = line.split(':')[1]?.trim();
            });
            
            // Populate character sheet fields
            if (characterInfo.name) {
                const nameField = document.getElementById('characterName');
                if (nameField) nameField.value = characterInfo.name;
            }
            
            if (characterInfo.race) {
                const raceField = document.getElementById('race');
                if (raceField) raceField.value = characterInfo.race;
            }
            
            if (characterInfo.class) {
                const classField = document.getElementById('characterClass');
                if (classField) classField.value = characterInfo.class;
            }
            
            if (characterInfo.level) {
                const levelField = document.getElementById('level');
                if (levelField) levelField.value = characterInfo.level;
            }
            
            if (characterInfo.background) {
                const backgroundField = document.getElementById('background');
                if (backgroundField) backgroundField.value = characterInfo.background;
            }
            
            // Trigger save if function exists
            if (typeof window.saveCharacterSheet === 'function') {
                window.saveCharacterSheet();
            }
            
            showToast('Character imported successfully!', 'success');
            
        } catch (error) {
            console.error('Error importing character:', error);
            showToast('Error importing character', 'error');
        }
    }

    function useGeneratedStats(stats) {
        try {
            // Switch to character sheet tab
            switchTab('character-sheet');
            
            // Apply stats to character sheet
            Object.keys(stats).forEach(stat => {
                const fieldId = stat.toLowerCase();
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = stats[stat];
                    console.log(`Set ${fieldId} to ${stats[stat]}`);
                    // Trigger change event to update modifiers
                    field.dispatchEvent(new Event('change'));
                    field.dispatchEvent(new Event('input'));
                } else {
                    console.warn(`Field not found: ${fieldId}`);
                }
            });
            
            // Save character sheet if function exists
            if (typeof window.saveCharacterSheet === 'function') {
                window.saveCharacterSheet();
            }
            
            showToast('Stats imported successfully!', 'success');
            
        } catch (error) {
            console.error('Error importing stats:', error);
            showToast('Error importing stats', 'error');
        }
    }

    function addToCharacterEquipment(item) {
        try {
            switchTab('character-sheet');
            
            const equipmentField = document.getElementById('equipment');
            if (equipmentField) {
                const currentEquipment = equipmentField.value;
                const newEquipment = currentEquipment ? currentEquipment + '\n' + item : item;
                equipmentField.value = newEquipment;
                
                if (typeof window.saveCharacterSheet === 'function') {
                    window.saveCharacterSheet();
                }
                
                showToast('Item added to equipment!', 'success');
            }
        } catch (error) {
            console.error('Error adding equipment:', error);
            showToast('Error adding equipment', 'error');
        }
    }

    function addToCombatFromCharacterSheet() {
        try {
            const nameField = document.getElementById('characterName');
            const levelField = document.getElementById('level');
            const hpField = document.getElementById('hitPoints');
            const acField = document.getElementById('armorClass');
            
            console.log('Adding character to combat...', {
                name: nameField?.value,
                hp: hpField?.value,
                ac: acField?.value
            });
            
            if (!nameField?.value) {
                showToast('Please enter character name first', 'warning');
                return;
            }
            
            // Get dex modifier for initiative
            const dexField = document.getElementById('dex');
            const dexScore = parseInt(dexField?.value) || 10;
            const dexMod = Math.floor((dexScore - 10) / 2);
            const initiativeRoll = Math.floor(Math.random() * 20) + 1 + dexMod;
            
            const character = {
                id: Date.now(),
                name: nameField.value || 'Player Character',
                initiative: initiativeRoll,
                maxHp: parseInt(hpField?.value) || 20,
                currentHp: parseInt(hpField?.value) || 20,
                ac: parseInt(acField?.value) || 10,
                type: 'player',
                conditions: []
            };
            
            console.log('Character object created:', character);
            
            // Initialize aiState if it doesn't exist
            if (!window.aiState) {
                window.aiState = {
                    combatants: [],
                    combatActive: false,
                    currentRound: 0,
                    currentTurn: 0
                };
            }
            
            window.aiState.combatants.push(character);
            console.log('Character added to combatants:', window.aiState.combatants);
            
            switchTab('combat-tracker');
            
            // Update combat list if function exists
            if (typeof updateCombatantsList === 'function') {
                updateCombatantsList();
                saveCombatState();
            } else {
                console.log('updateCombatantsList function not found');
            }
            
            showToast(`${character.name} added to combat! (Initiative: ${initiativeRoll})`, 'success');
            
        } catch (error) {
            console.error('Error adding character to combat:', error);
            showToast('Error adding character to combat: ' + error.message, 'error');
        }
    }

    // Preserve original dice rolling functionality
    function preserveOriginalDiceRoller() {
        const rollButton = document.getElementById('rollButton');
        const resultDiv = document.getElementById('result');
        
        if (rollButton && !rollButton.hasAttribute('data-ai-enhanced')) {
            rollButton.setAttribute('data-ai-enhanced', 'true');
            
            rollButton.addEventListener('click', function() {
                try {
                    // Get original roll results
                    const diceValue = parseInt(document.getElementById('dice')?.value) || 20;
                    const modifierValue = parseInt(document.getElementById('modifier')?.value) || 0;
                    const numDice = parseInt(document.getElementById('numDice')?.value) || 1;
                    
                    // Roll dice
                    let total = 0;
                    let results = [];
                    
                    for (let i = 0; i < numDice; i++) {
                        const roll = Math.floor(Math.random() * diceValue) + 1;
                        results.push(roll);
                        total += roll;
                    }
                    
                    total += modifierValue;
                    
                    // Display result
                    let resultText = `Rolled ${numDice}d${diceValue}`;
                    if (modifierValue !== 0) {
                        resultText += (modifierValue > 0 ? '+' : '') + modifierValue;
                    }
                    resultText += `: ${results.join(', ')}`;
                    if (modifierValue !== 0) {
                        resultText += ` (${total})`;
                    } else if (numDice > 1) {
                        resultText += ` = ${total}`;
                    }
                    
                    if (resultDiv) {
                        resultDiv.innerHTML = `<h3>${resultText}</h3>`;
                    }
                    
                    // Play sound if it exists
                    const sound = document.getElementById('rollSound');
                    if (sound) {
                        sound.currentTime = 0;
                        sound.play().catch(() => {}); // Ignore audio errors
                    }
                    
                } catch (error) {
                    console.error('Error during dice roll:', error);
                    if (resultDiv) {
                        resultDiv.innerHTML = '<h3>Error rolling dice</h3>';
                    }
                }
            });
        }
    }

    // Initialize preserved functionality
    preserveOriginalDiceRoller();
    
    // Initialize character sheet functionality
    initializeCharacterSheet();
    
    // Fallback toast function if not available
    if (!window.showToast) {
        window.showToast = function(message, type = 'info') {
            console.log(`Toast (${type}):`, message);
            
            // Create simple toast notification
            const toast = document.createElement('div');
            toast.className = `toast ${type} show`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                background: ${type === 'success' ? '#00b894' : type === 'error' ? '#d63031' : type === 'warning' ? '#fdcb6e' : '#6c5ce7'};
            `;
            
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 3000);
        };
    }
    
    // Character Sheet Management Functions
    function initializeCharacterSheet() {
        console.log('Initializing character sheet...');
        
        // Set up event listeners for character sheet (backup - primary is onclick)
        const saveBtn = document.getElementById('save-character-btn');
        const loadBtn = document.getElementById('load-character-btn');
        const exportBtn = document.getElementById('export-character-btn');
        
        console.log('Found buttons:', { saveBtn: !!saveBtn, loadBtn: !!loadBtn, exportBtn: !!exportBtn });
        
        if (saveBtn) saveBtn.addEventListener('click', saveCharacterSheet);
        if (loadBtn) loadBtn.addEventListener('click', loadCharacterSheet);
        if (exportBtn) exportBtn.addEventListener('click', exportCharacterSheet);
        
        // Set up ability score change listeners
        const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        abilityScores.forEach(ability => {
            const input = document.getElementById(ability);
            if (input) {
                input.addEventListener('change', () => updateModifiers());
                input.addEventListener('input', () => updateModifiers());
            }
        });
        
        // Set up level change listener for proficiency bonus
        const levelInput = document.getElementById('level');
        if (levelInput) {
            levelInput.addEventListener('change', updateProficiencyBonus);
            levelInput.addEventListener('input', updateProficiencyBonus);
        }
        
        // Load saved character on page load
        setTimeout(() => {
            loadCharacterSheet();
            updateModifiers();
            updateProficiencyBonus();
        }, 500);
        
        console.log('Character sheet initialized');
    }
    
    function updateModifiers() {
        const abilityScores = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        
        abilityScores.forEach(ability => {
            const input = document.getElementById(ability);
            const modDiv = document.getElementById(`${ability}-mod`);
            
            if (input && modDiv) {
                const score = parseInt(input.value) || 10;
                const modifier = Math.floor((score - 10) / 2);
                modDiv.textContent = modifier >= 0 ? `+${modifier}` : `${modifier}`;
            }
        });
    }
    
    function updateProficiencyBonus() {
        const levelInput = document.getElementById('level');
        const proficiencyInput = document.getElementById('proficiencyBonus');
        
        if (levelInput && proficiencyInput) {
            const level = parseInt(levelInput.value) || 1;
            const proficiency = Math.ceil(level / 4) + 1;
            proficiencyInput.value = proficiency;
        }
    }
    
    function saveCharacterSheet() {
        try {
            console.log('Saving character sheet...');
            
            const character = {
                characterName: document.getElementById('characterName')?.value || '',
                characterClass: document.getElementById('characterClass')?.value || '',
                level: document.getElementById('level')?.value || 1,
                race: document.getElementById('race')?.value || '',
                background: document.getElementById('background')?.value || '',
                alignment: document.getElementById('alignment')?.value || '',
                
                // Combat stats
                armorClass: document.getElementById('armorClass')?.value || 10,
                hitPoints: document.getElementById('hitPoints')?.value || 8,
                maxHitPoints: document.getElementById('maxHitPoints')?.value || 8,
                initiative: document.getElementById('initiative')?.value || 0,
                speed: document.getElementById('speed')?.value || 30,
                proficiencyBonus: document.getElementById('proficiencyBonus')?.value || 2,
                
                // Ability scores
                str: document.getElementById('str')?.value || 10,
                dex: document.getElementById('dex')?.value || 10,
                con: document.getElementById('con')?.value || 10,
                int: document.getElementById('int')?.value || 10,
                wis: document.getElementById('wis')?.value || 10,
                cha: document.getElementById('cha')?.value || 10,
                
                // Additional info
                equipment: document.getElementById('equipment')?.value || '',
                features: document.getElementById('features')?.value || '',
                spells: document.getElementById('spells')?.value || '',
                notes: document.getElementById('notes')?.value || '',
                
                // Save timestamp
                savedAt: new Date().toISOString()
            };
            
            console.log('Character data to save:', character);
            localStorage.setItem('dnd-character-sheet', JSON.stringify(character));
            console.log('Character saved to localStorage');
            showToast('✅ Character saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving character:', error);
            showToast('❌ Error saving character: ' + error.message, 'error');
        }
    }
    
    function loadCharacterSheet() {
        try {
            console.log('Loading character sheet...');
            const savedCharacter = localStorage.getItem('dnd-character-sheet');
            
            if (!savedCharacter) {
                console.log('No saved character found');
                showToast('💭 No saved character found', 'info');
                return;
            }
            
            const character = JSON.parse(savedCharacter);
            console.log('Character data loaded:', character);
            
            // Populate all fields
            Object.keys(character).forEach(key => {
                if (key === 'savedAt') return; // Skip metadata
                
                const element = document.getElementById(key);
                if (element) {
                    element.value = character[key];
                    console.log(`Set ${key} to ${character[key]}`);
                }
            });
            
            // Update calculated values
            updateModifiers();
            updateProficiencyBonus();
            
            showToast('📂 Character loaded successfully!', 'success');
            
        } catch (error) {
            console.error('Error loading character:', error);
            showToast('❌ Error loading character: ' + error.message, 'error');
        }
    }
    
    function exportCharacterSheet() {
        try {
            const character = {
                characterName: document.getElementById('characterName')?.value || '',
                characterClass: document.getElementById('characterClass')?.value || '',
                level: document.getElementById('level')?.value || 1,
                race: document.getElementById('race')?.value || '',
                background: document.getElementById('background')?.value || '',
                alignment: document.getElementById('alignment')?.value || '',
                
                // Combat stats
                armorClass: document.getElementById('armorClass')?.value || 10,
                hitPoints: document.getElementById('hitPoints')?.value || 8,
                maxHitPoints: document.getElementById('maxHitPoints')?.value || 8,
                
                // Ability scores
                str: document.getElementById('str')?.value || 10,
                dex: document.getElementById('dex')?.value || 10,
                con: document.getElementById('con')?.value || 10,
                int: document.getElementById('int')?.value || 10,
                wis: document.getElementById('wis')?.value || 10,
                cha: document.getElementById('cha')?.value || 10,
                
                equipment: document.getElementById('equipment')?.value || '',
                features: document.getElementById('features')?.value || '',
                spells: document.getElementById('spells')?.value || '',
                notes: document.getElementById('notes')?.value || ''
            };
            
            const exportText = `
=== D&D CHARACTER SHEET ===

NAME: ${character.characterName}
CLASS: ${character.characterClass}
LEVEL: ${character.level}
RACE: ${character.race}
BACKGROUND: ${character.background}
ALIGNMENT: ${character.alignment}

=== COMBAT STATS ===
AC: ${character.armorClass}
HP: ${character.hitPoints}/${character.maxHitPoints}

=== ABILITY SCORES ===
STR: ${character.str} (${Math.floor((character.str - 10) / 2) >= 0 ? '+' : ''}${Math.floor((character.str - 10) / 2)})
DEX: ${character.dex} (${Math.floor((character.dex - 10) / 2) >= 0 ? '+' : ''}${Math.floor((character.dex - 10) / 2)})
CON: ${character.con} (${Math.floor((character.con - 10) / 2) >= 0 ? '+' : ''}${Math.floor((character.con - 10) / 2)})
INT: ${character.int} (${Math.floor((character.int - 10) / 2) >= 0 ? '+' : ''}${Math.floor((character.int - 10) / 2)})
WIS: ${character.wis} (${Math.floor((character.wis - 10) / 2) >= 0 ? '+' : ''}${Math.floor((character.wis - 10) / 2)})
CHA: ${character.cha} (${Math.floor((character.cha - 10) / 2) >= 0 ? '+' : ''}${Math.floor((character.cha - 10) / 2)})

=== EQUIPMENT ===
${character.equipment}

=== FEATURES & TRAITS ===
${character.features}

=== SPELLS & ABILITIES ===
${character.spells}

=== NOTES ===
${character.notes}

Generated by D&D AI Assistant
            `.trim();
            
            // Create download
            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${character.characterName || 'character'}_sheet.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('Character exported successfully!', 'success');
            
        } catch (error) {
            console.error('Error exporting character:', error);
            showToast('Error exporting character', 'error');
        }
    }
    
    // Make character sheet functions globally available
    window.saveCharacterSheet = saveCharacterSheet;
    window.loadCharacterSheet = loadCharacterSheet;
    window.exportCharacterSheet = exportCharacterSheet;
    window.updateModifiers = updateModifiers;
    window.updateProficiencyBonus = updateProficiencyBonus;
    
    // Data Management Functions
    function clearAllData() {
        if (confirm('This will clear ALL saved data including character sheets, chat history, and combat state. Are you sure?')) {
            // Clear all localStorage items related to DND assistant
            localStorage.removeItem('dnd-character-sheet');
            localStorage.removeItem('dnd-chat-history');
            localStorage.removeItem('dnd-combat-state');
            localStorage.removeItem('dnd-active-tab');
            
            // Reset in-memory state
            window.aiState = {
                chatHistory: [],
                currentContext: 'general',
                combatants: [],
                combatActive: false,
                currentRound: 0,
                currentTurn: 0
            };
            
            // Reload page to reset UI
            location.reload();
        }
    }
    
    function exportAllData() {
        try {
            const allData = {
                characterSheet: JSON.parse(localStorage.getItem('dnd-character-sheet') || '{}'),
                chatHistory: JSON.parse(localStorage.getItem('dnd-chat-history') || '[]'),
                combatState: JSON.parse(localStorage.getItem('dnd-combat-state') || '{}'),
                activeTab: localStorage.getItem('dnd-active-tab') || 'character-sheet',
                exportedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dnd-assistant-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('All data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            showToast('Error exporting data: ' + error.message, 'error');
        }
    }

    // Make functions globally available
    window.aiEnhanced = {
        callDeepSeekAPI,
        showLoading,
        displayGeneratedContent,
        displayError,
        switchTab,
        generateCharacter,
        generateBackstory,
        rollStats,
        generateStory,
        generateNames,
        generateLoot,
        askRule,
        startCombat,
        nextTurn,
        endCombat,
        addCombatant,
        generateEnemy,
        damageCombatant,
        healCombatant,
        removeCombatant,
        importGeneratedCharacter,
        useGeneratedStats,
        addToCharacterEquipment,
        addToCombatFromCharacterSheet,
        saveCharacterSheet,
        loadCharacterSheet,
        exportCharacterSheet,
        updateModifiers,
        updateProficiencyBonus,
        clearAllData,
        exportAllData,
        saveChatHistory,
        loadChatHistory,
        saveCombatState,
        loadCombatState
    };
}); 