// js/admin-menu.js

const API_BASE_URL = "http://localhost:5000";

let currentEditId = null;   // null = додаємо нову, число = редагуємо існуючу
let menuModal = null;
let lastItems = [];         // кеш отриманих елементів меню

document.addEventListener("DOMContentLoaded", () => {
  const modalEl = document.getElementById("menuModal");
  menuModal = new bootstrap.Modal(modalEl);

  const addBtn = document.getElementById("add-menu-btn");
  const saveBtn = document.getElementById("menu-save-btn");

  addBtn.addEventListener("click", onAddClick);
  saveBtn.addEventListener("click", onSaveClick);

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
    lastItems = items; // збережемо для редагування

    tbody.innerHTML = "";

    items.forEach((item) => {
      const tr = document.createElement("tr");

      const availabilityText = item.availability
        ? "Є в наявності"
        : "Недоступно";

      const imageHref = item.imageurl
        ? (item.imageurl.startsWith("http")
            ? item.imageurl
            : `${API_BASE_URL}/${item.imageurl}`)
        : null;

      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.description ?? "-"}</td>
        <td>${item.category ?? "-"}</td>
        <td>${item.price} грн</td>
        <td>
          ${
            imageHref
              ? `<a href="${imageHref}" target="_blank">Переглянути</a>`
              : "-"
          }
        </td>
        <td>${availabilityText}</td>
        <td>
          <button class="btn btn-sm btn-outline-warning me-2 edit-btn" data-id="${
            item.menuitemid
          }">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${
            item.menuitemid
          }">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Повісити обробники на кнопки
    attachRowHandlers();

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

// Обробка кліку "Додати нову страву"
function onAddClick() {
  currentEditId = null;
  document.getElementById("menuModalTitle").textContent = "Нова страва";

  document.getElementById("menu-name").value = "";
  document.getElementById("menu-desc").value = "";
  document.getElementById("menu-category").value = "";
  document.getElementById("menu-price").value = "";
  document.getElementById("menu-imageurl").value = "";
  document.getElementById("menu-availability").checked = true;

  menuModal.show();
}

// Обробка кнопки "Зберегти" в модалці
async function onSaveClick() {
  const body = {
    name: document.getElementById("menu-name").value.trim(),
    description: document.getElementById("menu-desc").value.trim(),
    category: document.getElementById("menu-category").value.trim(),
    price: parseFloat(document.getElementById("menu-price").value),
    imageurl: document.getElementById("menu-imageurl").value.trim(),
    availability: document.getElementById("menu-availability").checked,
  };

  if (!body.name || isNaN(body.price)) {
    alert("Вкажіть назву та коректну ціну.");
    return;
  }

  try {
    let url = `${API_BASE_URL}/api/menuitems`;
    let method = "POST";

    if (currentEditId !== null) {
      url = `${API_BASE_URL}/api/menuitems/${currentEditId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    menuModal.hide();
    await loadMenuItems();
  } catch (error) {
    console.error("Error saving menu item:", error);
    alert("Не вдалося зберегти страву.");
  }
}

// Вішамо обробники на кнопки в рядках таблиці
function attachRowHandlers() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm("Видалити цю страву?");

      if (!confirmDelete) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/menuitems/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        await loadMenuItems();
      } catch (error) {
        console.error("Error deleting menu item:", error);
        alert("Не вдалося видалити страву.");
      }
    });
  });

  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = lastItems.find((i) => i.menuitemid == id);
      if (!item) return;

      currentEditId = id;
      document.getElementById("menuModalTitle").textContent = "Редагувати страву";

      document.getElementById("menu-name").value = item.name ?? "";
      document.getElementById("menu-desc").value = item.description ?? "";
      document.getElementById("menu-category").value = item.category ?? "";
      document.getElementById("menu-price").value = item.price ?? "";
      document.getElementById("menu-imageurl").value = item.imageurl ?? "";
      document.getElementById("menu-availability").checked = !!item.availability;

      menuModal.show();
    });
  });
}
