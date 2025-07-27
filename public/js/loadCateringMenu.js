// js/loadCateringMenu.js
import { db } from './firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const itemSelect = document.getElementById('itemSelect');
const customItemContainer = document.getElementById('customItemContainer');
const customItemInput = document.getElementById('customItem');

(async () => {
  try {
    const q = query(collection(db, 'menuItems'), where('type', '==', 'catering'));
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
      const data = doc.data();
      const option = document.createElement('option');
      option.value = data.name;
      option.textContent = data.name;
      itemSelect.appendChild(option);
    });

    const other = document.createElement('option');
    other.value = 'custom';
    other.textContent = 'Other...';
    itemSelect.appendChild(other);
  } catch (err) {
    console.error('❌ Failed to load catering items:', err);
  }
})();

itemSelect.addEventListener('change', () => {
  if (itemSelect.value === 'custom') {
    customItemContainer.classList.remove('hidden');
    customItemInput.required = true;
  } else {
    customItemContainer.classList.add('hidden');
    customItemInput.required = false;
  }
});
