// js/manager.js
import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { requireAuth } from './authGuard.js';

// Ensure user is logged in
requireAuth('manager').then(() => {

  async function renderList(collectionName, containerId, fields = [], icon = '', color = '') {
    const container = document.getElementById(containerId);
    container.innerHTML = '<p class="text-gray-400 text-sm">Loading...</p>';

    try {
      const snapshot = await getDocs(collection(db, collectionName));
      container.innerHTML = '';

      if (snapshot.empty) {
        container.innerHTML = '<p class="text-gray-500">No bookings found.</p>';
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();

        const card = document.createElement('div');
        card.className = `border-l-4 ${color} bg-white p-4 rounded shadow flex gap-4`;

        card.innerHTML = `
          <div class="text-2xl mt-1 text-gray-500">${icon}</div>
          <div class="text-sm space-y-1">
            ${fields.map(f => `
              <div><span class="font-semibold text-gray-700">${f.label}:</span> ${data[f.key] || '-'}</div>
            `).join('')}
          </div>
        `;
        container.appendChild(card);
      });

    } catch (error) {
      container.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
  }

  // Load various bookings
  renderList('resortBookings', 'resortList', [
    { key: 'name', label: 'Resort Type' },
    { key: 'seats', label: 'Guests' },
  ], '🏨', 'border-blue-400');

  renderList('movieBookings', 'movieList', [
    { key: 'name', label: 'Movie Name' },
    { key: 'seats', label: 'Seats' },
  ], '🎬', 'border-yellow-400');

  // Salon Bookings
  renderList('salonBookings', 'salonList', [
    { key: 'service', label: 'Service' },
    { key: 'appointmentTime', label: 'Appointment Time' },
  ], '💇‍♀️', 'border-pink-400');

  // Fitness Center Bookings
  renderList('fitnessBookings', 'fitnessList', [
    { key: 'equipment', label: 'Equipment' },
    { key: 'bookingTime', label: 'Booking Time' },
  ], '🏋️', 'border-red-400');


  renderList('partyBookings', 'partyList', [
    { key: 'partyType', label: 'Party Type' },
    { key: 'partyTime', label: 'Time' },
  ], '🎉', 'border-purple-400');

}).catch(() => {
  document.body.innerHTML = `
    <div class="text-center mt-20 text-red-600 text-lg font-semibold">
      Access denied. Please <a href="/index.html" class="underline text-blue-500">login</a> to continue.
    </div>
  `;
});
