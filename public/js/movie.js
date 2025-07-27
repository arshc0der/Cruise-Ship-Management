import { db, auth } from './firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { requireAuth } from './authGuard.js';

const movieList = document.getElementById('movieBookings');

requireAuth().then(async () => {
  const user = auth.currentUser;

  document.getElementById('movieForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('movieName').value;
    const seats = document.getElementById('movieSeats').value;

    try {
      await addDoc(collection(db, 'movieBookings'), {
        uid: user.uid,
        name,
        seats: Number(seats),
        timestamp: serverTimestamp()
      });
      alert("🎬 Movie booked successfully!");
      e.target.reset();
      loadMovies(user.uid);
    } catch (err) {
      alert("❌ Movie booking failed: " + err.message);
      console.error(err);
    }
  });

  loadMovies(user.uid);
}).catch(() => {
  document.body.innerHTML = `<div class="text-center mt-20 text-red-600 text-lg font-semibold">
    Access denied. Please <a href="/index.html" class="underline text-blue-500">login</a> to continue.
  </div>`;
});

async function loadMovies(uid) {
  movieList.innerHTML = "<p class='text-gray-400'>Loading your movie bookings...</p>";
  try {
    const q = query(collection(db, 'movieBookings'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    movieList.innerHTML = "";

    if (snapshot.empty) {
      movieList.innerHTML = "<p class='text-gray-500'>No movie bookings found.</p>";
    }

    snapshot.forEach(doc => {
      const { name, seats, timestamp } = doc.data();
      const time = timestamp?.seconds ? new Date(timestamp.seconds * 1000).toLocaleString() : "Unknown time";
      movieList.innerHTML += `
        <div class="p-3 border-l-4 border-green-500 bg-green-50 rounded shadow-sm">
          <p><strong>Movie:</strong> ${name}</p>
          <p><strong>Seats:</strong> ${seats}</p>
          <p class="text-gray-500 text-xs">🎟 ${time}</p>
        </div>
      `;
    });
  } catch (err) {
    movieList.innerHTML = `<p class='text-red-500'>Error loading movie bookings.</p>`;
  }
}
