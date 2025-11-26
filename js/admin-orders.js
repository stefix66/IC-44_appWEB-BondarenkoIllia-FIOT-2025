// js/admin-orders.js

const API_BASE_ORDERS = "http://localhost:5000";

let lastOrders = [];

document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
});

async function loadOrders() {
  const tbody = document.getElementById("orders-table-body");
  if (!tbody) return;

  try {
    const response = await fetch(`${API_BASE_ORDERS}/api/orders`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const orders = await response.json();
    lastOrders = orders;

    tbody.innerHTML = "";

    if (!orders.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted">
            Немає замовлень.
          </td>
        </tr>
      `;
      return;
    }

    orders.forEach((order) => {
      const tr = document.createElement("tr");

      const date = order.orderdate
        ? new Date(order.orderdate).toLocaleString("uk-UA")
        : "-";

      const amount = order.totalamount
        ? `${order.totalamount} грн`
        : "-";

      const paymentMap = {
        Cash: "Готівка",
        Card: "Картка",
        Online: "Онлайн-оплата",
      };

      const paymentText = paymentMap[order.paymentmethod] || order.paymentmethod || "-";

      tr.innerHTML = `
        <td>${order.orderid}</td>
        <td>${order.userid}</td>
        <td>${date}</td>
        <td>${amount}</td>
        <td>
          <select class="form-select form-select-sm order-status-select" data-id="${order.orderid}">
            <option value="New" ${order.status === "New" ? "selected" : ""}>Нове</option>
            <option value="Preparing" ${order.status === "Preparing" ? "selected" : ""}>Готується</option>
            <option value="Delivering" ${order.status === "Delivering" ? "selected" : ""}>Доставляється</option>
            <option value="Completed" ${order.status === "Completed" ? "selected" : ""}>Виконано</option>
          </select>
        </td>
        <td>${paymentText}</td>
        <td>${order.deliveryaddress ?? "-"}</td>
      `;

      tbody.appendChild(tr);
    });

    attachStatusHandlers();

  } catch (error) {
    console.error("Error loading orders:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Не вдалося завантажити замовлення. Спробуйте пізніше.
        </td>
      </tr>
    `;
  }
}


function attachStatusHandlers() {
  const selects = document.querySelectorAll(".order-status-select");

  selects.forEach((selectEl) => {
    selectEl.addEventListener("change", async () => {
      const orderId = selectEl.dataset.id;
      const newStatus = selectEl.value;

      
      const order = lastOrders.find((o) => o.orderid == orderId);
      const oldStatus = order ? order.status : null;

      try {
        const res = await fetch(`${API_BASE_ORDERS}/api/orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

       
        if (order) {
          order.status = newStatus;
        }

      } catch (error) {
        console.error("Error updating order status:", error);
        alert("Не вдалося оновити статус замовлення.");

       
        if (oldStatus) {
          selectEl.value = oldStatus;
        }
      }
    });
  });
}
