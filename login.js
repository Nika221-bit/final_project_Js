document.addEventListener("DOMContentLoaded", () => {

  // თუ უკვე დალოგინებულია
  if (localStorage.getItem("authToken")) {
    window.location.href = "index.html";
    return;
  }

  const form = document.getElementById("loginForm");
  const msgDiv = document.getElementById("loginMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msgDiv.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://rentcar.stepprojects.ge/api/Users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        msgDiv.textContent = data.message || "Login failed";
        msgDiv.style.color = "red";
        return;
      }

      // Token შენახვა
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", email);

      msgDiv.textContent = "Login successful! Redirecting...";
      msgDiv.style.color = "green";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (err) {
      msgDiv.textContent = "Error: " + err.message;
      msgDiv.style.color = "red";
    }
  });
});
const burgerBtn = document.getElementById("burgerBtn");
const navBar = document.getElementById("Nav-Bar");

burgerBtn.addEventListener("click", () => {
  navBar.classList.toggle("show");
});
