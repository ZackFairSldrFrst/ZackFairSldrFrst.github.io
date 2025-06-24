// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    doc, 
    addDoc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    serverTimestamp,
    onSnapshot
} from "firebase/firestore";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfU7HXqeLXdquzbIdmexEsismyklcl_4M",
    authDomain: "letterly-f44b0.firebaseapp.com",
    projectId: "letterly-f44b0",
    storageBucket: "letterly-f44b0.firebasestorage.app",
    messagingSenderId: "968479568230",
    appId: "1:968479568230:web:154f5394e8d28ff98bd8a7",
    measurementId: "G-R4PQV9CHTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Firebase Auth functions
export const firebaseAuth = {
    // Sign in with email and password
    signIn: async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign up with email and password
    signUp: async (email, password, displayName) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update user profile with display name
            await updateProfile(result.user, {
                displayName: displayName
            });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                email: result.user.email,
                displayName: displayName,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp()
            });

            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign in with Google
    signInWithGoogle: async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            
            // Check if user document exists, create if not
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    createdAt: serverTimestamp(),
                    lastLoginAt: serverTimestamp()
                });
            } else {
                // Update last login time
                await updateDoc(doc(db, 'users', result.user.uid), {
                    lastLoginAt: serverTimestamp()
                });
            }

            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign out
    signOut: async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Listen to auth state changes
    onAuthStateChanged: (callback) => {
        return onAuthStateChanged(auth, callback);
    }
};

// Firestore database functions
export const firebaseDB = {
    // Contacts
    contacts: {
        // Add a new contact
        add: async (userId, contactData) => {
            try {
                const docRef = await addDoc(collection(db, 'users', userId, 'contacts'), {
                    ...contactData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return { success: true, id: docRef.id };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Get all contacts for a user
        getAll: async (userId) => {
            try {
                const q = query(
                    collection(db, 'users', userId, 'contacts'),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const contacts = [];
                querySnapshot.forEach((doc) => {
                    contacts.push({ id: doc.id, ...doc.data() });
                });
                return { success: true, data: contacts };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Update a contact
        update: async (userId, contactId, contactData) => {
            try {
                await updateDoc(doc(db, 'users', userId, 'contacts', contactId), {
                    ...contactData,
                    updatedAt: serverTimestamp()
                });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Delete a contact
        delete: async (userId, contactId) => {
            try {
                await deleteDoc(doc(db, 'users', userId, 'contacts', contactId));
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Listen to contacts changes
        listen: (userId, callback) => {
            const q = query(
                collection(db, 'users', userId, 'contacts'),
                orderBy('createdAt', 'desc')
            );
            return onSnapshot(q, (querySnapshot) => {
                const contacts = [];
                querySnapshot.forEach((doc) => {
                    contacts.push({ id: doc.id, ...doc.data() });
                });
                callback(contacts);
            });
        }
    },

    // Notification Pages
    pages: {
        // Add a new page
        add: async (userId, pageData) => {
            try {
                const docRef = await addDoc(collection(db, 'users', userId, 'pages'), {
                    ...pageData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return { success: true, id: docRef.id };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Get all pages for a user
        getAll: async (userId) => {
            try {
                const q = query(
                    collection(db, 'users', userId, 'pages'),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const pages = [];
                querySnapshot.forEach((doc) => {
                    pages.push({ id: doc.id, ...doc.data() });
                });
                return { success: true, data: pages };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Get a specific page by ID
        get: async (userId, pageId) => {
            try {
                const docSnap = await getDoc(doc(db, 'users', userId, 'pages', pageId));
                if (docSnap.exists()) {
                    return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
                } else {
                    return { success: false, error: 'Page not found' };
                }
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Update a page
        update: async (userId, pageId, pageData) => {
            try {
                await updateDoc(doc(db, 'users', userId, 'pages', pageId), {
                    ...pageData,
                    updatedAt: serverTimestamp()
                });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Delete a page
        delete: async (userId, pageId) => {
            try {
                await deleteDoc(doc(db, 'users', userId, 'pages', pageId));
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Listen to pages changes
        listen: (userId, callback) => {
            const q = query(
                collection(db, 'users', userId, 'pages'),
                orderBy('createdAt', 'desc')
            );
            return onSnapshot(q, (querySnapshot) => {
                const pages = [];
                querySnapshot.forEach((doc) => {
                    pages.push({ id: doc.id, ...doc.data() });
                });
                callback(pages);
            });
        }
    },

    // Messages/Campaigns
    messages: {
        // Add a new message
        add: async (userId, messageData) => {
            try {
                const docRef = await addDoc(collection(db, 'users', userId, 'messages'), {
                    ...messageData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return { success: true, id: docRef.id };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Get all messages for a user
        getAll: async (userId) => {
            try {
                const q = query(
                    collection(db, 'users', userId, 'messages'),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const messages = [];
                querySnapshot.forEach((doc) => {
                    messages.push({ id: doc.id, ...doc.data() });
                });
                return { success: true, data: messages };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Update a message
        update: async (userId, messageId, messageData) => {
            try {
                await updateDoc(doc(db, 'users', userId, 'messages', messageId), {
                    ...messageData,
                    updatedAt: serverTimestamp()
                });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Delete a message
        delete: async (userId, messageId) => {
            try {
                await deleteDoc(doc(db, 'users', userId, 'messages', messageId));
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Listen to messages changes
        listen: (userId, callback) => {
            const q = query(
                collection(db, 'users', userId, 'messages'),
                orderBy('createdAt', 'desc')
            );
            return onSnapshot(q, (querySnapshot) => {
                const messages = [];
                querySnapshot.forEach((doc) => {
                    messages.push({ id: doc.id, ...doc.data() });
                });
                callback(messages);
            });
        }
    },

    // Analytics
    analytics: {
        // Track page view
        trackView: async (pageId, viewData) => {
            try {
                await addDoc(collection(db, 'analytics', pageId, 'views'), {
                    ...viewData,
                    timestamp: serverTimestamp()
                });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Track button click
        trackClick: async (pageId, clickData) => {
            try {
                await addDoc(collection(db, 'analytics', pageId, 'clicks'), {
                    ...clickData,
                    timestamp: serverTimestamp()
                });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Get analytics for a page
        getPageAnalytics: async (pageId) => {
            try {
                const viewsSnapshot = await getDocs(collection(db, 'analytics', pageId, 'views'));
                const clicksSnapshot = await getDocs(collection(db, 'analytics', pageId, 'clicks'));
                
                const views = viewsSnapshot.size;
                const clicks = clicksSnapshot.size;
                
                return { 
                    success: true, 
                    data: { 
                        views, 
                        clicks, 
                        clickRate: views > 0 ? ((clicks / views) * 100).toFixed(1) : 0 
                    } 
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    }
};

// Public page access (no auth required)
export const publicDB = {
    // Get a public page by ID
    getPage: async (pageId) => {
        try {
            // Search across all users for the page
            const users = await getDocs(collection(db, 'users'));
            for (const userDoc of users.docs) {
                const pageDoc = await getDoc(doc(db, 'users', userDoc.id, 'pages', pageId));
                if (pageDoc.exists()) {
                    const pageData = pageDoc.data();
                    // Only return if page is public/active
                    if (pageData.status === 'active') {
                        return { 
                            success: true, 
                            data: { 
                                id: pageDoc.id, 
                                ...pageData,
                                userId: userDoc.id 
                            } 
                        };
                    }
                }
            }
            return { success: false, error: 'Page not found or inactive' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Utility functions
export const firebaseUtils = {
    // Generate a unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Format timestamp
    formatTimestamp: (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    },

    // Upload file to Firebase Storage
    uploadFile: async (file, path) => {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return { success: true, url: downloadURL };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

export default app; 