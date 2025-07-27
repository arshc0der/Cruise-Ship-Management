import { db, auth } from './firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { requireAuth } from './authGuard.js';

const bookingContainer = document.getElementById('salonBookings');

requireAuth().then(async () => {
  const user = auth.currentUser;

  document.getElementById('salonForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const service = document.getElementById('service').value;
    const appointmentTime = document.getElementById('appointmentTime').value;

    try {
      await addDoc(collection(db, 'salonBookings'), {
        uid: user.uid,
        service,
        appointmentTime,
        timestamp: serverTimestamp()
      });
      alert("✅ Salon appointment booked!");
      e.target.reset();
      loadBookings(user.uid);
    } catch (err) {
      alert("❌ Booking failed: " + err.message);
    }
  });

  // Load user bookings initially
  loadBookings(user.uid);
}).catch(() => {
  document.body.innerHTML = `
    <div class="text-center mt-20 text-red-600 text-lg font-semibold">
      Access denied. Please <a href="/index.html" class="underline text-blue-500">login</a> to continue.
    </div>
  `;
});

async function loadBookings(uid) {
  bookingContainer.innerHTML = `<h2 class="text-lg font-semibold text-pink-700">Your Bookings</h2>
                                <p class="text-gray-500">Loading...</p>`;

  try {
    const q = query(collection(db, 'salonBookings'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    bookingContainer.innerHTML = `<h2 class="text-lg font-semibold text-pink-700">Your Bookings</h2>`;

    if (snapshot.empty) {
      bookingContainer.innerHTML += `<p class="text-gray-500">No salon appointments found.</p>`;
    } else {
      snapshot.forEach(doc => {
        const { service, appointmentTime, timestamp } = doc.data();
        const timeStr = appointmentTime
          ? new Date(appointmentTime).toLocaleString()
          : "Not specified";
        const bookedAt = timestamp?.seconds
          ? new Date(timestamp.seconds * 1000).toLocaleString()
          : "Unknown time";

        bookingContainer.innerHTML += `
          <div class="p-3 border-l-4 border-pink-500 bg-pink-50 rounded shadow-sm">
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Time:</strong> ${timeStr}</p>
            <p class="text-gray-500 text-xs">Booked on: ${bookedAt}</p>
          </div>
        `;
      });
    }
  } catch (err) {
    bookingContainer.innerHTML += `<p class="text-red-500">Failed to load bookings: ${err.message}</p>`;
  }
}
