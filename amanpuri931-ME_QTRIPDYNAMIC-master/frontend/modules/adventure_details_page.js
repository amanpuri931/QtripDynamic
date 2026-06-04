import config from "../conf/index.js";

/**
 * Extraction of adventure ID parameter from URL query string
 */
function getAdventureIdFromURL(search) {
  const params = new URLSearchParams(search);
  return params.get("adventure");
}

/**
 * Fetch detailed information about a specific adventure from the backend REST API
 */
async function fetchAdventureDetails(adventureId) {
  try {
    const url = `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Dynamic DOM manipulation to inject text details into the page layout
 */
function addAdventureDetailsToDOM(adventure) {
  document.getElementById("adventure-name").innerHTML = adventure.name;
  document.getElementById("adventure-subtitle").innerHTML = adventure.subtitle;
  document.getElementById("adventure-content").innerHTML = adventure.content;

  const photoGallery = document.getElementById("photo-gallery");
  photoGallery.innerHTML = "";

  adventure.images.forEach((imageUrl) => {
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.className = "activity-card-image img-fluid mb-3";
    imgElement.alt = "Adventure Image Element";
    photoGallery.appendChild(imgElement);
  });
}

/**
 * Creating a Bootstrap Photo Gallery Carousel structure
 */
function addBootstrapPhotoGallery(images) {
  const photoGalleryContainer = document.getElementById("photo-gallery");
  
  photoGalleryContainer.innerHTML = `
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators" id="carousel-indicators-container"></div>
      <div class="carousel-inner" id="carousel-inner-container"></div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;

  const indicatorsContainer = document.getElementById("carousel-indicators-container");
  const innerContainer = document.getElementById("carousel-inner-container");

  images.forEach((imageUrl, index) => {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-target", "#carouselExampleIndicators");
    button.setAttribute("data-bs-slide-to", index.toString());
    
    const itemDiv = document.createElement("div");

    if (index === 0) {
      button.className = "active";
      button.setAttribute("aria-current", "true");
      itemDiv.className = "carousel-item active";
    } else {
      itemDiv.className = "carousel-item";
    }
    
    button.setAttribute("aria-label", `Slide ${index + 1}`);
    indicatorsContainer.appendChild(button);

    itemDiv.innerHTML = `
      <img src="${imageUrl}" class="d-block w-100 activity-card-image" alt="Adventure Gallery Slide">
    `;
    innerContainer.appendChild(itemDiv);
  });
}

/**
 * Show/hide reservation panels based on adventure availability
 */
function conditionalRenderingOfReservationPanel(adventure) {
  const availablePanel = document.getElementById("reservation-panel-available");
  const soldOutPanel = document.getElementById("reservation-panel-sold-out");

  if (adventure.available) {
    availablePanel.style.display = "block";
    soldOutPanel.style.display = "none";
    document.getElementById("reservation-person-cost").innerHTML = adventure.costPerHead;
  } else {
    availablePanel.style.display = "none";
    soldOutPanel.style.display = "block";
  }
}

/**
 * Calculates the total cost based on number of persons and updates the DOM
 * NOTE: Updated element ID target to 'reservation-cost' to fix the DOM testing assertion failure
 */
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  const totalCostElement = document.getElementById("reservation-cost");
  const totalCost = adventure.costPerHead * persons;
  totalCostElement.innerHTML = totalCost;
}

/**
 * Capture reservation form data and submit via POST fetch call
 */
function captureFormSubmit(adventure) {
  const form = document.getElementById("myForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: form.elements["name"].value,
      date: form.elements["date"].value,
      person: form.elements["person"].value,
      adventure: adventure.id,
    };

    try {
      const url = `${config.backendEndpoint}/reservations/new`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Success!");
        window.location.reload();
      } else {
        alert("Failed!");
      }
    } catch (error) {
      alert("Failed!");
    }
  });
}

/**
 * Displays the reserved banner if the adventure has been previously reserved
 */
function showBannerIfAlreadyReserved(adventure) {
  const reservedBanner = document.getElementById("reserved-banner");
  if (adventure.reserved) {
    reservedBanner.style.display = "block";
  } else {
    reservedBanner.style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  calculateReservationCostAndUpdateDOM,
  captureFormSubmit,
  showBannerIfAlreadyReserved,
};