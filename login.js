document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("authToken")) {
    window.location.href = "index.html";
    return;
  }

  const form = document.getElementById("loginForm");
  const msgDiv = document.getElementById("loginMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msgDiv.textContent = "Logging in...";
    msgDiv.style.color = "blue";

    const phoneNumber = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://rentcar.stepprojects.ge/api/Users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        msgDiv.textContent = data?.message || "Login failed";
        msgDiv.style.color = "red";
        console.log("Server error:", data);
        return;
      }

      const token = data.token || data.accessToken;

      if (!token) {
        msgDiv.textContent = "Token not returned from server";
        msgDiv.style.color = "red";
        console.log("Response:", data);
        return;
      }

      localStorage.setItem("authToken", token);

      msgDiv.textContent = "Login successful!";
      msgDiv.style.color = "green";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);

    } catch (err) {
      msgDiv.textContent = "Network error";
      msgDiv.style.color = "red";
      console.error(err);
    }
  });
});