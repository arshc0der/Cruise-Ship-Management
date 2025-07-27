// js/catering.js
import { db, auth } from './firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import { requireAuth } from './authGuard.js';

const form = document.getElementById('cateringForm');
const itemSelect = document.getElementById('itemSelect');
const customItemInput = document.getElementById('customItem');
const customItemContainer = document.getElementById('customItemContainer');
const quantityInput = document.getElementById('quantity');
const orderList = document.getElementById('placedOrders');
const backBtn = document.getElementById('backBtn');

requireAuth().then(({ user }) => {
  backBtn.addEventListener('click', () => {
    window.location.href = '/dashboard_voyager.html';
  });

  form.addEventListener('submit', (e) => handleSubmit(e, user.uid));
  loadOrders(user.uid);
}).catch(() => {
  document.body.innerHTML = `
    <div class="text-center mt-20 text-red-600 text-lg font-semibold">
      Access denied. Please <a href="/index.html" class="underline text-blue-500">login</a> to continue.
    </div>`;
});

async function handleSubmit(e, uid) {
  e.preventDefault();

  let item = itemSelect.value;
  if (!item) return alert('Please choose an item.');
  if (item === 'custom') {
    item = customItemInput.value.trim();
    if (!item) return alert('Please enter a custom item name.');
  }

  const quantity = parseInt(quantityInput.value.trim(), 10);
  if (!quantity || isNaN(quantity) || quantity < 1) {
    alert('Please enter a valid quantity.');
    return;
  }

  try {
    await addDoc(collection(db, 'cateringOrders'), {
      uid,
      item,
      quantity,
      timestamp: serverTimestamp()
    });

    alert('✅ Catering order placed!');
    form.reset();
    customItemContainer.classList.add('hidden');
    loadOrders(uid);
  } catch (err) {
    console.error(err);
    alert('❌ Failed to place order: ' + err.message);
  }
}

async function loadOrders(uid) {
  orderList.innerHTML = '<p class="text-gray-400 text-sm">Loading your orders...</p>';

  try {
    const q = query(collection(db, 'cateringOrders'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    orderList.innerHTML = '';

    if (snapshot.empty) {
      orderList.innerHTML = '<p class="text-gray-500">No orders found.</p>';
      return;
    }

    snapshot.forEach((doc) => {
      const { item, quantity, timestamp } = doc.data();
      const card = document.createElement('div');
      card.className = 'bg-white border-l-4 border-yellow-500 p-4 rounded shadow';

      card.innerHTML = `
        <p><strong>Item:</strong> ${item}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p class="text-sm text-gray-500 mt-1">🕒 ${timestamp?.seconds ? new Date(timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>
      `;

      orderList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    orderList.innerHTML = '<p class="text-red-500">Failed to load orders.</p>';
  }
}
