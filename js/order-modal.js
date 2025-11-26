// js/order-modal.js

const API_BASE_PUBLIC = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".delivery-form");
  if (!form) return;

  // підтягуємо список страв з бекенду
  loadMenuFromApi();

  // обробка сабміту форми
  form.addEventListener("submit", onOrderFormSubmit);
});

// завантажуємо страви з /api/menuitems і наповнюємо селект
async function loadMenuFromApi() {
  const select = document.getElementById("menu-items");
  if (!select) return;

  try {
    const res = await fetch(`${API_BASE_PUBLIC}/api/menuitems`);

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const items = await res.json();

    // очищаємо на всяк випадок
    select.innerHTML = "";

    const availableItems = items.filter((item) => item.availability);

    if (!availableItems.length) {
      const opt = document.createElement("option");
      opt.disabled = true;
      opt.textContent = "Немає доступних страв";
      select.appendChild(opt);
      return;
    }

    availableItems.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.menuitemid; // важливо: це FK для OrderItems
      const price =
        typeof item.price === "string" || typeof item.price === "number"
          ? Number(item.price).toFixed(2)
          : item.price;
      opt.textContent = `${item.name} — ${price} грн`;
      select.appendChild(opt);
    });
  } catch (error) {
    console.error("Error loading menu for order modal:", error);
    select.innerHTML = "";
    const opt = document.createElement("option");
    opt.disabled = true;
    opt.textContent = "Не вдалося завантажити меню";
    select.appendChild(opt);
  }
}

// відправка замовлення на бекенд
async function onOrderFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;
  const comment = document.getElementById("comment").value.trim();

  const menuSelect = document.getElementById("menu-items");
  const selectedMenuItems = Array.from(menuSelect.selectedOptions).map((opt) =>
    Number(opt.value)
  );

  if (!selectedMenuItems.length) {
    alert("Оберіть хоча б одну страву для замовлення.");
    return;
  }

  if (!name || !email || !address) {
    alert("Заповніть обов'язкові поля (ім'я, email, адреса).");
    return;
  }

  const body = {
    name,
    email,
    phone,
    address,
    menuItems: selectedMenuItems, // масив id меню
    payment,                      // Cash / Card / Online
    comment,
  };

  try {
    const res = await fetch(`${API_BASE_PUBLIC}/api/public/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    alert(`Замовлення успішно оформлено! Номер замовлення: ${data.order.orderid}`);

    // скидаємо форму
    event.target.reset();

    // закриваємо модальне вікно
    const modalEl = document.getElementById("BookingModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  } catch (error) {
    console.error("Error creating order:", error);
    alert("Не вдалося оформити замовлення. Спробуйте пізніше.");
  }
}
