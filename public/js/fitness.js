import { db, auth } from './firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { requireAuth } from './authGuard.js';

const form = document.getElementById('fitnessForm');
const bookingsSection = document.getElementById('fitnessBookings');

requireAuth().then(() => {
  const user = auth.currentUser;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const equipment = document.getElementById('equipment').value.trim();
    const bookingTime = document.getElementById('bookingTime').value;

    if (!equipment || !bookingTime) {
      alert("Please provide both equipment and booking time.");
      return;
    }

    try {
      await addDoc(collection(db, 'fitnessBookings'), {
        uid: user.uid,
        equipment,
        bookingTime,
        timestamp: serverTimestamp()
      });

      alert("✅ Fitness session booked!");
      form.reset();
      loadBookings(user.uid);
    } catch (err) {
      console.error("Error booking session:", err);
      alert("❌ Failed to book session. Please try again.");
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
  bookingsSection.innerHTML = `<h2 class="text-lg font-semibold text-red-700">Your Bookings</h2>
                               <p class="text-gray-500">Loading...</p>`;

  try {
    const q = query(collection(db, 'fitnessBookings'), where('uid', '==', uid));
    const snapshot = await getDocs(q);

    bookingsSection.innerHTML = `<h2 class="text-lg font-semibold text-red-700">Your Bookings</h2>`;

    if (snapshot.empty) {
      bookingsSection.innerHTML += `<p class="text-gray-500">No fitness sessions booked yet.</p>`;
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const time = data.bookingTime
        ? new Date(data.bookingTime).toLocaleString()
        : "Not specified";

      const bookedAt = data.timestamp?.seconds
        ? new Date(data.timestamp.seconds * 1000).toLocaleString()
        : "Unknown time";

      bookingsSection.innerHTML += `
        <div class="p-3 border-l-4 border-red-500 bg-red-50 rounded shadow-sm">
          <p><strong>Equipment:</strong> ${data.equipment}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p class="text-gray-500 text-xs">Booked on: ${bookedAt}</p>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
    bookingsSection.innerHTML += `<p class="text-red-500">Failed to load your bookings.</p>`;
  }
}
