import { auth, db } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Logout button
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = '/index.html';
});

// Show user profile info
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userInfo = userDoc.data();
      document.getElementById('userInfo').innerHTML = `
        <div><strong>${userInfo.role || 'Voyager'}</strong></div>
        <div class="text-xs text-gray-400">${user.email}</div>
      `;
    }
  } catch (e) {
    console.error("Error fetching profile:", e);
  }
});
