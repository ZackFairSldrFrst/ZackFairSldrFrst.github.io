// SplitTab - Splitwise Alternative with Firebase Firestore
class SplitTab {
    constructor() {
        this.groups = [];
        this.expenses = [];
        this.currentView = 'dashboard';
        this.currentUser = '';
        this.db = window.db;
        this.editingGroupId = null;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupRealtimeListeners();
        this.updateDashboard();
        this.renderGroups();
        this.renderExpenses();
        this.updateSettlements();
        this.updateUserSelector();
        this.bindEvents();
    }

    // Firebase Data Management
    async loadData() {
        try {
            // Load groups
            const groupsSnapshot = await this.db.collection('groups').get();
            this.groups = groupsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load expenses
            const expensesSnapshot = await this.db.collection('expenses').get();
            this.expenses = expensesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupRealtimeListeners() {
        // Listen for real-time updates to groups
        this.db.collection('groups').onSnapshot((snapshot) => {
            this.groups = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.updateDashboard();
            this.renderGroups();
            this.updateExpenseFormGroups();
            this.updateUserSelector();
        });

        // Listen for real-time updates to expenses
        this.db.collection('expenses').onSnapshot((snapshot) => {
            this.expenses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.updateDashboard();
            this.renderExpenses();
            this.updateSettlements();
        });
    }

    async saveGroup(groupData) {
        try {
            const docRef = await this.db.collection('groups').add({
                ...groupData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving group:', error);
            throw error;
        }
    }

    async updateGroup(groupId, groupData) {
        try {
            await this.db.collection('groups').doc(groupId).update({
                ...groupData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating group:', error);
            throw error;
        }
    }

    async saveExpense(expenseData) {
        try {
            const docRef = await this.db.collection('expenses').add({
                ...expenseData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving expense:', error);
            throw error;
        }
    }

    // Event Binding
    bindEvents() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn')) {
                const view = e.target.closest('.nav-btn').dataset.view;
                this.switchView(view);
            }
        });

        // User selection
        const userSelect = document.getElementById('userSelect');
        if (userSelect) {
            userSelect.addEventListener('change', (e) => {
                this.currentUser = e.target.value;
                this.updateDashboard();
            });
        }

        // Member management
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-member')) {
                e.target.closest('.member-item').remove();
            }
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            }
        });

        // Split options toggle
        document.addEventListener('change', (e) => {
            if (e.target.id === 'customSplit') {
                this.toggleSplitOptions();
            }
        });

        // Group selection in expense form
        document.addEventListener('change', (e) => {
            if (e.target.id === 'expenseGroup') {
                this.updateExpenseFormMembers();
            }
        });

        // Group actions (view details, edit, delete)
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="view-group"]')) {
                const groupId = e.target.closest('[data-action="view-group"]').dataset.groupId;
                this.showGroupDetails(groupId);
            }
            
            if (e.target.closest('[data-action="edit-group"]')) {
                const groupId = e.target.closest('[data-action="edit-group"]').dataset.groupId;
                this.showEditGroupModal(groupId);
            }
            
            if (e.target.closest('[data-action="delete-group"]')) {
                const groupId = e.target.closest('[data-action="delete-group"]').dataset.groupId;
                if (confirm('Are you sure you want to delete this group? This will also delete all associated expenses.')) {
                    this.deleteGroup(groupId);
                }
            }
        });

        // Personal balance items
        document.addEventListener('click', (e) => {
            if (e.target.closest('.personal-balance-item')) {
                const groupId = e.target.closest('.personal-balance-item').dataset.groupId;
                this.showPersonalBalanceDetails(groupId);
            }
        });
    }

    // Navigation
    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected view
        const selectedView = document.getElementById(viewName);
        if (selectedView) {
            selectedView.classList.add('active');
        }
        
        // Add active class to nav button
        const activeBtn = document.querySelector(`[data-view="${viewName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        this.currentView = viewName;
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    // Member Management
    addMember() {
        const memberInput = document.getElementById('memberInput');
        const membersList = document.getElementById('membersList');
        
        if (memberInput && membersList && memberInput.value.trim()) {
            const memberName = memberInput.value.trim();
            
            // Check if member already exists
            const existingMembers = Array.from(membersList.children).map(item => 
                item.querySelector('span').textContent
            );
            
            if (existingMembers.includes(memberName)) {
                this.showNotification('Member already exists in this group', 'error');
                return;
            }
            
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            memberItem.innerHTML = `
                <span>${memberName}</span>
                <button type="button" class="btn btn-icon remove-member">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            membersList.appendChild(memberItem);
            memberInput.value = '';
        }
    }

    addEditMember() {
        const memberInput = document.getElementById('editMemberInput');
        const membersList = document.getElementById('editMembersList');
        
        if (memberInput && membersList && memberInput.value.trim()) {
            const memberName = memberInput.value.trim();
            
            // Check if member already exists
            const existingMembers = Array.from(membersList.children).map(item => 
                item.querySelector('span').textContent
            );
            
            if (existingMembers.includes(memberName)) {
                this.showNotification('Member already exists in this group', 'error');
                return;
            }
            
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            memberItem.innerHTML = `
                <span>${memberName}</span>
                <button type="button" class="btn btn-icon remove-member">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            membersList.appendChild(memberItem);
            memberInput.value = '';
        }
    }

    // Group Management
    async createGroup() {
        const groupName = document.getElementById('groupName').value.trim();
        const groupDescription = document.getElementById('groupDescription').value.trim();
        const membersList = document.getElementById('membersList');
        
        if (!groupName) {
            this.showNotification('Please enter a group name', 'error');
            return;
        }
        
        const members = Array.from(membersList.children).map(item => 
            item.querySelector('span').textContent
        );
        
        if (members.length === 0) {
            this.showNotification('Please add at least one member to the group', 'error');
            return;
        }
        
        try {
            const groupData = {
                name: groupName,
                description: groupDescription,
                members: members,
                createdBy: this.currentUser || 'Unknown'
            };
            
            await this.saveGroup(groupData);
            this.hideModal('newGroupModal');
            this.resetCreateGroupForm();
            this.showNotification('Group created successfully!', 'success');
        } catch (error) {
            this.showNotification('Error creating group: ' + error.message, 'error');
        }
    }

    async saveGroupEdit() {
        const groupName = document.getElementById('editGroupName').value.trim();
        const groupDescription = document.getElementById('editGroupDescription').value.trim();
        const membersList = document.getElementById('editMembersList');
        
        if (!groupName) {
            this.showNotification('Please enter a group name', 'error');
            return;
        }
        
        const members = Array.from(membersList.children).map(item => 
            item.querySelector('span').textContent
        );
        
        if (members.length === 0) {
            this.showNotification('Please add at least one member to the group', 'error');
            return;
        }
        
        try {
            const groupData = {
                name: groupName,
                description: groupDescription,
                members: members
            };
            
            await this.updateGroup(this.editingGroupId, groupData);
            this.hideModal('editGroupModal');
            this.showNotification('Group updated successfully!', 'success');
        } catch (error) {
            this.showNotification('Error updating group: ' + error.message, 'error');
        }
    }

    showEditGroupModal(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;
        
        this.editingGroupId = groupId;
        
        document.getElementById('editGroupName').value = group.name || '';
        document.getElementById('editGroupDescription').value = group.description || '';
        
        const membersList = document.getElementById('editMembersList');
        membersList.innerHTML = '';
        
        if (group.members) {
            group.members.forEach(member => {
                const memberItem = document.createElement('div');
                memberItem.className = 'member-item';
                memberItem.innerHTML = `
                    <span>${member}</span>
                    <button type="button" class="btn btn-icon remove-member">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                membersList.appendChild(memberItem);
            });
        }
        
        this.showModal('editGroupModal');
    }

    async deleteGroup(groupId) {
        try {
            // Delete all expenses in this group
            const groupExpenses = this.expenses.filter(expense => expense.groupId === groupId);
            for (const expense of groupExpenses) {
                await this.db.collection('expenses').doc(expense.id).delete();
            }
            
            // Delete the group
            await this.db.collection('groups').doc(groupId).delete();
            this.showNotification('Group deleted successfully!', 'success');
        } catch (error) {
            this.showNotification('Error deleting group: ' + error.message, 'error');
        }
    }

    resetCreateGroupForm() {
        document.getElementById('newGroupForm').reset();
        document.getElementById('membersList').innerHTML = '';
    }

    // Expense Management
    async createExpense() {
        const groupId = document.getElementById('expenseGroup').value;
        const description = document.getElementById('expenseDescription').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const paidBy = document.getElementById('expensePaidBy').value;
        const splitEqually = document.getElementById('splitEqually').checked;
        const customSplit = document.getElementById('customSplit').checked;
        
        if (!groupId || !description || !amount || !paidBy) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const group = this.groups.find(g => g.id === groupId);
        if (!group) {
            this.showNotification('Selected group not found', 'error');
            return;
        }
        
        let splits = {};
        
        if (splitEqually) {
            const shareAmount = amount / group.members.length;
            group.members.forEach(member => {
                splits[member] = shareAmount;
            });
        } else if (customSplit) {
            const customInputs = document.querySelectorAll('#customSplitInputs input');
            let totalSplit = 0;
            
            customInputs.forEach(input => {
                const member = input.dataset.member;
                const value = parseFloat(input.value) || 0;
                splits[member] = value;
                totalSplit += value;
            });
            
            if (Math.abs(totalSplit - amount) > 0.01) {
                this.showNotification('Custom split amounts must equal the total expense amount', 'error');
                return;
            }
        }
        
        try {
            const expenseData = {
                groupId: groupId,
                description: description,
                amount: amount,
                paidBy: paidBy,
                splits: splits,
                splitEqually: splitEqually,
                createdBy: this.currentUser || 'Unknown'
            };
            
            await this.saveExpense(expenseData);
            this.hideModal('newExpenseModal');
            this.resetAddExpenseForm();
            this.showNotification('Expense added successfully!', 'success');
        } catch (error) {
            this.showNotification('Error adding expense: ' + error.message, 'error');
        }
    }

    resetAddExpenseForm() {
        document.getElementById('newExpenseForm').reset();
        document.getElementById('customSplitSection').style.display = 'none';
        document.getElementById('customSplitInputs').innerHTML = '';
    }

    updateExpenseFormGroups() {
        const groupSelect = document.getElementById('expenseGroup');
        const paidBySelect = document.getElementById('expensePaidBy');
        
        if (groupSelect) {
            groupSelect.innerHTML = '<option value="">Select a group...</option>';
            this.groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                groupSelect.appendChild(option);
            });
        }
        
        if (paidBySelect) {
            paidBySelect.innerHTML = '<option value="">Who paid for this?</option>';
        }
    }

    updateExpenseFormMembers() {
        const groupId = document.getElementById('expenseGroup').value;
        const paidBySelect = document.getElementById('expensePaidBy');
        const customSplitInputs = document.getElementById('customSplitInputs');
        
        if (!groupId) {
            paidBySelect.innerHTML = '<option value="">Who paid for this?</option>';
            return;
        }
        
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;
        
        // Update paid by options
        paidBySelect.innerHTML = '<option value="">Who paid for this?</option>';
        group.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            paidBySelect.appendChild(option);
        });
        
        // Update custom split inputs
        customSplitInputs.innerHTML = '';
        group.members.forEach(member => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'custom-split-input';
            inputGroup.innerHTML = `
                <label>${member}</label>
                <input type="number" data-member="${member}" step="0.01" min="0" placeholder="0.00">
            `;
            customSplitInputs.appendChild(inputGroup);
        });
    }

    toggleSplitOptions() {
        const splitEqually = document.getElementById('splitEqually');
        const customSplit = document.getElementById('customSplit');
        const customSplitSection = document.getElementById('customSplitSection');
        
        if (customSplit.checked) {
            splitEqually.checked = false;
            customSplitSection.style.display = 'block';
            this.updateExpenseFormMembers();
        } else {
            splitEqually.checked = true;
            customSplitSection.style.display = 'none';
        }
    }

    // Dashboard Updates
    updateDashboard() {
        this.updateSummaryCards();
        this.renderPersonalBalances();
        this.renderRecentActivity();
    }

    updateSummaryCards() {
        const totalBalance = this.calculateTotalBalance();
        const totalGroups = this.groups.length;
        const totalExpenses = this.expenses.length;
        
        document.getElementById('totalBalance').textContent = this.formatCurrency(totalBalance);
        document.getElementById('totalGroups').textContent = totalGroups;
        document.getElementById('totalExpenses').textContent = totalExpenses;
        
        const balanceStatus = document.getElementById('balanceStatus');
        if (totalBalance > 0) {
            balanceStatus.textContent = 'You are owed money!';
        } else if (totalBalance < 0) {
            balanceStatus.textContent = 'You owe money';
        } else {
            balanceStatus.textContent = 'All settled up!';
        }
    }

    renderPersonalBalances() {
        const container = document.getElementById('personalBalances');
        if (!container) return;
        
        const personalBalances = this.calculatePersonalBalances();
        
        if (personalBalances.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wallet"></i>
                    <p>No balances to show</p>
                    <div class="text-muted">Join a group and add some expenses to see your balances here</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = personalBalances.map(balance => `
            <div class="personal-balance-item" data-group-id="${balance.groupId}">
                <div class="personal-balance-info">
                    <div class="personal-balance-group">${balance.groupName}</div>
                    <div class="personal-balance-details">
                        ${balance.owed > 0 ? `You are owed $${this.formatCurrency(balance.owed)}` : 
                          balance.owes > 0 ? `You owe $${this.formatCurrency(balance.owes)}` : 
                          'All settled up'}
                    </div>
                </div>
                <div class="personal-balance-amount ${balance.net > 0 ? 'positive' : balance.net < 0 ? 'negative' : 'neutral'}">
                    ${balance.net > 0 ? '+' : ''}${this.formatCurrency(balance.net)}
                </div>
            </div>
        `).join('');
    }

    renderRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        const recentExpenses = this.expenses
            .sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt || 0) - new Date(a.createdAt?.toDate?.() || a.createdAt || 0))
            .slice(0, 5);
        
        if (recentExpenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>No recent activity</p>
                    <div class="text-muted">Your recent expenses and settlements will appear here</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentExpenses.map(expense => {
            const group = this.groups.find(g => g.id === expense.groupId);
            return `
                <div class="expense-item">
                    <div class="expense-info">
                        <div class="expense-description">${expense.description}</div>
                        <div class="expense-details">
                            ${group ? group.name : 'Unknown Group'} • Paid by ${expense.paidBy}
                        </div>
                    </div>
                    <div class="expense-amount">${this.formatCurrency(expense.amount)}</div>
                </div>
            `;
        }).join('');
    }

    // Groups Rendering
    renderGroups() {
        const container = document.getElementById('groupsContainer');
        if (!container) return;
        
        if (this.groups.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No groups yet</p>
                    <div class="text-muted">Create your first group to start splitting expenses</div>
                    <button class="btn btn-primary" onclick="showModal('newGroupModal')">
                        <i class="fas fa-plus"></i>
                        Create Group
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="groups-grid">
                ${this.groups.map(group => {
                    const groupExpenses = this.expenses.filter(expense => expense.groupId === group.id);
                    const totalExpenses = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                    const memberCount = group.members ? group.members.length : 0;
                    
                    return `
                        <div class="group-card" data-action="view-group" data-group-id="${group.id}">
                            <h3>${group.name}</h3>
                            <p>${group.description || 'No description'}</p>
                            <div class="group-stats">
                                <div class="group-stat">
                                    <div class="stat-number">${memberCount}</div>
                                    <div class="stat-label">Members</div>
                                </div>
                                <div class="group-stat">
                                    <div class="stat-number">${groupExpenses.length}</div>
                                    <div class="stat-label">Expenses</div>
                                </div>
                                <div class="group-stat">
                                    <div class="stat-number">${this.formatCurrency(totalExpenses)}</div>
                                    <div class="stat-label">Total</div>
                                </div>
                            </div>
                            <div class="group-actions">
                                <button class="btn btn-secondary" data-action="edit-group" data-group-id="${group.id}">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>
                                <button class="btn btn-secondary" data-action="delete-group" data-group-id="${group.id}">
                                    <i class="fas fa-trash"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Expenses Rendering
    renderExpenses() {
        const container = document.getElementById('expensesContainer');
        if (!container) return;
        
        if (this.expenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No expenses yet</p>
                    <div class="text-muted">Add your first expense to start tracking</div>
                    <button class="btn btn-primary" onclick="showModal('newExpenseModal')">
                        <i class="fas fa-plus"></i>
                        Add Expense
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="expenses-container">
                ${this.expenses.map(expense => {
                    const group = this.groups.find(g => g.id === expense.groupId);
                    return `
                        <div class="expense-item">
                            <div class="expense-info">
                                <div class="expense-description">${expense.description}</div>
                                <div class="expense-details">
                                    ${group ? group.name : 'Unknown Group'} • Paid by ${expense.paidBy}
                                </div>
                            </div>
                            <div class="expense-amount">${this.formatCurrency(expense.amount)}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Group Details
    showGroupDetails(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;
        
        const groupExpenses = this.expenses.filter(expense => expense.groupId === groupId);
        const totalExpenses = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalPaid = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        document.getElementById('groupDetailsTitle').textContent = group.name;
        document.getElementById('groupTotalExpenses').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('groupTotalPaid').textContent = this.formatCurrency(totalPaid);
        document.getElementById('groupOutstanding').textContent = this.formatCurrency(0); // Simplified for now
        
        const expensesList = document.getElementById('groupExpensesList');
        if (groupExpenses.length === 0) {
            expensesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No expenses yet</p>
                    <div class="text-muted">Add the first expense to this group</div>
                </div>
            `;
        } else {
            expensesList.innerHTML = `
                <div class="expenses-container">
                    ${groupExpenses.map(expense => `
                        <div class="expense-item">
                            <div class="expense-info">
                                <div class="expense-description">${expense.description}</div>
                                <div class="expense-details">Paid by ${expense.paidBy}</div>
                            </div>
                            <div class="expense-amount">${this.formatCurrency(expense.amount)}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        this.showModal('groupDetailsModal');
    }

    // Personal Balance Details
    showPersonalBalanceDetails(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;
        
        const groupExpenses = this.expenses.filter(expense => expense.groupId === groupId);
        const personalBalances = this.calculatePersonalBalances();
        const userBalance = personalBalances.find(b => b.groupId === groupId);
        
        if (!userBalance) return;
        
        const detailsContainer = document.getElementById('personalBalanceDetails');
        detailsContainer.innerHTML = `
            <div class="balance-summary">
                <div class="balance-overview">
                    <div class="balance-stat">
                        <div class="stat-label">You are owed</div>
                        <div class="stat-value positive">${this.formatCurrency(userBalance.owed)}</div>
                    </div>
                    <div class="balance-stat">
                        <div class="stat-label">You owe</div>
                        <div class="stat-value negative">${this.formatCurrency(userBalance.owes)}</div>
                    </div>
                    <div class="balance-stat">
                        <div class="stat-label">Net Balance</div>
                        <div class="stat-value ${userBalance.net > 0 ? 'positive' : userBalance.net < 0 ? 'negative' : ''}">
                            ${userBalance.net > 0 ? '+' : ''}${this.formatCurrency(userBalance.net)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-list"></i> Expense Breakdown</h3>
                </div>
                <div class="card-content">
                    <div class="expense-breakdown">
                        <div class="expense-list">
                            ${groupExpenses.map(expense => {
                                // Calculate user's share dynamically based on current group members
                                let userShare = 0;
                                if (expense.splits && expense.splits[this.currentUser]) {
                                    // If the user was already in the group when expense was created
                                    userShare = expense.splits[this.currentUser];
                                } else if (group.members.includes(this.currentUser)) {
                                    // User was added after expense was created, calculate their share
                                    if (expense.splitEqually !== false) {
                                        // Split equally among current members
                                        userShare = expense.amount / group.members.length;
                                    } else {
                                        // Custom split - if user wasn't in original split, they owe 0
                                        userShare = 0;
                                    }
                                }
                                
                                const userPaid = expense.paidBy === this.currentUser ? expense.amount : 0;
                                const userNet = userPaid - userShare;
                                
                                return `
                                    <div class="expense-item">
                                        <div class="expense-info">
                                            <div class="expense-description">${expense.description}</div>
                                            <div class="expense-details">Paid by ${expense.paidBy}</div>
                                        </div>
                                        <div class="expense-user-amounts">
                                            <div class="amount-item">
                                                <span class="amount-label">You paid:</span>
                                                <span class="amount-value">${this.formatCurrency(userPaid)}</span>
                                            </div>
                                            <div class="amount-item">
                                                <span class="amount-label">Your share:</span>
                                                <span class="amount-value">${this.formatCurrency(userShare)}</span>
                                            </div>
                                            <div class="amount-item">
                                                <span class="amount-label">Net:</span>
                                                <span class="amount-value ${userNet > 0 ? 'positive' : userNet < 0 ? 'negative' : ''}">
                                                    ${userNet > 0 ? '+' : ''}${this.formatCurrency(userNet)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal('personalBalanceModal');
    }

    // Calculations
    calculatePersonalBalances() {
        if (!this.currentUser) return [];
        
        const balances = [];
        
        this.groups.forEach(group => {
            const groupExpenses = this.expenses.filter(expense => expense.groupId === group.id);
            
            let totalOwed = 0;
            let totalOwes = 0;
            
            groupExpenses.forEach(expense => {
                // Calculate user's share dynamically based on current group members
                let userShare = 0;
                if (expense.splits && expense.splits[this.currentUser]) {
                    // If the user was already in the group when expense was created
                    userShare = expense.splits[this.currentUser];
                } else if (group.members.includes(this.currentUser)) {
                    // User was added after expense was created, calculate their share
                    if (expense.splitEqually !== false) {
                        // Split equally among current members
                        userShare = expense.amount / group.members.length;
                    } else {
                        // Custom split - if user wasn't in original split, they owe 0
                        userShare = 0;
                    }
                }
                
                const userPaid = expense.paidBy === this.currentUser ? expense.amount : 0;
                const net = userPaid - userShare;
                
                if (net > 0) {
                    totalOwed += net;
                } else {
                    totalOwes += Math.abs(net);
                }
            });
            
            const netBalance = totalOwed - totalOwes;
            
            if (totalOwed > 0 || totalOwes > 0) {
                balances.push({
                    groupId: group.id,
                    groupName: group.name,
                    owed: totalOwed,
                    owes: totalOwes,
                    net: netBalance
                });
            }
        });
        
        return balances;
    }

    calculateTotalBalance() {
        const personalBalances = this.calculatePersonalBalances();
        return personalBalances.reduce((total, balance) => total + balance.net, 0);
    }

    updateSettlements() {
        // This method is kept for compatibility but simplified
        // Settlements are now shown in personal balances
    }

    updateUserSelector() {
        const userSelect = document.getElementById('userSelect');
        if (!userSelect) return;
        
        // Get all unique users from groups
        const allUsers = new Set();
        this.groups.forEach(group => {
            if (group.members) {
                group.members.forEach(member => allUsers.add(member));
            }
        });
        
        // Clear existing options except the first one
        userSelect.innerHTML = '<option value="">Select yourself...</option>';
        
        // Add user options
        Array.from(allUsers).sort().forEach(user => {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            userSelect.appendChild(option);
        });
        
        // Set current user if it exists in the list
        if (this.currentUser && allUsers.has(this.currentUser)) {
            userSelect.value = this.currentUser;
        }
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${message}</div>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Global functions for onclick handlers
function showModal(modalId) {
    if (window.splitTab) {
        window.splitTab.showModal(modalId);
    }
}

function closeModal(modalId) {
    if (window.splitTab) {
        window.splitTab.hideModal(modalId);
    }
}

function createGroup() {
    if (window.splitTab) {
        window.splitTab.createGroup();
    }
}

function createExpense() {
    if (window.splitTab) {
        window.splitTab.createExpense();
    }
}

function saveGroupEdit() {
    if (window.splitTab) {
        window.splitTab.saveGroupEdit();
    }
}

function addMember() {
    if (window.splitTab) {
        window.splitTab.addMember();
    }
}

function addEditMember() {
    if (window.splitTab) {
        window.splitTab.addEditMember();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is available
    if (typeof firebase !== 'undefined') {
        window.splitTab = new SplitTab();
    } else {
        console.error('Firebase not loaded. Please check your Firebase configuration.');
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: white;">
                <h2>Firebase Configuration Error</h2>
                <p>Please ensure Firebase is properly configured.</p>
            </div>
        `;
    }
}); 