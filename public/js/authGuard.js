// js/authGuard.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

/**
 * Ensures the user is logged in and optionally has a specific role.
 * @param {string|null} expectedRole - 'admin', 'manager', 'cook', etc. or null for any logged-in user.
 * @returns {Promise<object>} - Returns the user object and their role.
 */
export function requireAuth(expectedRole = null) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = '/index.html';
        reject("Not authenticated");
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        alert("User data not found.");
        window.location.href = '/index.html';
        reject("User not found in Firestore");
        return;
      }

      const role = docSnap.data().role;

      if (expectedRole && role !== expectedRole) {
        window.location.href = '/access_denied.html';
        reject("Insufficient role");
        return;
      }

      resolve({ user, role });
    });
  });
}
