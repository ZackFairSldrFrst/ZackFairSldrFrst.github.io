// SplitTab - Splitwise Alternative with Firebase Firestore
import { 
    collection, 
    addDoc, 
    getDocs, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

class SplitTab {
    constructor() {
        this.groups = [];
        this.expenses = [];
        this.currentView = 'dashboard';
        this.db = window.db;
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadData();
        this.setupRealtimeListeners();
        this.updateDashboard();
        this.renderGroups();
        this.renderExpenses();
        this.updateSettlements();
    }

    // Firebase Data Management
    async loadData() {
        try {
            // Load groups
            const groupsSnapshot = await getDocs(collection(this.db, 'groups'));
            this.groups = groupsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load expenses
            const expensesSnapshot = await getDocs(collection(this.db, 'expenses'));
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
        onSnapshot(collection(this.db, 'groups'), (snapshot) => {
            this.groups = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.updateDashboard();
            this.renderGroups();
            this.updateExpenseFormGroups();
        });

        // Listen for real-time updates to expenses
        onSnapshot(collection(this.db, 'expenses'), (snapshot) => {
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
            const docRef = await addDoc(collection(this.db, 'groups'), {
                ...groupData,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error saving group:', error);
            throw error;
        }
    }

    async saveExpense(expenseData) {
        try {
            const docRef = await addDoc(collection(this.db, 'expenses'), {
                ...expenseData,
                createdAt: serverTimestamp()
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
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Dashboard buttons
        document.getElementById('quick-add-expense').addEventListener('click', () => this.showAddExpenseModal());
        document.getElementById('view-all-expenses').addEventListener('click', () => this.switchView('expenses'));
        document.getElementById('view-all-groups').addEventListener('click', () => this.switchView('groups'));
        document.getElementById('add-first-expense').addEventListener('click', () => this.showAddExpenseModal());
        document.getElementById('create-first-group').addEventListener('click', () => this.showCreateGroupModal());

        // Groups view
        document.getElementById('create-group-btn').addEventListener('click', () => this.showCreateGroupModal());
        document.getElementById('create-group-empty').addEventListener('click', () => this.showCreateGroupModal());

        // Expenses view
        document.getElementById('add-expense-btn').addEventListener('click', () => this.showAddExpenseModal());
        document.getElementById('add-expense-empty').addEventListener('click', () => this.showAddExpenseModal());
        document.getElementById('expense-filter').addEventListener('change', (e) => this.filterExpenses(e.target.value));

        // Settlements view
        document.getElementById('optimize-settlements').addEventListener('click', () => this.optimizeSettlements());

        // Modal events
        this.bindModalEvents();
        this.bindFormEvents();
    }

    bindModalEvents() {
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                this.hideModal(modalId);
            });
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    bindFormEvents() {
        // Create group form
        document.getElementById('create-group-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createGroup();
        });

        // Add expense form
        document.getElementById('add-expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Member management
        document.querySelector('.add-member').addEventListener('click', () => this.addMemberInput());
        document.getElementById('members-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-member')) {
                this.removeMember(e.target.parentElement);
            }
        });

        // Split options
        document.getElementById('split-equally').addEventListener('change', () => this.toggleSplitOptions());
        document.getElementById('split-custom').addEventListener('change', () => this.toggleSplitOptions());
    }

    // View Management
    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');

        this.currentView = viewName;
    }

    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    // Group Management
    showCreateGroupModal() {
        this.showModal('create-group-modal');
        this.resetCreateGroupForm();
    }

    resetCreateGroupForm() {
        document.getElementById('create-group-form').reset();
        document.getElementById('members-list').innerHTML = '';
        document.querySelector('.member-name').value = '';
    }

    addMemberInput() {
        const memberName = document.querySelector('.member-name').value.trim();
        if (!memberName) return;

        const membersList = document.getElementById('members-list');
        const memberTag = document.createElement('div');
        memberTag.className = 'member-tag';
        memberTag.innerHTML = `
            ${memberName}
            <button type="button" class="remove-member">×</button>
        `;
        membersList.appendChild(memberTag);

        document.querySelector('.member-name').value = '';
    }

    removeMember(memberTag) {
        memberTag.remove();
    }

    async createGroup() {
        const name = document.getElementById('group-name').value.trim();
        const description = document.getElementById('group-description').value.trim();
        const memberTags = document.querySelectorAll('.member-tag');
        const members = Array.from(memberTags).map(tag => tag.textContent.replace('×', '').trim());

        if (!name || members.length === 0) {
            alert('Please provide a group name and at least one member.');
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
        } catch (error) {
            alert('Error creating group. Please try again.');
            console.error('Error creating group:', error);
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
        
        if (!group) return;

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

        if (!groupId || !description || !amount || !paidBy) {
            alert('Please fill in all required fields.');
            return;
        }

        const group = this.groups.find(g => g.id === groupId);
        if (!group) return;

        let splits = {};
        if (splitEqually) {
            const splitAmount = amount / group.members.length;
            group.members.forEach(member => {
                splits[member] = splitAmount;
            });
        } else {
            const customInputs = document.querySelectorAll('.custom-amount');
            let totalCustom = 0;
            customInputs.forEach(input => {
                const memberAmount = parseFloat(input.value) || 0;
                splits[input.dataset.member] = memberAmount;
                totalCustom += memberAmount;
            });

            if (Math.abs(totalCustom - amount) > 0.01) {
                alert('Custom split amounts must equal the total expense amount.');
                return;
            }
        }

        try {
            const expenseData = {
                groupId,
                description,
                amount,
                paidBy,
                splits
            };

            await this.saveExpense(expenseData);
            this.hideModal('add-expense-modal');
        } catch (error) {
            alert('Error adding expense. Please try again.');
            console.error('Error adding expense:', error);
        }
    }

    // Rendering Functions
    updateDashboard() {
        const totalBalance = this.calculateTotalBalance();
        const activeGroups = this.groups.length;
        const totalExpenses = this.expenses.length;
        const pendingSettlements = this.calculatePendingSettlements();

        document.getElementById('total-balance').textContent = this.formatCurrency(totalBalance);
        document.getElementById('balance-status').textContent = totalBalance === 0 ? 'All settled up!' : 'Settlements pending';
        document.getElementById('active-groups').textContent = activeGroups;
        document.getElementById('total-expenses').textContent = totalExpenses;
        document.getElementById('pending-settlements').textContent = pendingSettlements;

        this.renderRecentExpenses();
        this.renderGroupBalances();
    }

    renderRecentExpenses() {
        const container = document.getElementById('recent-expenses-list');
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
                <div class="group-card" onclick="app.showGroupDetails('${group.id}')">
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
                <div class="group-card" onclick="app.showGroupDetails('${group.id}')">
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

    renderExpenses() {
        const container = document.getElementById('expenses-list');
        const filter = document.getElementById('expense-filter').value;
        
        let filteredExpenses = this.expenses;
        if (filter && filter !== 'all') {
            filteredExpenses = this.expenses.filter(e => e.groupId === filter);
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

        document.getElementById('group-details-title').textContent = group.name;
        document.getElementById('group-details-name').textContent = group.name;
        document.getElementById('group-details-description').textContent = group.description || 'No description';

        const groupExpenses = this.expenses.filter(e => e.groupId === groupId);
        const totalAmount = groupExpenses.reduce((sum, e) => sum + e.amount, 0);

        document.getElementById('group-total-expenses').textContent = this.formatCurrency(totalAmount);
        document.getElementById('group-member-count').textContent = group.members.length;

        this.renderGroupBalancesDetails(groupId);
        this.renderGroupExpensesDetails(groupId);

        this.showModal('group-details-modal');
    }

    renderGroupBalancesDetails(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        const balances = this.calculateGroupBalances(groupId);
        const container = document.getElementById('group-balances-list');

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
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for Firebase to be available
    while (!window.db) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    window.app = new SplitTab();
});

// Update expense filter options when groups change
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('expense-group').addEventListener('change', function() {
        const groupId = this.value;
        const group = window.app?.groups.find(g => g.id === groupId);
        
        if (group) {
            const paidBySelect = document.getElementById('expense-paid-by');
            paidBySelect.innerHTML = '<option value="">Select who paid</option>';
            group.members.forEach(member => {
                const option = document.createElement('option');
                option.value = member;
                option.textContent = member;
                paidBySelect.appendChild(option);
            });
            
            window.app?.updateCustomSplitInputs();
        }
    });
});

// Update expense filter dropdown
function updateExpenseFilter() {
    const filter = document.getElementById('expense-filter');
    filter.innerHTML = '<option value="all">All Groups</option>';
    
    window.app?.groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.name;
        filter.appendChild(option);
    });
}

// Update the filter when groups change
const originalRenderGroups = SplitTab.prototype.renderGroups;
SplitTab.prototype.renderGroups = function() {
    originalRenderGroups.call(this);
    updateExpenseFilter();
}; 