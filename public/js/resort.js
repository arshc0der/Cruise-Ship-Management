import { db, auth } from './firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { requireAuth } from './authGuard.js';

const resortList = document.getElementById('resortBookings');

requireAuth().then(async () => {
  const user = auth.currentUser;

  document.getElementById('resortForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('resortName').value;
    const seats = document.getElementById('resortSeats').value;

    try {
      await addDoc(collection(db, 'resortBookings'), {
        uid: user.uid,
        name,
        seats: Number(seats),
        timestamp: serverTimestamp()
      });
      alert("✅ Resort booking successful!");
      e.target.reset();
      loadResorts(user.uid);
    } catch (err) {
      alert("❌ Resort booking failed: " + err.message);
    }
  });

  // Load user's bookings
  loadResorts(user.uid);
}).catch(() => {
  document.body.innerHTML = `<div class="text-center mt-20 text-red-600 text-lg font-semibold">
    Access denied. Please <a href="/index.html" class="underline text-blue-500">login</a> to continue.
  </div>`;
});

async function loadResorts(uid) {
  resortList.innerHTML = "<p class='text-gray-400'>Loading your resort bookings...</p>";
  try {
    const q = query(collection(db, 'resortBookings'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    resortList.innerHTML = "";

    if (snapshot.empty) {
      resortList.innerHTML = "<p class='text-gray-500'>No resort bookings found.</p>";
    }

    snapshot.forEach(doc => {
      const { name, seats, timestamp } = doc.data();
      const time = timestamp?.seconds ? new Date(timestamp.seconds * 1000).toLocaleString() : "Unknown time";
      resortList.innerHTML += `
        <div class="p-3 border-l-4 border-blue-500 bg-blue-50 rounded shadow-sm">
          <p><strong>Type:</strong> ${name}</p>
          <p><strong>Guests:</strong> ${seats}</p>
          <p class="text-gray-500 text-xs">📅 ${time}</p>
        </div>
      `;
    });
  } catch (err) {
    resortList.innerHTML = `<p class='text-red-500'>Error loading resort bookings.</p>`;
  }
}
