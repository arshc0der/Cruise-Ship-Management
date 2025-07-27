import { db, auth } from './firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { requireAuth } from './authGuard.js';

const form = document.getElementById('partyForm');
const partyTypeSelect = document.getElementById('partyType');
const customTypeInput = document.getElementById('customPartyType');
const partyTimeInput = document.getElementById('partyTime');
const bookingsContainer = document.getElementById('partyBookings');

requireAuth().then(() => {
  const user = auth.currentUser;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let type = partyTypeSelect.value;
    if (type === 'Other') {
      type = customTypeInput.value.trim();
      if (!type) {
        alert("Please enter your custom party type.");
        return;
      }
    }

    const time = partyTimeInput.value;

    try {
      await addDoc(collection(db, 'partyBookings'), {
        uid: user.uid,
        partyType: type,
        partyTime: time,
        timestamp: serverTimestamp()
      });

      alert("🎉 Party hall booked!");
      form.reset();
      customTypeInput.classList.add('hidden');
      loadBookings(user.uid);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("❌ Failed to book party hall.");
    }
  });

  loadBookings(user.uid);
}).catch(() => {
  document.body.innerHTML = `
    <div class="text-center mt-20 text-red-600 text-lg font-semibold">
      Access denied. Please <a href="/index.html" class="underline text-blue-500">login</a> to continue.
    </div>
  `;
});

async function loadBookings(uid) {
  bookingsContainer.innerHTML = `
    <h2 class="text-lg font-semibold text-purple-700">Your Bookings</h2>
    <p class="text-gray-500 text-sm">Loading...</p>
  `;

  try {
    const q = query(collection(db, 'partyBookings'), where('uid', '==', uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      bookingsContainer.innerHTML += `<p class="text-sm text-gray-500">No bookings yet.</p>`;
      return;
    }

    bookingsContainer.innerHTML = `<h2 class="text-lg font-semibold text-purple-700">Your Bookings</h2>`;

    snapshot.forEach(doc => {
      const data = doc.data();
      const time = data.partyTime
        ? new Date(data.partyTime).toLocaleString()
        : 'Unknown Time';

      bookingsContainer.innerHTML += `
        <div class="mt-3 p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
          <p><strong>Type:</strong> ${data.partyType}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p class="text-xs text-gray-500">Booked on: ${new Date(data.timestamp?.seconds * 1000).toLocaleString()}</p>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
    bookingsContainer.innerHTML += `<p class="text-red-500">Failed to load bookings.</p>`;
  }
}
