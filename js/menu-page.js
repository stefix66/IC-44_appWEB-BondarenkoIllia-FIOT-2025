// js/menu-page.js

const API_BASE_MENU = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  loadMenuPage();
});

async function loadMenuPage() {
  try {
    const res = await fetch(`${API_BASE_MENU}/api/menuitems`);

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const items = await res.json();

    const drinks = items.filter(
      (i) => (i.category || "").toLowerCase() === "drink" && i.availability
    );
    const desserts = items.filter(
      (i) => (i.category || "").toLowerCase() === "dessert" && i.availability
    );
    const pizza = items.filter(
      (i) => (i.category || "").toLowerCase() === "pizza" && i.availability
    );

    renderSection("menu-drinks", drinks);
    renderSection("menu-desserts", desserts);
    renderSection("menu-pizza", pizza);
  } catch (error) {
    console.error("Error loading menu page:", error);
    ["menu-drinks", "menu-desserts", "menu-pizza"].forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;
      container.innerHTML = `
        <div class="col-12 text-center text-danger">
          Не вдалося завантажити меню. Спробуйте пізніше.
        </div>
      `;
    });
  }
}

function renderSection(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="col-12 text-center text-muted">
        Наразі немає позицій у цій категорії.
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  items.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 col-12";

    const imgSrc =
      item.imageurl && item.imageurl !== ""
        ? item.imageurl
        : "images/placeholder.jpg"; // можеш додати свій плейсхолдер

    const price =
      typeof item.price === "string" || typeof item.price === "number"
        ? Number(item.price).toFixed(2)
        : item.price;

    const ratingValue = getRatingByIndex(index);
    const reviewsCount = getReviewsByIndex(index);
    const starsHtml = buildStarsHtml(ratingValue);

    col.innerHTML = `
      <div class="menu-thumb">
        <img src="${imgSrc}" class="img-fluid menu-image" alt="${item.name}">

        <div class="menu-info d-flex flex-wrap align-items-center">
          <h4 class="mb-0">${item.name}</h4>

          <span class="price-tag bg-white shadow-lg ms-4">
            <small>₴</small>${price}
          </span>

          <div class="d-flex flex-wrap align-items-center w-100 mt-2">
            <h6 class="reviews-text mb-0 me-3">${ratingValue.toFixed(1)}/5</h6>

            <div class="reviews-stars">
              ${starsHtml}
            </div>

            <p class="reviews-text mb-0 ms-4">${reviewsCount} Відгуків</p>
          </div>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

// "фейкові" рейтинги для збереження дизайну
function getRatingByIndex(index) {
  const baseRatings = [4.4, 3.8, 4.1, 4.7, 3.9, 4.2];
  return baseRatings[index % baseRatings.length];
}

function getReviewsByIndex(index) {
  const base = [128, 64, 32, 84, 56, 76];
  return base[index % base.length];
}

function buildStarsHtml(rating) {
  const fullStars = Math.round(rating);
  let html = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      html += `<i class="bi-star-fill reviews-icon"></i>`;
    } else {
      html += `<i class="bi-star reviews-icon"></i>`;
    }
  }

  return html;
}
