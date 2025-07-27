// js/supervisor.js
import { db } from './firebase.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { requireAuth } from './authGuard.js'; // Optional login enforcement

// Ensure user is logged in
requireAuth('supervisor').then(() => {
// Correct selector
const orderList = document.getElementById('stationeryOrders');

onSnapshot(collection(db, 'stationeryOrders'), (snapshot) => {
  orderList.innerHTML = '';

  if (snapshot.empty) {
    orderList.innerHTML = '<p class="text-gray-500">No stationery orders found.</p>';
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();

    const card = document.createElement('div');
    card.className = 'fade-in bg-white border-l-4 border-green-500 p-4 rounded shadow';

    card.innerHTML = `
      <p><strong>Item:</strong> ${data.item || 'N/A'}</p>
      <p><strong>Quantity:</strong> ${data.quantity || 'N/A'}</p>
      <p class="text-sm text-gray-400 mt-1">🕒 ${new Date(data.timestamp?.seconds * 1000).toLocaleString()}</p>
    `;

    orderList.appendChild(card);
  });
});
}).catch(() => {
  document.body.innerHTML = `
    <div class="text-center mt-20 text-red-600 text-lg font-semibold">
      Access denied. Please <a href="/index.html" class="underline text-blue-500">login</a> to continue.
    </div>
  `;
});