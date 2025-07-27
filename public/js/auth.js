// js/auth.js
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Login form logic
const form = document.getElementById('loginForm');
const errorBox = document.getElementById('loginError');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.classList.add('hidden');

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const chosenRole = window.selectedRole(); // get selected tab role

  btnText.innerHTML = `<span class="spinner"></span> Logging in...`;
  loginBtn.disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
      throw new Error("User role not found.");
    }

    const role = userDoc.data().role;

    if (role !== chosenRole) {
      throw new Error(`This account is registered as "${role}". Please use the ${role} tab.`);
    }

    // Redirect based on role
    switch(role) {
      case 'admin': window.location.href = '/dashboard_admin.html'; break;
      case 'manager': window.location.href = '/dashboard_manager.html'; break;
      case 'cook': window.location.href = '/dashboard_cook.html'; break;
      case 'supervisor': window.location.href = '/dashboard_supervisor.html'; break;
      default: window.location.href = '/dashboard_voyager.html'; break;
    }

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove('hidden');
    btnText.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
    loginBtn.disabled = false;
  }
});
