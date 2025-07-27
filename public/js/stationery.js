// /js/stationery.js
import { db, auth } from './firebase.js';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import { requireAuth } from './authGuard.js';

// ---------- DOM ----------
const form            = document.getElementById('stationeryForm');
const itemSelect      = document.getElementById('itemSelect');      // dropdown
const customItemInput = document.getElementById('customItem');      // “Other…”
const quantityInput   = document.getElementById('quantity');
const orderList       = document.getElementById('placedOrders');
const backBtn         = document.getElementById('backBtn');

// ---------- Auth gate ----------
requireAuth()
  .then(({ user }) => {
    backBtn.addEventListener('click', () => window.location.href = '/dashboard_voyager.html');

    form.addEventListener('submit', (e) => handleSubmit(e, user.uid));

    loadOrders(user.uid);
  })
  .catch(showAccessDenied);

// ---------- Handlers ----------
async function handleSubmit(event, uid) {
  event.preventDefault();

  // Resolve the item name depending on dropdown choice
  let item = itemSelect.value;
  if (!item) {
    alert('Please choose an item.');
    return;
  }
  if (item === 'custom') {
    item = customItemInput.value.trim();
    if (!item) {
      alert('Please type the custom item name.');
      return;
    }
  }

  const quantity = parseInt(quantityInput.value.trim(), 10);
  if (isNaN(quantity) || quantity <= 0) {
    alert('Please enter a valid quantity.');
    return;
  }

  try {
    await addDoc(collection(db, 'stationeryOrders'), {
      uid,
      item,
      quantity,
      timestamp: serverTimestamp()
    });

    alert('✅ Stationery order placed!');
    form.reset();
    // Hide custom field again
    document.getElementById('customItemContainer').classList.add('hidden');
    loadOrders(uid);
  } catch (err) {
    console.error('Error placing order:', err);
    alert('❌ Failed to place order: ' + err.message);
  }
}

// ---------- Orders list ----------
async function loadOrders(uid) {
  orderList.innerHTML = '<p class="text-gray-400 text-sm">Loading your orders...</p>';

  try {
    const q = query(collection(db, 'stationeryOrders'), where('uid', '==', uid));
    const snap = await getDocs(q);

    if (snap.empty) {
      orderList.innerHTML = '<p class="text-gray-500">No stationery orders found.</p>';
      return;
    }

    orderList.innerHTML = '';
    snap.forEach((doc) => {
      const { item, quantity, timestamp } = doc.data();

      const card = document.createElement('div');
      card.className = 'bg-white border-l-4 border-green-500 p-4 rounded shadow';
      card.innerHTML = `
        <p><strong>📦 Item:</strong> ${item}</p>
        <p><strong>🔢 Quantity:</strong> ${quantity}</p>
        <p class="text-sm text-gray-500 mt-1">🕒 ${
          timestamp?.seconds ? new Date(timestamp.seconds * 1000).toLocaleString() : 'N/A'
        }</p>
      `;
      orderList.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading orders:', err);
    orderList.innerHTML = '<p class="text-red-500">Failed to load orders.</p>';
  }
}

// ---------- Access‑denied fallback ----------
function showAccessDenied() {
  document.body.innerHTML = `
    <div class="text-center mt-20 text-red-600 text-lg font-semibold">
      Access denied. Please <a href="/index.html" class="underline text-blue-500">login</a> to continue.
    </div>`;
}
