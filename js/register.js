// js/register.js
const API_BASE_URL = "http://localhost:5000";

console.log("✅ register.js підключено");

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌐 DOM завантажено");

  const form = document.getElementById("register-form");
  if (!form) {
    console.error("❌ Не знайдено форму #register-form");
    return;
  }

  console.log("✅ Форма знайдена, навішуємо submit handler");
  form.addEventListener("submit", onRegisterSubmit);
});

async function onRegisterSubmit(e) {
  e.preventDefault();
  console.log("➡️ Сабміт форми реєстрації");

  const nameEl = document.getElementById("reg-name");
  const emailEl = document.getElementById("reg-email");
  const passwordEl = document.getElementById("reg-password");

  console.log("🔍 Елементи:", { nameEl, emailEl, passwordEl });

  if (!nameEl || !emailEl || !passwordEl) {
    alert("Проблема з HTML: не знайдено один з інпутів. Перевір id полів.");
    return;
  }

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  if (!name || !email || !password) {
    alert("Заповніть усі обовʼязкові поля.");
    return;
  }

  const body = { name, email, password };
  console.log("📦 Дані, які відправляємо на бекенд:", body);

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("📥 Відповідь сервера статус:", res.status);

    const data = await res.json().catch(() => null);
    console.log("📦 Тіло відповіді:", data);

    if (!res.ok) {
      alert((data && data.message) || "Помилка реєстрації");
      return;
    }

    alert("Акаунт створено! Тепер увійдіть у систему.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("❌ Register error:", error);
    alert("Помилка з'єднання з сервером");
  }
}
