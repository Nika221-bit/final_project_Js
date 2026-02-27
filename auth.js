// Handle navigation links and dark mode toggling
 document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('auth-link-container');
  if (container) {
    const token = localStorage.getItem('authToken');
    if (token) {
      const phone = localStorage.getItem('userPhone') || '';
      container.innerHTML = `
        ${phone ? `<span class="nav-user" style="margin-right:8px;">Hi, ${phone}</span>` : ''}
        <a href="#" id="logoutLink">Logout</a>
      `;
      document.getElementById('logoutLink').addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('userPhone');
        location.reload();
      });
    } else {
      container.innerHTML = `
        <a href="login.html">Login</a> / <a href="register.html">Register</a>
      `;
    }
  }

  const darkModeBtn = document.getElementById("darkModeBtn");
  function applyDarkModeSetting() {
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      if (darkModeBtn) darkModeBtn.textContent = '☀️ Light Mode';
    } else {
      if (darkModeBtn) darkModeBtn.textContent = '🌙 Dark Mode';
    }
  }

  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️ Light Mode";
        localStorage.setItem('darkMode', 'enabled');
      } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  }

  applyDarkModeSetting();
});