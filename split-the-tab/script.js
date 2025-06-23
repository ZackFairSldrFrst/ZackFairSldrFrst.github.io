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
        // Modal controls
        const createGroupBtn = document.getElementById('create-group-btn');
        if (createGroupBtn) {
            createGroupBtn.addEventListener('click', () => {
                this.showCreateGroupModal();
            });
        }
        
        const closeCreateModal = document.getElementById('close-create-modal');
        if (closeCreateModal) {
            closeCreateModal.addEventListener('click', () => {
                this.hideModal('create-group-modal');
            });
        }
        
        const closeEditModal = document.getElementById('close-edit-modal');
        if (closeEditModal) {
            closeEditModal.addEventListener('click', () => {
                this.hideModal('edit-group-modal');
            });
        }
        
        // User selection
        const userSelect = document.getElementById('current-user');
        if (userSelect) {
            userSelect.addEventListener('change', (e) => {
                this.currentUser = e.target.value;
                this.updateDashboard();
            });
        }
        
        // Member management
        const addMemberBtn = document.querySelector('.add-member');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => {
                this.addMemberInput();
            });
        }
        
        const addEditMemberBtn = document.querySelector('.add-edit-member');
        if (addEditMemberBtn) {
            addEditMemberBtn.addEventListener('click', () => {
                this.addEditMemberInput();
            });
        }
        
        // Remove member functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-member')) {
                e.target.closest('.member-item').remove();
            }
        });
        
        // Form submissions
        const createGroupForm = document.getElementById('create-group-form');
        if (createGroupForm) {
            createGroupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createGroup();
            });
        }
        
        const editGroupForm = document.getElementById('edit-group-form');
        if (editGroupForm) {
            editGroupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateGroupData();
            });
        }
        
        // Add expense form
        const addExpenseForm = document.getElementById('add-expense-form');
        if (addExpenseForm) {
            addExpenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExpense();
            });
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
        
        // Modal close buttons with data-modal attribute
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-close')) {
                const modalId = e.target.closest('.modal-close').dataset.modal;
                if (modalId) {
                    this.hideModal(modalId);
                }
            }
        });
        
        // Cancel buttons with data-modal attribute
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-secondary') && e.target.dataset.modal) {
                this.hideModal(e.target.dataset.modal);
            }
        });
        
        // Other event listeners...
        document.addEventListener('click', (e) => this.handleClick(e));
        document.addEventListener('submit', (e) => this.handleSubmit(e));
        document.addEventListener('change', (e) => this.handleChange(e));
    }

    handleClick(e) {
        const target = e.target;

        // Navigation buttons
        if (target.closest('.nav-btn')) {
            const btn = target.closest('.nav-btn');
            const view = btn.dataset.view;
            if (view) {
                this.switchView(view);
            }
            return;
        }

        // Dashboard buttons
        if (target.id === 'quick-add-expense' || target.closest('#quick-add-expense')) {
            this.showAddExpenseModal();
            return;
        }

        if (target.id === 'view-all-expenses' || target.closest('#view-all-expenses')) {
            this.switchView('expenses');
            return;
        }

        if (target.id === 'view-all-groups' || target.closest('#view-all-groups')) {
            this.switchView('groups');
            return;
        }

        if (target.id === 'add-first-expense' || target.closest('#add-first-expense')) {
            this.showAddExpenseModal();
            return;
        }

        if (target.id === 'create-first-group' || target.closest('#create-first-group')) {
            this.showCreateGroupModal();
            return;
        }

        // Groups view buttons
        if (target.id === 'create-group-btn' || target.closest('#create-group-btn')) {
            this.showCreateGroupModal();
            return;
        }

        if (target.id === 'create-group-empty' || target.closest('#create-group-empty')) {
            this.showCreateGroupModal();
            return;
        }

        // Expenses view buttons
        if (target.id === 'add-expense-btn' || target.closest('#add-expense-btn')) {
            this.showAddExpenseModal();
            return;
        }

        if (target.id === 'add-expense-empty' || target.closest('#add-expense-empty')) {
            this.showAddExpenseModal();
            return;
        }

        // Settlements view
        if (target.id === 'optimize-settlements' || target.closest('#optimize-settlements')) {
            this.optimizeSettlements();
            return;
        }

        // Member management
        if (target.classList.contains('add-member')) {
            this.addMemberInput();
            return;
        }

        if (target.classList.contains('remove-member')) {
            const memberTag = target.closest('.member-tag');
            if (memberTag) {
                this.removeMember(memberTag);
            }
            return;
        }

        // Group cards (for viewing details)
        if (target.closest('.group-card')) {
            // Don't trigger if clicking on interactive elements
            if (target.closest('.group-actions') || target.closest('.edit-group-btn')) {
                return;
            }
            
            const groupCard = target.closest('.group-card');
            const groupId = groupCard.dataset.groupId;
            if (groupId) {
                this.showGroupDetails(groupId);
            }
            return;
        }

        // Edit group button
        if (target.classList.contains('edit-group-btn')) {
            const groupId = target.dataset.groupId;
            if (groupId) {
                this.showEditGroupModal(groupId);
            }
            return;
        }

        // Edit group from details modal
        if (target.id === 'edit-group-from-details' || target.closest('#edit-group-from-details')) {
            const groupDetailsModal = document.getElementById('group-details-modal');
            const groupId = groupDetailsModal.dataset.currentGroupId;
            if (groupId) {
                this.hideModal('group-details-modal');
                this.showEditGroupModal(groupId);
            }
            return;
        }

        // Add expense to group button
        if (target.id === 'add-expense-to-group' || target.closest('#add-expense-to-group')) {
            this.hideModal('group-details-modal');
            this.showAddExpenseModal();
            return;
        }

        // Personal balance item
        if (target.classList.contains('personal-balance-item')) {
            const groupId = target.closest('.personal-balance-item').dataset.groupId;
            if (groupId) {
                this.showPersonalBalanceDetails(groupId);
            }
            return;
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        if (e.target.id === 'create-group-form') {
            this.createGroup();
            return;
        }

        if (e.target.id === 'edit-group-form') {
            this.updateGroupData();
            return;
        }

        if (e.target.id === 'add-expense-form') {
            this.addExpense();
            return;
        }
    }

    handleChange(e) {
        if (e.target.id === 'expense-filter') {
            this.filterExpenses(e.target.value);
            return;
        }

        if (e.target.id === 'split-equally' || e.target.id === 'split-custom') {
            this.toggleSplitOptions();
            return;
        }

        if (e.target.id === 'expense-group') {
            this.updateExpenseFormGroups();
            this.updateCustomSplitInputs();
            return;
        }
    }

    // View Management
    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-view="${viewName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        const activeView = document.getElementById(`${viewName}-view`);
        if (activeView) {
            activeView.classList.add('active');
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

    // Group Management
    showCreateGroupModal() {
        this.editingGroupId = null;
        this.showModal('create-group-modal');
        this.resetCreateGroupForm();
    }

    showEditGroupModal(groupId) {
        this.editingGroupId = groupId;
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;

        this.showModal('edit-group-modal');
        this.populateEditGroupForm(group);
        
        // Reset the member input field
        const memberInput = document.querySelector('#edit-group-modal .member-name');
        if (memberInput) {
            memberInput.value = '';
        }
    }

    populateEditGroupForm(group) {
        document.getElementById('edit-group-name').value = group.name;
        document.getElementById('edit-group-description').value = group.description;
        
        const membersList = document.getElementById('edit-members-list');
        membersList.innerHTML = '';
        
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

    resetCreateGroupForm() {
        document.getElementById('group-name').value = '';
        document.getElementById('group-description').value = '';
        document.querySelector('.member-name').value = '';
        document.getElementById('members-list').innerHTML = '';
    }

    // Add member input functionality
    addMemberInput() {
        const memberName = document.querySelector('.member-name').value.trim();
        if (memberName) {
            const membersList = document.getElementById('members-list');
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            memberItem.innerHTML = `
                <span>${memberName}</span>
                <button type="button" class="btn btn-icon remove-member">
                    <i class="fas fa-times"></i>
                </button>
            `;
            membersList.appendChild(memberItem);
            document.querySelector('.member-name').value = '';
        }
    }

    // Add edit member input functionality
    addEditMemberInput() {
        const memberName = document.querySelector('.edit-member-name').value.trim();
        if (memberName) {
            const membersList = document.getElementById('edit-members-list');
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            memberItem.innerHTML = `
                <span>${memberName}</span>
                <button type="button" class="btn btn-icon remove-member">
                    <i class="fas fa-times"></i>
                </button>
            `;
            membersList.appendChild(memberItem);
            document.querySelector('.edit-member-name').value = '';
        }
    }

    removeMember(memberTag) {
        if (memberTag && memberTag.classList.contains('member-item')) {
            memberTag.remove();
        }
    }

    async createGroup() {
        const name = document.getElementById('group-name').value.trim();
        const description = document.getElementById('group-description').value.trim();
        const memberItems = document.querySelectorAll('#members-list .member-item');
        const members = Array.from(memberItems).map(item => item.querySelector('span').textContent.trim());

        if (!name) {
            alert('Please provide a group name.');
            return;
        }

        if (members.length === 0) {
            alert('Please add at least one member to the group.');
            return;
        }

        try {
            const groupData = {
                name,
                description,
                members
            };

            await this.saveGroup(groupData);
            this.hideModal('create-group-modal');
            this.resetCreateGroupForm();
            
            // Show success message
            this.showNotification(`Group "${name}" created successfully!`, 'success');
        } catch (error) {
            alert('Error creating group. Please try again.');
            console.error('Error creating group:', error);
        }
    }

    async updateGroupData() {
        const name = document.getElementById('edit-group-name').value.trim();
        const description = document.getElementById('edit-group-description').value.trim();
        const memberItems = document.querySelectorAll('#edit-members-list .member-item');
        const members = Array.from(memberItems).map(item => item.querySelector('span').textContent.trim());

        if (!name) {
            alert('Please provide a group name.');
            return;
        }

        if (members.length === 0) {
            alert('Please add at least one member to the group.');
            return;
        }

        try {
            const groupData = {
                name,
                description,
                members
            };

            await this.updateGroup(this.editingGroupId, groupData);
            this.hideModal('edit-group-modal');
            
            // Show success message
            this.showNotification(`Group "${name}" updated successfully!`, 'success');
        } catch (error) {
            alert('Error updating group. Please try again.');
            console.error('Error updating group:', error);
        }
    }

    // Expense Management
    showAddExpenseModal() {
        this.showModal('add-expense-modal');
        this.resetAddExpenseForm();
        this.updateExpenseFormGroups();
    }

    resetAddExpenseForm() {
        document.getElementById('add-expense-form').reset();
        document.getElementById('custom-split-container').style.display = 'none';
        document.getElementById('split-equally').checked = true;
        document.getElementById('split-custom').checked = false;
    }

    updateExpenseFormGroups() {
        const groupSelect = document.getElementById('expense-group');
        const paidBySelect = document.getElementById('expense-paid-by');
        
        // Clear existing options
        groupSelect.innerHTML = '<option value="">Select a group</option>';
        paidBySelect.innerHTML = '<option value="">Select who paid</option>';

        this.groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            groupSelect.appendChild(option);
        });
    }

    toggleSplitOptions() {
        const splitEqually = document.getElementById('split-equally').checked;
        const customSplit = document.getElementById('split-custom').checked;
        const customContainer = document.getElementById('custom-split-container');

        if (customSplit) {
            customContainer.style.display = 'block';
            this.updateCustomSplitInputs();
        } else {
            customContainer.style.display = 'none';
        }
    }

    updateCustomSplitInputs() {
        const groupId = document.getElementById('expense-group').value;
        const group = this.groups.find(g => g.id === groupId);
        const container = document.getElementById('custom-split-inputs');
        
        if (!group) {
            container.innerHTML = '<p class="text-muted">Please select a group first</p>';
            return;
        }

        container.innerHTML = '';
        group.members.forEach(member => {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'custom-split-input';
            inputDiv.innerHTML = `
                <label>${member}:</label>
                <input type="number" class="custom-amount" data-member="${member}" min="0" step="0.01" placeholder="0.00">
            `;
            container.appendChild(inputDiv);
        });
    }

    async addExpense() {
        const groupId = document.getElementById('expense-group').value;
        const description = document.getElementById('expense-description').value.trim();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const paidBy = document.getElementById('expense-paid-by').value;
        const splitEqually = document.getElementById('split-equally').checked;

        if (!groupId) {
            alert('Please select a group.');
            return;
        }

        if (!description) {
            alert('Please enter a description for the expense.');
            return;
        }

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (!paidBy) {
            alert('Please select who paid for this expense.');
            return;
        }

        const group = this.groups.find(g => g.id === groupId);
        if (!group) {
            alert('Error finding group. Please try again.');
            return;
        }

        let splits = {};
        if (splitEqually) {
            const amountPerPerson = amount / group.members.length;
            group.members.forEach(member => {
                splits[member] = amountPerPerson;
            });
        } else {
            // Custom split
            const customInputs = document.querySelectorAll('.custom-amount');
            let totalCustomAmount = 0;
            
            customInputs.forEach(input => {
                const member = input.dataset.member;
                const customAmount = parseFloat(input.value) || 0;
                splits[member] = customAmount;
                totalCustomAmount += customAmount;
            });

            if (Math.abs(totalCustomAmount - amount) > 0.01) {
                alert(`The custom amounts add up to $${totalCustomAmount.toFixed(2)}, but the total is $${amount.toFixed(2)}. Please make sure they match.`);
                return;
            }
        }

        try {
            const expenseData = {
                groupId,
                description,
                amount,
                paidBy,
                splits,
                createdAt: new Date()
            };

            await this.saveExpense(expenseData);
            this.hideModal('add-expense-modal');
            this.resetAddExpenseForm();
            
            // Show success message
            this.showNotification(`Added "${description}" for ${this.formatCurrency(amount)}.`, 'success');
        } catch (error) {
            alert('Error adding expense. Please try again.');
            console.error('Error adding expense:', error);
        }
    }

    // Rendering Functions
    updateDashboard() {
        // Update summary stats
        document.getElementById('active-groups').textContent = this.groups.length;
        document.getElementById('total-expenses').textContent = this.expenses.length;
        
        const totalBalance = this.calculateTotalBalance();
        document.getElementById('total-balance').textContent = this.formatCurrency(totalBalance);
        
        const pendingSettlements = this.calculatePendingSettlements();
        document.getElementById('pending-settlements').textContent = pendingSettlements;
        
        if (totalBalance === 0) {
            document.getElementById('balance-status').textContent = 'All settled up! 🎉';
        } else {
            document.getElementById('balance-status').textContent = `${pendingSettlements} payments needed`;
        }

        // Update personal balances
        this.renderPersonalBalances();
        
        // Update other sections
        this.renderRecentExpenses();
        this.renderGroupBalances();
    }

    renderRecentExpenses() {
        const container = document.getElementById('recent-expenses-list');
        if (!container) return;

        const recentExpenses = this.expenses.slice(-5).reverse();

        if (recentExpenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No expenses yet</p>
                    <button class="btn btn-primary" onclick="app.showAddExpenseModal()">Add Your First Expense</button>
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

    renderGroupBalances() {
        const container = document.getElementById('group-balances-list');
        if (!container) return;
        
        if (this.groups.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No groups yet</p>
                    <button class="btn btn-primary" onclick="app.showCreateGroupModal()">Create Your First Group</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.groups.map(group => {
            const groupExpenses = this.expenses.filter(e => e.groupId === group.id);
            const totalAmount = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
            
            return `
                <div class="group-card" data-group-id="${group.id}">
                    <h3>${group.name}</h3>
                    <p>${group.description || 'No description'}</p>
                    <div class="group-stats">
                        <div class="group-stat">
                            <div class="group-stat-value">${this.formatCurrency(totalAmount)}</div>
                            <div class="group-stat-label">Total</div>
                        </div>
                        <div class="group-stat">
                            <div class="group-stat-value">${group.members.length}</div>
                            <div class="group-stat-label">Members</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderGroups() {
        const container = document.getElementById('groups-list');
        if (!container) return;
        
        if (this.groups.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No groups yet</p>
                    <button class="btn btn-primary" onclick="app.showCreateGroupModal()">Create Your First Group</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.groups.map(group => {
            const groupExpenses = this.expenses.filter(e => e.groupId === group.id);
            const totalAmount = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
            
            return `
                <div class="group-card" data-group-id="${group.id}">
                    <h3>${group.name}</h3>
                    <p>${group.description || 'No description'}</p>
                    <div class="group-stats">
                        <div class="group-stat">
                            <div class="group-stat-value">${this.formatCurrency(totalAmount)}</div>
                            <div class="group-stat-label">Total</div>
                        </div>
                        <div class="group-stat">
                            <div class="group-stat-value">${group.members.length}</div>
                            <div class="group-stat-label">Members</div>
                        </div>
                    </div>
                    <div class="group-actions">
                        <button class="btn btn-text edit-group-btn" data-group-id="${group.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderExpenses() {
        const container = document.getElementById('expenses-list');
        if (!container) return;

        const filter = document.getElementById('expense-filter');
        const filterValue = filter ? filter.value : 'all';
        
        let filteredExpenses = this.expenses;
        if (filterValue && filterValue !== 'all') {
            filteredExpenses = this.expenses.filter(e => e.groupId === filterValue);
        }

        if (filteredExpenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No expenses yet</p>
                    <button class="btn btn-primary" onclick="app.showAddExpenseModal()">Add Your First Expense</button>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredExpenses.map(expense => {
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

    filterExpenses(groupId) {
        this.renderExpenses();
    }

    // Group Details
    showGroupDetails(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;

        const titleEl = document.getElementById('group-details-title');
        const nameEl = document.getElementById('group-details-name');
        const descEl = document.getElementById('group-details-description');
        const totalEl = document.getElementById('group-total-expenses');
        const countEl = document.getElementById('group-member-count');
        const modalEl = document.getElementById('group-details-modal');

        if (titleEl) titleEl.textContent = group.name;
        if (nameEl) nameEl.textContent = group.name;
        if (descEl) descEl.textContent = group.description || 'No description';
        if (modalEl) modalEl.dataset.currentGroupId = groupId;

        const groupExpenses = this.expenses.filter(e => e.groupId === groupId);
        const totalAmount = groupExpenses.reduce((sum, e) => sum + e.amount, 0);

        if (totalEl) totalEl.textContent = this.formatCurrency(totalAmount);
        if (countEl) countEl.textContent = group.members.length;

        this.renderGroupBalancesDetails(groupId);
        this.renderGroupExpensesDetails(groupId);

        this.showModal('group-details-modal');
    }

    renderGroupBalancesDetails(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        const balances = this.calculateGroupBalances(groupId);
        const container = document.getElementById('group-balances-list');
        if (!container || !group) return;

        container.innerHTML = group.members.map(member => {
            const balance = balances[member] || 0;
            const balanceClass = balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'neutral';
            return `
                <div class="balance-item">
                    <span class="balance-name">${member}</span>
                    <span class="balance-amount ${balanceClass}">${this.formatCurrency(balance)}</span>
                </div>
            `;
        }).join('');
    }

    renderGroupExpensesDetails(groupId) {
        const groupExpenses = this.expenses.filter(e => e.groupId === groupId).slice(-10).reverse();
        const container = document.getElementById('group-expenses-list');
        if (!container) return;

        if (groupExpenses.length === 0) {
            container.innerHTML = '<p class="text-muted">No expenses in this group yet.</p>';
            return;
        }

        container.innerHTML = groupExpenses.map(expense => `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-description">${expense.description}</div>
                    <div class="expense-details">Paid by ${expense.paidBy}</div>
                </div>
                <div class="expense-amount">${this.formatCurrency(expense.amount)}</div>
            </div>
        `).join('');
    }

    // Settlement Management
    updateSettlements() {
        const settlements = this.calculateSettlements();
        const container = document.getElementById('settlements-container');
        if (!container) return;

        if (settlements.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-handshake"></i>
                    <p>No settlements needed</p>
                    <p class="text-muted">Everyone is settled up!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = settlements.map(settlement => `
            <div class="settlement-item">
                <div class="settlement-info">
                    <div><strong>${settlement.from}</strong> owes <strong>${settlement.to}</strong></div>
                    <div class="text-muted">${settlement.groupName}</div>
                </div>
                <div class="settlement-amount">${this.formatCurrency(settlement.amount)}</div>
            </div>
        `).join('');
    }

    optimizeSettlements() {
        const settlements = this.calculateSettlements();
        if (settlements.length === 0) {
            alert('No settlements needed!');
            return;
        }

        const optimized = this.optimizeSettlementPayments(settlements);
        const container = document.getElementById('settlements-container');
        if (!container) return;

        container.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <h4>Optimized Payments (${optimized.length} transactions)</h4>
                <p class="text-muted">Minimized number of payments needed</p>
            </div>
            ${optimized.map(settlement => `
                <div class="settlement-item">
                    <div class="settlement-info">
                        <div><strong>${settlement.from}</strong> pays <strong>${settlement.to}</strong></div>
                        <div class="text-muted">${settlement.groupName}</div>
                    </div>
                    <div class="settlement-amount">${this.formatCurrency(settlement.amount)}</div>
                </div>
            `).join('')}
        `;
    }

    // Calculation Functions
    calculateGroupBalances(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return {};

        const balances = {};
        group.members.forEach(member => {
            balances[member] = 0;
        });

        const groupExpenses = this.expenses.filter(e => e.groupId === groupId);
        groupExpenses.forEach(expense => {
            // Add what the payer paid
            balances[expense.paidBy] += expense.amount;
            
            // Subtract what each person owes
            Object.entries(expense.splits).forEach(([member, amount]) => {
                balances[member] -= amount;
            });
        });

        return balances;
    }

    calculateTotalBalance() {
        let totalBalance = 0;
        this.groups.forEach(group => {
            const balances = this.calculateGroupBalances(group.id);
            Object.values(balances).forEach(balance => {
                totalBalance += Math.abs(balance);
            });
        });
        return totalBalance / 2; // Divide by 2 because each debt is counted twice
    }

    calculatePendingSettlements() {
        const settlements = this.calculateSettlements();
        return settlements.length;
    }

    calculateSettlements() {
        const settlements = [];
        
        this.groups.forEach(group => {
            const balances = this.calculateGroupBalances(group.id);
            const members = Object.keys(balances);
            
            for (let i = 0; i < members.length; i++) {
                for (let j = i + 1; j < members.length; j++) {
                    const member1 = members[i];
                    const member2 = members[j];
                    const balance1 = balances[member1];
                    const balance2 = balances[member2];
                    
                    if (balance1 < 0 && balance2 > 0) {
                        const amount = Math.min(Math.abs(balance1), balance2);
                        settlements.push({
                            from: member1,
                            to: member2,
                            amount,
                            groupName: group.name
                        });
                    } else if (balance1 > 0 && balance2 < 0) {
                        const amount = Math.min(balance1, Math.abs(balance2));
                        settlements.push({
                            from: member2,
                            to: member1,
                            amount,
                            groupName: group.name
                        });
                    }
                }
            }
        });
        
        return settlements;
    }

    optimizeSettlementPayments(settlements) {
        // Simple optimization: group settlements by the same people
        const paymentMap = new Map();
        
        settlements.forEach(settlement => {
            const key = `${settlement.from}-${settlement.to}`;
            if (paymentMap.has(key)) {
                paymentMap.set(key, paymentMap.get(key) + settlement.amount);
            } else {
                paymentMap.set(key, settlement.amount);
            }
        });
        
        return Array.from(paymentMap.entries()).map(([key, amount]) => {
            const [from, to] = key.split('-');
            return { from, to, amount, groupName: 'Combined' };
        });
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    updateUserSelector() {
        const userSelect = document.getElementById('current-user');
        if (!userSelect) return;

        // Get all unique member names from all groups
        const allMembers = new Set();
        this.groups.forEach(group => {
            group.members.forEach(member => {
                allMembers.add(member);
            });
        });

        // Clear existing options
        userSelect.innerHTML = '<option value="">Select your name</option>';

        // Add member options
        Array.from(allMembers).sort().forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            userSelect.appendChild(option);
        });

        // Set current user if previously selected
        if (this.currentUser && allMembers.has(this.currentUser)) {
            userSelect.value = this.currentUser;
        }
    }

    calculatePersonalBalances() {
        if (!this.currentUser) return [];

        console.log('Calculating personal balances for:', this.currentUser);
        console.log('All expenses:', this.expenses);
        console.log('All groups:', this.groups);

        const personalBalances = [];

        this.groups.forEach(group => {
            const groupExpenses = this.expenses.filter(expense => expense.groupId === group.id);
            console.log(`Group ${group.name} expenses:`, groupExpenses);
            
            if (groupExpenses.length === 0) return; // Skip groups with no expenses

            let totalOwed = 0;
            let totalPaid = 0;

            groupExpenses.forEach(expense => {
                console.log(`Processing expense:`, expense);
                console.log(`Splits:`, expense.splits);
                console.log(`Paid by:`, expense.paidBy);
                
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
                
                totalOwed += userShare;
                console.log(`User owes: ${userShare}, total owed now: ${totalOwed}`);

                // How much this user paid for this expense
                if (expense.paidBy === this.currentUser) {
                    totalPaid += expense.amount;
                    console.log(`User paid: ${expense.amount}, total paid now: ${totalPaid}`);
                }
            });

            const balance = totalPaid - totalOwed;
            console.log(`Final balance for ${group.name}: ${balance} (paid: ${totalPaid}, owed: ${totalOwed})`);

            // Show balance even if it's 0, but only if there are expenses
            if (groupExpenses.length > 0) {
                personalBalances.push({
                    groupId: group.id,
                    groupName: group.name,
                    balance: balance,
                    totalOwed: totalOwed,
                    totalPaid: totalPaid
                });
            }
        });

        console.log('Final personal balances:', personalBalances);
        return personalBalances;
    }

    renderPersonalBalances() {
        const container = document.getElementById('my-balances-list');
        if (!container) return;

        if (!this.currentUser) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user"></i>
                    <p>Select your name above to see your balances</p>
                    <p class="text-muted">Choose your name from the dropdown to view your personal financial situation</p>
                </div>
            `;
            return;
        }

        const personalBalances = this.calculatePersonalBalances();

        if (personalBalances.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-handshake"></i>
                    <p>No expenses yet</p>
                    <p class="text-muted">Start adding expenses to see your balances</p>
                </div>
            `;
            return;
        }

        container.innerHTML = personalBalances.map(balance => {
            let balanceClass = 'neutral';
            let balanceText = 'All settled up!';
            
            if (balance.balance > 0) {
                balanceClass = 'positive';
                balanceText = `You're owed ${this.formatCurrency(balance.balance)}`;
            } else if (balance.balance < 0) {
                balanceClass = 'negative';
                balanceText = `You owe ${this.formatCurrency(Math.abs(balance.balance))}`;
            }
            
            return `
                <div class="personal-balance-item" data-group-id="${balance.groupId}">
                    <div class="personal-balance-info">
                        <div class="personal-balance-group">${balance.groupName}</div>
                        <div class="personal-balance-details">
                            Paid: ${this.formatCurrency(balance.totalPaid)} | 
                            Owed: ${this.formatCurrency(balance.totalOwed)}
                        </div>
                    </div>
                    <div class="personal-balance-amount ${balanceClass}">
                        ${balanceText}
                    </div>
                </div>
            `;
        }).join('');
    }

    showPersonalBalanceDetails(groupId) {
        if (!this.currentUser) return;

        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;

        const groupExpenses = this.expenses.filter(expense => expense.groupId === groupId);
        let totalOwed = 0;
        let totalPaid = 0;
        const expenseDetails = [];

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
            
            totalOwed += userShare;
            totalPaid += userPaid;

            if (userShare > 0 || userPaid > 0) {
                expenseDetails.push({
                    description: expense.description,
                    amount: expense.amount,
                    userShare: userShare,
                    userPaid: userPaid,
                    paidBy: expense.paidBy,
                    date: expense.createdAt
                });
            }
        });

        const balance = totalPaid - totalOwed;
        const balanceText = balance > 0 ? 
            `You're owed ${this.formatCurrency(balance)}` : 
            `You owe ${this.formatCurrency(Math.abs(balance))}`;

        // Create modal content
        const modalContent = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3>Your Balance in ${group.name}</h3>
                    <button class="modal-close" data-modal="personal-balance-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="balance-summary">
                        <div class="balance-overview">
                            <div class="balance-stat">
                                <span class="stat-label">Total Paid</span>
                                <span class="stat-value positive">${this.formatCurrency(totalPaid)}</span>
                            </div>
                            <div class="balance-stat">
                                <span class="stat-label">Total Owed</span>
                                <span class="stat-value negative">${this.formatCurrency(totalOwed)}</span>
                            </div>
                            <div class="balance-stat">
                                <span class="stat-label">Net Balance</span>
                                <span class="stat-value ${balance > 0 ? 'positive' : 'negative'}">${balanceText}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="expense-breakdown">
                        <h4>Expense Breakdown</h4>
                        <div class="expense-list">
                            ${expenseDetails.map(expense => `
                                <div class="expense-item">
                                    <div class="expense-info">
                                        <div class="expense-description">${expense.description}</div>
                                        <div class="expense-details">
                                            Total: ${this.formatCurrency(expense.amount)} | 
                                            Paid by: ${expense.paidBy}
                                        </div>
                                    </div>
                                    <div class="expense-user-amounts">
                                        <div class="amount-item">
                                            <span class="amount-label">Your share:</span>
                                            <span class="amount-value">${this.formatCurrency(expense.userShare)}</span>
                                        </div>
                                        ${expense.userPaid > 0 ? `
                                            <div class="amount-item">
                                                <span class="amount-label">You paid:</span>
                                                <span class="amount-value positive">${this.formatCurrency(expense.userPaid)}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-modal="personal-balance-modal">Close</button>
                </div>
            </div>
        `;

        // Show modal
        this.showCustomModal('personal-balance-modal', modalContent);
    }

    showCustomModal(modalId, content) {
        // Remove existing modal if any
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }

        // Create new modal
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal active';
        modal.innerHTML = content;

        // Add to page
        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal(modalId);
            });
        }

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modalId);
            }
        });
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for Firebase to be available
    while (!window.db) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    window.app = new SplitTab();
    await window.app.init();
    window.app.bindEvents();
});

// Update expense filter dropdown
function updateExpenseFilter() {
    const filter = document.getElementById('expense-filter');
    if (!filter) return;
    
    filter.innerHTML = '<option value="all">All Groups</option>';
    
    if (window.app && window.app.groups) {
        window.app.groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            filter.appendChild(option);
        });
    }
}

// Update the filter when groups change
const originalRenderGroups = SplitTab.prototype.renderGroups;
SplitTab.prototype.renderGroups = function() {
    originalRenderGroups.call(this);
    updateExpenseFilter();
}; 