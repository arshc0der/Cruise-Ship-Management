// js/admin.js
import { db } from './firebase.js';
import { requireAuth } from './authGuard.js'; // Optional: protect this page
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const form = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');

// Protect only for 'admin' role
requireAuth('admin').then(() => {
  loadItems();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('type').value.trim();
    const name = document.getElementById('name').value.trim();

    if (!type || !name) {
      alert("Please enter both type and name.");
      return;
    }

    try {
      await addDoc(collection(db, 'menuItems'), { type, name });
      form.reset();
      loadItems();
    } catch (err) {
      alert("Failed to add item: " + err.message);
    }
  });
}).catch((err) => {
  console.error("Admin access denied:", err);
  document.body.innerHTML = `<p class="text-center mt-20 text-red-600 font-semibold text-lg">Access denied. You must be an admin to view this page.</p>`;
});

// Load items
async function loadItems() {
  itemList.innerHTML = '<p class="text-gray-400">Loading...</p>';

  try {
    const snapshot = await getDocs(collection(db, 'menuItems'));
    itemList.innerHTML = '';

    if (snapshot.empty) {
      itemList.innerHTML = '<p class="text-gray-400">No items found.</p>';
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const itemDiv = document.createElement('div');
      itemDiv.className = 'fade-in border bg-white p-3 rounded flex justify-between items-center shadow-sm';

      itemDiv.innerHTML = `
        <span><strong>${data.type}</strong>: ${data.name}</span>
        <button class="text-red-600 hover:text-red-800 transition" onclick="deleteItem('${docSnap.id}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      `;
      itemList.appendChild(itemDiv);
    });
  } catch (err) {
    itemList.innerHTML = `<p class="text-red-500">Error loading items: ${err.message}</p>`;
  }
}

// Delete handler
window.deleteItem = async function(id) {
  try {
    await deleteDoc(doc(db, 'menuItems', id));
    loadItems();
  } catch (err) {
    alert("Failed to delete item: " + err.message);
  }
}
