// js/cook.js
import { db } from './firebase.js';
import { requireAuth } from './authGuard.js'; // optional, if you want access control
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Reference to the target div
const orderList = document.getElementById('cookOrders');

// Protect access to only authenticated head cook
requireAuth('cook').then(() => {
  const cateringRef = collection(db, 'cateringOrders');

  onSnapshot(cateringRef, (snapshot) => {
    orderList.innerHTML = '';

    if (snapshot.empty) {
      orderList.innerHTML = `<p class="text-gray-500">No catering orders found.</p>`;
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const { item, quantity, timestamp } = data;

      const timeStr = timestamp?.seconds
        ? new Date(timestamp.seconds * 1000).toLocaleString()
        : 'Unknown time';

      const card = document.createElement('div');
      card.className = 'fade-in bg-white border-l-4 border-yellow-500 p-4 rounded shadow-sm';

      card.innerHTML = `
        <p class="text-md"><strong>🍽️ Item:</strong> ${item || 'N/A'}</p>
        <p class="text-md"><strong>🔢 Quantity:</strong> ${quantity || 'N/A'}</p>
        <p class="text-sm text-gray-400 mt-2">🕒 ${timeStr}</p>
      `;

      orderList.appendChild(card);
    });
  });
}).catch((err) => {
  console.error("Access denied or not logged in:", err);
});
