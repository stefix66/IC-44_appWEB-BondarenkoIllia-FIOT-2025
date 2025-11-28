// js/login.js
const API_BASE = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 login.js підключено");

  const form = document.getElementById("login-form");

  if (!form) {
    console.error("❌ Форма логіну (#login-form) не знайдена!");
    return;
  }

  console.log("✅ Форма логіну знайдена, навішуємо submit handler");
  form.addEventListener("submit", onLoginSubmit);
});

async function onLoginSubmit(event) {
  event.preventDefault();
  console.log("📝 Сабміт форми логіну");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("📌 Введені дані:", { email, password: password ? "***" : "(порожньо)" });

  if (!email || !password) {
    alert("Будь ласка, заповніть Email та Пароль.");
    return;
  }

  try {
    console.log("▶️ Надсилаємо POST /api/auth/login ...");

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("◀️ Отримано відповідь:", res.status);

    const data = await res.json().catch(() => ({}));
    console.log("📦 Тіло відповіді login:", data);

    if (!res.ok) {
      console.warn("⚠️ Авторизація неуспішна:", data.message);
      alert(data.message || "Помилка авторизації");
      return;
    }

    console.log("✅ Авторизація успішна, зберігаємо токен...");

    localStorage.setItem("token", data.token);
    console.log("🔑 Токен збережено:", data.token.slice(0, 25) + "...");

    const roles = data.user?.roles || [];
    localStorage.setItem("roles", JSON.stringify(roles));
    console.log("📌 Ролі користувача:", roles);

    localStorage.setItem("userName", data.user.name);
localStorage.setItem("userEmail", data.user.email);


    alert("Вхід успішний!");

    
    if (roles.includes("Admin")) {
      console.log("➡️ Перенаправляємо до admin.html");
      window.location.href = "admin.html";
    } else {
      console.log("➡️ Перенаправляємо до cabinet.html");
      window.location.href = "cabinet.html";
    }

  } catch (error) {
    console.error("❌ Login error:", error);
    alert("Не вдалося підключитися до сервера");
  }
}
