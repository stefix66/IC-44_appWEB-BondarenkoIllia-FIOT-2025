// js/admin-menu.js

const API_BASE_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  loadMenuItems();
});

async function loadMenuItems() {
  const tbody = document.getElementById("menu-table-body");

  try {
    const response = await fetch(`${API_BASE_URL}/api/menuitems`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const items = await response.json();

    // Очищаємо таблицю
    tbody.innerHTML = "";

    items.forEach((item) => {
      const tr = document.createElement("tr");

      const availabilityText = item.availability
        ? "Є в наявності"
        : "Недоступно";

      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.description ?? "-"}</td>
        <td>${item.category ?? "-"}</td>
        <td>${item.price} грн</td>
        <td>
            ${
              item.imageurl
                ? `<a href="${item.imageurl}" target="_blank">Переглянути</a>`
                : "-"
            }
        </td>
        <td>${availabilityText}</td>
        <td>
          <button class="btn btn-sm btn-outline-warning me-2">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading menu items:", error);

    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Не вдалося завантажити меню. Спробуйте пізніше.
        </td>
      </tr>
    `;
  }
}
