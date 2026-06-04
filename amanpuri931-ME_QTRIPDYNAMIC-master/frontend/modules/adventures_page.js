import config from "../conf/index.js";

/**
 * Extraction of city parameter from URL
 */
function getCityFromURL(search) {
  const params = new URLSearchParams(search);
  return params.get("city");
}

/**
 * Fetch list of adventures from backend
 */
async function fetchAdventures(city) {
  try {
    const url = `${config.backendEndpoint}/adventures?city=${city}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Dynamic injection of adventure cards into the DOM
 */
function addAdventureToDOM(adventures) {
  const dataContainer = document.getElementById("data");
  dataContainer.innerHTML = ""; // Clear existing elements before loading new ones

  adventures.forEach((adventure) => {
    const div = document.createElement("div");
    div.className = "col-6 col-lg-3 mb-4";
    div.innerHTML = `
      <a href="detail/?adventure=${adventure.id}" id="${adventure.id}">
        <div class="activity-card">
          <div class="category-banner">${adventure.category}</div>
          <img src="${adventure.image}" alt="${adventure.name}" class="img-fluid" />
          <div class="p-2 d-flex justify-content-between">
            <p>${adventure.name}</p>
            <p>₹${adventure.costPerHead}</p>
          </div>
          <div class="p-2 d-flex justify-content-between">
            <p>Duration</p>
            <p>${adventure.duration} Hours</p>
          </div>
        </div>
      </a>
    `;
    dataContainer.appendChild(div);
  });
}

/**
 * Filter adventures by category list array
 */
function filterByCategory(list, categoryList) {
  return list.filter((adventure) => categoryList.includes(adventure.category));
}

/**
 * Filter adventures by duration low and high bounds
 */
function filterByDuration(list, low, high) {
  return list.filter((adventure) => adventure.duration >= low && adventure.duration <= high);
}

/**
 * Core routing filter logic matching both duration and category options
 */
function filterFunction(list, filters) {
  let filteredList = list;

  // 1. Process category filters if selected
  if (filters["category"].length > 0) {
    filteredList = filterByCategory(filteredList, filters["category"]);
  }

  // 2. Process duration filters if selected
  if (filters["duration"] && filters["duration"] !== "") {
    const [low, high] = filters["duration"].split("-");
    filteredList = filterByDuration(filteredList, parseInt(low), parseInt(high));
  }

  return filteredList;
}

/**
 * Serialization of filter state to LocalStorage
 */
function saveFiltersToLocalStorage(filters) {
  localStorage.setItem("filters", JSON.stringify(filters));
}

/**
 * Deserialization of filter state from LocalStorage
 */
function getFiltersFromLocalStorage() {
  return JSON.parse(localStorage.getItem("filters"));
}

/**
 * Updates both the category pill elements and the duration selection box
 */
function generateFilterPillsAndUpdateDOM(filters) {
  const categoryListContainer = document.getElementById("category-list");
  categoryListContainer.innerHTML = "";

  // Populate category pills
  filters["category"].forEach((category) => {
    const pill = document.createElement("div");
    pill.className = "category-filter";
    pill.innerText = category;
    categoryListContainer.appendChild(pill);
  });

  // Keep duration select box display value updated with the storage data
  if (filters["duration"]) {
    document.getElementById("duration-select").value = filters["duration"];
  }
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};