import config from "../conf/index.js";

/**
 * Fetch all reservations from the backend server
 */
async function fetchReservations() {
  try {
    const url = `${config.backendEndpoint}/reservations`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Dynamically updates the DOM to display reservations inside a structured table format
 */
function addReservationToTable(reservations) {
  const noReservationBanner = document.getElementById("no-reservation-banner");
  const tableParent = document.getElementById("reservation-table-parent");
  const tableBody = document.getElementById("reservation-table");

  // Explicit array checking ensures empty array collections [] cleanly execute the banner setup
  if (reservations && reservations.length > 0) {
    noReservationBanner.style.display = "none";
    tableParent.style.display = "block";
  } else {
    noReservationBanner.style.display = "block";
    tableParent.style.display = "none";
    return;
  }

  tableBody.innerHTML = "";

  reservations.forEach((booking) => {
    const bookingDate = new Date(booking.date);
    const serverTime = new Date(booking.time);

    const formattedDate = bookingDate.toLocaleDateString("en-IN");
    const formattedTime = serverTime.toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true
    }).replace(" at ", ", ");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="fw-bold">${booking.id}</td>
      <td>${booking.name}</td>
      <td>${booking.adventureName}</td>
      <td>${booking.person}</td>
      <td>${formattedDate}</td>
      <td>${booking.price}</td>
      <td>${formattedTime}</td>
      <td>
        <div class="reservation-visit-button" id="${booking.id}">
          <a href="../detail/?adventure=${booking.adventure}">Visit Adventure</a>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

export { fetchReservations, addReservationToTable };