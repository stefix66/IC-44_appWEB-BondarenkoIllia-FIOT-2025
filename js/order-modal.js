// js/order-modal.js
const API_BASE_PUBLIC = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".delivery-form");
  if (!form) return;

  console.log("order-modal.js: форма замовлення знайдена");

  loadMenuFromApi();
  form.addEventListener("submit", onOrderFormSubmit);
});

async function loadMenuFromApi() {
  const select = document.getElementById("menu-items");
  if (!select) return;

  try {
    console.log("▶️ Завантажуємо меню для модалки…");
    const res = await fetch(`${API_BASE_PUBLIC}/api/menuitems`);
    console.log("◀️ Відповідь /api/menuitems:", res.status);

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const items = await res.json();
    console.log("Меню з сервера:", items);

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
      opt.value = item.menuitemid;
      const price = Number(item.price).toFixed(2);
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

async function onOrderFormSubmit(event) {
  event.preventDefault();
  console.log("📝 Сабміт форми замовлення");

  const token = localStorage.getItem("token");
  console.log("Токен з localStorage:", token ? token.slice(0, 25) + "..." : null);

  if (!token) {
    alert("Щоб оформити замовлення, спочатку увійдіть у систему.");
    window.location.href = "login.html";
    return;
  }

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
    menuItems: selectedMenuItems,
    payment,
    comment,
  };

  console.log("▶️ Надсилаємо замовлення:", body);

  try {
    const res = await fetch(`${API_BASE_PUBLIC}/api/public/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    console.log("◀️ Відповідь /api/public/orders:", res.status);

    const respData = await res.json().catch(() => ({}));
    console.log("Тіло відповіді /api/public/orders:", respData);

    if (res.status === 401) {
      alert("Сесія недійсна або завершена. Увійдіть ще раз.");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      alert(respData.message || `Помилка сервера: ${res.status}`);
      return;
    }

    alert(`Замовлення успішно оформлено! Номер замовлення: ${respData.order.orderid}`);

    event.target.reset();

    const modalEl = document.getElementById("BookingModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  } catch (error) {
    console.error("Error creating order:", error);
    alert("Не вдалося оформити замовлення. Спробуйте пізніше.");
  }
}
