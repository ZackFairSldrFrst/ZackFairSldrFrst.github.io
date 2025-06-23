// Split the Tab - Main Application
class SplitTheTab {
    constructor() {
        this.currentUser = null;
        this.userGroups = [];
        this.userExpenses = [];
        this.selectedUser = '';
        this.currentView = 'dashboard';
        
        this.init();
    }

    async init() {
        // Set Firebase persistence to LOCAL (persists across browser sessions)
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
        // Check if user was previously logged in
        this.checkPreviousLoginState();
        
        // Set up authentication state listener
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.onUserLogin();
            } else {
                this.currentUser = null;
                this.onUserLogout();
            }
        });

        // Check for automatic login
        await this.checkAutoLogin();

        // Set up event listeners
        this.setupEventListeners();
    }

    checkPreviousLoginState() {
        // Check localStorage for previous login
        const storedUser = localStorage.getItem('splitTheTab_user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                console.log('Found previous login for:', userData.email);
                
                // Show loading state
                this.showNotification('Restoring your session...', 'info');
                
                // The Firebase auth state listener will handle the actual login
                // This is just for UI feedback
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('splitTheTab_user');
            }
        }
    }

    // Function to check if user should be automatically logged in
    async checkAutoLogin() {
        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log('User already authenticated:', currentUser.email);
            return;
        }

        // Check if there's a stored session
        const storedUser = localStorage.getItem('splitTheTab_user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                console.log('Attempting to restore session for:', userData.email);
                
                // Firebase will automatically restore the session if it's still valid
                // We just need to wait for the auth state to change
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('splitTheTab_user');
            }
        }
    }

    onUserLogin() {
        console.log('User logged in:', this.currentUser.email);
        
        // Store user info in localStorage as backup
        localStorage.setItem('splitTheTab_user', JSON.stringify({
            uid: this.currentUser.uid,
            email: this.currentUser.email,
            lastLogin: new Date().toISOString()
        }));
        
        // Update UI
        document.getElementById('notLoggedIn').style.display = 'none';
        document.getElementById('loggedIn').style.display = 'flex';
        document.getElementById('userSelectorContainer').style.display = 'flex';
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
        
        // Update user email display
        document.getElementById('userEmail').textContent = this.currentUser.email;
        
        // Load user data
        this.loadUserData();
        
        // Show welcome back message if returning user
        const lastLogin = localStorage.getItem('splitTheTab_lastLogin');
        if (lastLogin) {
            this.showNotification('Welcome back!', 'success');
        } else {
            this.showNotification('Welcome to Split the Tab!', 'success');
        }
        
        // Update last login time
        localStorage.setItem('splitTheTab_lastLogin', new Date().toISOString());
    }

    onUserLogout() {
        console.log('User logged out');
        
        // Clear localStorage
        localStorage.removeItem('splitTheTab_user');
        localStorage.removeItem('splitTheTab_lastLogin');
        
        // Update UI
        document.getElementById('notLoggedIn').style.display = 'flex';
        document.getElementById('loggedIn').style.display = 'none';
        document.getElementById('userSelectorContainer').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('appContent').style.display = 'none';
        
        // Clear data
        this.userGroups = [];
        this.userExpenses = [];
        this.selectedUser = '';
        
        // Clear UI
        this.clearAllViews();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // User selector
        document.getElementById('userSelect').addEventListener('change', (e) => {
            this.selectedUser = e.target.value;
            this.updateDashboard();
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        document.getElementById('inviteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleInvite();
        });

        // Modal close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.closest('.modal').id;
                this.closeModal(modalId);
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Group form
        document.getElementById('groupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createGroup();
        });

        // Expense form
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createExpense();
        });

        // Edit expense form
        document.getElementById('editExpenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateExpense();
        });
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            // Set persistence based on "Remember Me" setting
            const persistence = rememberMe ? 
                firebase.auth.Auth.Persistence.LOCAL : 
                firebase.auth.Auth.Persistence.SESSION;
            
            await auth.setPersistence(persistence);
            await auth.signInWithEmailAndPassword(email, password);
            
            this.closeModal('loginModal');
            this.showNotification('Welcome back!', 'success');
        } catch (error) {
            this.showNotification(`Login failed: ${error.message}`, 'error');
        }
    }

    async handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const rememberMe = document.getElementById('signupRememberMe').checked;

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            // Set persistence based on "Remember Me" setting
            const persistence = rememberMe ? 
                firebase.auth.Auth.Persistence.LOCAL : 
                firebase.auth.Auth.Persistence.SESSION;
            
            await auth.setPersistence(persistence);
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Create user profile
            await db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                createdAt: new Date(),
                groups: []
            });

            this.closeModal('signupModal');
            this.showNotification('Account created successfully!', 'success');
            
            // Load user data after successful signup
            await this.loadUserData();
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification(`Signup failed: ${error.message}`, 'error');
        }
    }

    async handleInvite() {
        const email = document.getElementById('inviteEmail').value;
        const groupId = document.getElementById('inviteGroup').value;
        const message = document.getElementById('inviteMessage').value;

        if (!groupId) {
            this.showNotification('Please select a group', 'error');
            return;
        }

        try {
            // Create invite
            await db.collection('invites').add({
                fromUserId: this.currentUser.uid,
                fromUserEmail: this.currentUser.email,
                toEmail: email,
                groupId: groupId,
                message: message,
                status: 'pending',
                createdAt: new Date()
            });

            this.closeModal('inviteModal');
            this.showNotification('Invite sent successfully!', 'success');
        } catch (error) {
            this.showNotification(`Failed to send invite: ${error.message}`, 'error');
        }
    }

    async ensureUserDocument() {
        try {
            const userDocRef = db.collection('users').doc(this.currentUser.uid);
            const userDoc = await userDocRef.get();
            
            if (!userDoc.exists) {
                await userDocRef.set({
                    email: this.currentUser.email,
                    groups: [],
                    createdAt: new Date()
                });
                console.log('User document created');
            }
        } catch (error) {
            console.error('Error ensuring user document:', error);
            throw error;
        }
    }

    async loadUserData() {
        try {
            // Ensure user document exists
            await this.ensureUserDocument();
            
            // Load groups where user is a member
            const groupsSnapshot = await db.collection('groups')
                .where('members', 'array-contains', this.currentUser.uid)
                .get();
            
            this.userGroups = groupsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load expenses for user's groups
            this.userExpenses = [];
            const groupIds = this.userGroups.map(g => g.id);
            if (groupIds.length > 0) {
                // Firestore 'in' queries are limited to 10 items, so we need to batch them
                // Note: Removed orderBy to avoid index requirements, will sort in JavaScript
                const batches = [];
                for (let i = 0; i < groupIds.length; i += 10) {
                    const batch = groupIds.slice(i, i + 10);
                    batches.push(
                        db.collection('expenses')
                            .where('groupId', 'in', batch)
                            .get()
                    );
                }
                
                const expenseSnapshots = await Promise.all(batches);
                expenseSnapshots.forEach(snapshot => {
                    const expenses = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    this.userExpenses.push(...expenses);
                });
                
                // Sort all expenses by creation date (newest first)
                this.userExpenses.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                    return dateB - dateA;
                });
            }

            // Update UI
            this.updateGroupsView();
            this.updateExpensesView();
            this.updateDashboard();
            this.populateUserSelector();
            
            console.log('User data loaded successfully:', {
                groups: this.userGroups.length,
                expenses: this.userExpenses.length
            });
            
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification(`Failed to load data: ${error.message}`, 'error');
        }
    }

    async createGroup() {
        const name = document.getElementById('groupName').value;
        const description = document.getElementById('groupDescription').value;

        if (!name.trim()) {
            this.showNotification('Please enter a group name', 'error');
            return;
        }

        try {
            // Ensure user document exists
            await this.ensureUserDocument();

            const groupData = {
                name: name.trim(),
                description: description.trim(),
                createdBy: this.currentUser.uid,
                members: [this.currentUser.uid],
                createdAt: new Date()
            };

            const docRef = await db.collection('groups').add(groupData);
            
            // Add group to user's groups using set with merge to avoid update errors
            await db.collection('users').doc(this.currentUser.uid).set({
                groups: firebase.firestore.FieldValue.arrayUnion(docRef.id)
            }, { merge: true });

            this.closeModal('groupModal');
            this.showNotification('Group created successfully!', 'success');
            
            // Reload data
            await this.loadUserData();
        } catch (error) {
            console.error('Error creating group:', error);
            this.showNotification(`Failed to create group: ${error.message}`, 'error');
        }
    }

    async createExpense() {
        const description = document.getElementById('expenseDescription').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const paidBy = document.getElementById('expensePaidBy').value;
        const groupId = document.getElementById('expenseGroup').value;

        if (!description.trim() || !amount || amount <= 0 || !paidBy || !groupId) {
            this.showNotification('Please fill in all fields with valid values', 'error');
            return;
        }

        const selectedMembers = this.getSelectedMembers();
        if (selectedMembers.length === 0) {
            this.showNotification('Please select at least one member to split the expense with', 'error');
            return;
        }

        try {
            const expenseData = {
                description: description.trim(),
                amount: amount,
                paidBy: paidBy,
                groupId: groupId,
                createdBy: this.currentUser.uid,
                createdAt: new Date(),
                members: selectedMembers
            };

            await db.collection('expenses').add(expenseData);
            
            this.closeModal('expenseModal');
            this.showNotification('Expense added successfully!', 'success');
            
            // Clear form
            document.getElementById('expenseForm').reset();
            
            // Reload data
            await this.loadUserData();
        } catch (error) {
            console.error('Error creating expense:', error);
            this.showNotification(`Failed to add expense: ${error.message}`, 'error');
        }
    }

    async updateExpense() {
        const expenseId = document.getElementById('editExpenseForm').dataset.expenseId;
        const description = document.getElementById('editExpenseDescription').value;
        const amount = parseFloat(document.getElementById('editExpenseAmount').value);
        const paidBy = document.getElementById('editExpensePaidBy').value;
        const groupId = document.getElementById('editExpenseGroup').value;

        try {
            await db.collection('expenses').doc(expenseId).update({
                description: description,
                amount: amount,
                paidBy: paidBy,
                groupId: groupId,
                members: this.getSelectedMembers('edit'),
                updatedAt: new Date()
            });

            this.closeModal('editExpenseModal');
            this.showNotification('Expense updated successfully!', 'success');
            
            // Reload data
            this.loadUserData();
        } catch (error) {
            this.showNotification(`Failed to update expense: ${error.message}`, 'error');
        }
    }

    async deleteExpense(expenseId) {
        if (!confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            await db.collection('expenses').doc(expenseId).delete();
            this.showNotification('Expense deleted successfully!', 'success');
            
            // Reload data
            this.loadUserData();
        } catch (error) {
            this.showNotification(`Failed to delete expense: ${error.message}`, 'error');
        }
    }

    getSelectedMembers(prefix = '') {
        const memberCheckboxes = document.querySelectorAll(`#${prefix}expenseMembers input[type="checkbox"]:checked`);
        const selectedMembers = Array.from(memberCheckboxes).map(cb => cb.value);
        
        // If no members are selected but we have a current user, include them
        if (selectedMembers.length === 0 && this.currentUser) {
            return [this.currentUser.uid];
        }
        
        return selectedMembers;
    }

    populateUserSelector() {
        const userSelect = document.getElementById('userSelect');
        userSelect.innerHTML = '<option value="">Select yourself...</option>';
        
        // Get all unique members from all groups
        const allMembers = new Set();
        this.userGroups.forEach(group => {
            group.members.forEach(member => allMembers.add(member));
        });

        // For now, we'll use email addresses as identifiers
        // In a real app, you'd want to store user names
        allMembers.forEach(memberId => {
            const option = document.createElement('option');
            option.value = memberId;
            option.textContent = memberId === this.currentUser.uid ? 
                `${this.currentUser.email} (You)` : memberId;
            userSelect.appendChild(option);
        });
    }

    updateGroupsView() {
        const container = document.getElementById('groupsContainer');
        
        if (this.userGroups.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No Groups Yet</h3>
                    <p>Create your first group to start splitting expenses!</p>
                    <button class="btn btn-primary" onclick="showModal('groupModal')">
                        <i class="fas fa-plus"></i>
                        Create Group
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.userGroups.map(group => `
            <div class="group-card">
                <div class="group-header">
                    <h3>${group.name}</h3>
                    <span class="member-count">${group.members.length} members</span>
                </div>
                <p class="group-description">${group.description || 'No description'}</p>
                <div class="group-actions">
                    <button class="btn btn-secondary" onclick="showModal('inviteModal')">
                        <i class="fas fa-user-plus"></i>
                        Invite
                    </button>
                    <button class="btn btn-primary" onclick="showModal('expenseModal')">
                        <i class="fas fa-plus"></i>
                        Add Expense
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateExpensesView() {
        const container = document.getElementById('expensesContainer');
        
        if (this.userExpenses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <h3>No Expenses Yet</h3>
                    <p>Add your first expense to start tracking!</p>
                    <button class="btn btn-primary" onclick="showModal('expenseModal')">
                        <i class="fas fa-plus"></i>
                        Add Expense
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.userExpenses.map(expense => {
            const group = this.userGroups.find(g => g.id === expense.groupId);
            return `
                <div class="expense-card">
                    <div class="expense-header">
                        <h3>${expense.description}</h3>
                        <div class="expense-actions">
                            <button class="btn btn-icon" onclick="editExpense('${expense.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-icon" onclick="deleteExpense('${expense.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="expense-details">
                        <span class="amount">$${expense.amount.toFixed(2)}</span>
                        <span class="paid-by">Paid by: ${expense.paidBy}</span>
                        <span class="group">${group ? group.name : 'Unknown Group'}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateDashboard() {
        if (!this.selectedUser) {
            document.getElementById('dashboard').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user"></i>
                    <h3>Select Your Identity</h3>
                    <p>Choose who you are from the dropdown above to see your balances.</p>
                </div>
            `;
            return;
        }

        const balances = this.calculateBalances();
        const personalBalances = this.calculatePersonalBalances();

        document.getElementById('dashboard').innerHTML = `
            <div class="dashboard-grid">
                <div class="summary-card">
                    <h3><i class="fas fa-wallet"></i> Total Balance</h3>
                    <div class="balance ${balances.net >= 0 ? 'positive' : 'negative'}">
                        $${Math.abs(balances.net).toFixed(2)}
                    </div>
                    <p>${balances.net >= 0 ? 'You are owed' : 'You owe'}</p>
                </div>
                
                <div class="summary-card">
                    <h3><i class="fas fa-arrow-up"></i> You Owe</h3>
                    <div class="balance negative">$${balances.owe.toFixed(2)}</div>
                </div>
                
                <div class="summary-card">
                    <h3><i class="fas fa-arrow-down"></i> You're Owed</h3>
                    <div class="balance positive">$${balances.owed.toFixed(2)}</div>
                </div>
            </div>
            
            <div class="personal-balances">
                <h3><i class="fas fa-users"></i> Personal Balances</h3>
                <div class="balances-list">
                    ${personalBalances.map(balance => `
                        <div class="balance-item ${balance.net >= 0 ? 'positive' : 'negative'}">
                            <span class="person">${balance.person}</span>
                            <span class="amount">$${Math.abs(balance.net).toFixed(2)}</span>
                            <span class="status">${balance.net >= 0 ? 'owes you' : 'you owe'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    calculateBalances() {
        let totalPaid = 0;
        let totalOwed = 0;

        this.userExpenses.forEach(expense => {
            if (expense.paidBy === this.selectedUser) {
                totalPaid += expense.amount;
            }
            
            if (expense.members.includes(this.selectedUser)) {
                const share = expense.amount / expense.members.length;
                totalOwed += share;
            }
        });

        return {
            net: totalPaid - totalOwed,
            owe: Math.max(0, totalOwed - totalPaid),
            owed: Math.max(0, totalPaid - totalOwed)
        };
    }

    calculatePersonalBalances() {
        const balances = {};
        
        // Get all unique members
        const allMembers = new Set();
        this.userExpenses.forEach(expense => {
            allMembers.add(expense.paidBy);
            expense.members.forEach(member => allMembers.add(member));
        });

        // Initialize balances
        allMembers.forEach(member => {
            balances[member] = { paid: 0, owed: 0 };
        });

        // Calculate balances
        this.userExpenses.forEach(expense => {
            const share = expense.amount / expense.members.length;
            
            // Add to paid amount
            balances[expense.paidBy].paid += expense.amount;
            
            // Add to owed amounts for all members
            expense.members.forEach(member => {
                balances[member].owed += share;
            });
        });

        // Convert to net balances
        return Object.entries(balances)
            .filter(([member]) => member !== this.selectedUser)
            .map(([member, balance]) => ({
                person: member === this.currentUser.uid ? 'You' : member,
                net: balance.paid - balance.owed
            }))
            .filter(balance => balance.net !== 0)
            .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
    }

    switchView(view) {
        this.currentView = view;
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.toggle('active', v.id === view);
        });
    }

    showModal(modalId) {
        console.log('showModal called with:', modalId);
        
        // Check if user is logged in for modals that require authentication
        if ((modalId === 'expenseModal' || modalId === 'editExpenseModal' || modalId === 'groupModal' || modalId === 'inviteModal') && !this.currentUser) {
            this.showNotification('Please log in first', 'error');
            return;
        }
        
        // Check if user has groups for expense/invite modals
        if ((modalId === 'expenseModal' || modalId === 'editExpenseModal') && this.userGroups.length === 0) {
            this.showNotification('Please create a group first before adding expenses', 'error');
            return;
        }
        
        if (modalId === 'inviteModal' && this.userGroups.length === 0) {
            this.showNotification('Please create a group first before inviting members', 'error');
            return;
        }
        
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
        }
        
        // Populate dropdowns if needed
        if (modalId === 'expenseModal' || modalId === 'editExpenseModal') {
            this.populateExpenseDropdowns(modalId);
        } else if (modalId === 'inviteModal') {
            this.populateInviteDropdown();
        }
    }

    closeModal(modalId) {
        console.log('closeModal called with:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
        
        // Clear forms
        const form = document.getElementById(modalId.replace('Modal', 'Form'));
        if (form) {
            form.reset();
        }
    }

    populateExpenseDropdowns(modalId) {
        const prefix = modalId === 'editExpenseModal' ? 'edit' : '';
        
        // Populate groups dropdown
        const groupSelect = document.getElementById(`${prefix}expenseGroup`);
        groupSelect.innerHTML = '<option value="">Select group...</option>';
        this.userGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            groupSelect.appendChild(option);
        });

        // Populate paid by dropdown
        const paidBySelect = document.getElementById(`${prefix}expensePaidBy`);
        paidBySelect.innerHTML = '<option value="">Select who paid...</option>';
        
        // Get all members from all groups
        const allMembers = new Set();
        this.userGroups.forEach(group => {
            group.members.forEach(member => allMembers.add(member));
        });

        allMembers.forEach(memberId => {
            const option = document.createElement('option');
            option.value = memberId;
            option.textContent = memberId === this.currentUser.uid ? 
                `${this.currentUser.email} (You)` : memberId;
            paidBySelect.appendChild(option);
        });

        // Populate members list
        this.populateMembersList(prefix);
    }

    populateMembersList(prefix = '') {
        const membersContainer = document.getElementById(`${prefix}expenseMembers`);
        const allMembers = new Set();
        this.userGroups.forEach(group => {
            group.members.forEach(member => allMembers.add(member));
        });

        membersContainer.innerHTML = Array.from(allMembers).map(memberId => `
            <label class="checkbox-label">
                <input type="checkbox" value="${memberId}" checked>
                <span>${memberId === this.currentUser.uid ? 
                    `${this.currentUser.email} (You)` : memberId}</span>
            </label>
        `).join('');
    }

    populateInviteDropdown() {
        const groupSelect = document.getElementById('inviteGroup');
        groupSelect.innerHTML = '<option value="">Select group...</option>';
        this.userGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            groupSelect.appendChild(option);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    clearAllViews() {
        document.getElementById('groupsContainer').innerHTML = '';
        document.getElementById('expensesContainer').innerHTML = '';
        document.getElementById('dashboard').innerHTML = '';
    }
}

// Global functions for modal switching
function switchToSignup() {
    console.log('switchToSignup called');
    closeModal('loginModal');
    showModal('signupModal');
}

function switchToLogin() {
    console.log('switchToLogin called');
    closeModal('signupModal');
    showModal('loginModal');
}

function logout() {
    console.log('logout called');
    if (window.splitTheTabApp) {
        auth.signOut().then(() => {
            window.splitTheTabApp.showNotification('Logged out successfully', 'success');
        }).catch((error) => {
            window.splitTheTabApp.showNotification(`Logout failed: ${error.message}`, 'error');
        });
    } else {
        // Fallback: just sign out
        auth.signOut();
    }
}

function editExpense(expenseId) {
    if (!window.splitTheTabApp) return;
    
    const expense = window.splitTheTabApp.userExpenses.find(e => e.id === expenseId);
    if (!expense) return;

    // Populate form
    document.getElementById('editExpenseDescription').value = expense.description;
    document.getElementById('editExpenseAmount').value = expense.amount;
    document.getElementById('editExpensePaidBy').value = expense.paidBy;
    document.getElementById('editExpenseGroup').value = expense.groupId;
    
    // Set expense ID for form submission
    document.getElementById('editExpenseForm').dataset.expenseId = expenseId;
    
    // Populate dropdowns
    window.splitTheTabApp.populateExpenseDropdowns('editExpenseModal');
    
    // Set selected members
    setTimeout(() => {
        expense.members.forEach(memberId => {
            const checkbox = document.querySelector(`#editExpenseMembers input[value="${memberId}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }, 100);
    
    showModal('editExpenseModal');
}

function deleteExpense(expenseId) {
    if (window.splitTheTabApp) {
        window.splitTheTabApp.deleteExpense(expenseId);
    }
}

function showModal(modalId) {
    console.log('Global showModal called with:', modalId);
    // Check if app is initialized
    if (window.splitTheTabApp) {
        window.splitTheTabApp.showModal(modalId);
    } else {
        // Fallback: directly show modal
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            console.log('Modal shown directly:', modalId);
        } else {
            console.error('Modal not found:', modalId);
        }
    }
}

function closeModal(modalId) {
    console.log('Global closeModal called with:', modalId);
    // Check if app is initialized
    if (window.splitTheTabApp) {
        window.splitTheTabApp.closeModal(modalId);
    } else {
        // Fallback: directly hide modal
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            console.log('Modal closed directly:', modalId);
        } else {
            console.error('Modal not found:', modalId);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Split the Tab app...');
    try {
        window.splitTheTabApp = new SplitTheTab();
        console.log('Split the Tab app initialized successfully');
    } catch (error) {
        console.error('Error initializing Split the Tab app:', error);
        
        // Show error notification even if app fails to initialize
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Application failed to initialize. Please refresh the page.</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
    }
}); 