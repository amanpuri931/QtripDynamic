import config from "../conf/index.js";

async function init() {
  // Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  // Updates the DOM with the cities
  if (cities) {
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  }
}

// Implementation of fetch call
async function fetchCities() {
  // 1. Fetch cities using the Backend API and return the data
  try {
    let response = await fetch(config.backendEndpoint + "/cities");
    let data = await response.json();
    return data;
  } catch (e) {
    // Return null if the fetch request fails
    return null;
  }
}

// Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // 1. Create the container div for the card (column)
  let cityCard = document.createElement("div");
  cityCard.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

  // 2. Populate the City details and insert those details into the DOM
  // Note: The <a> tag uses the city id for both the href and the id attribute as required
  cityCard.innerHTML = `
    <a href="pages/adventures/?city=${id}" id="${id}">
      <div class="tile">
        <img src="${image}" alt="${city}" class="img-fluid" />
        <div class="tile-text text-center">
          <h5>${city}</h5>
          <p>${description}</p>
        </div>
      </div>
    </a>
  `;

  // 3. Append the card to the parent container
  document.getElementById("data").appendChild(cityCard);
}

export { init, fetchCities, addCityToDOM };