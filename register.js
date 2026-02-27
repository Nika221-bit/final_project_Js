document.addEventListener('DOMContentLoaded', () => {
  // redirect if already logged in
  if (localStorage.getItem('authToken')) {
    window.location.href = 'index.html';
    return;
  }
  const form = document.getElementById('registerForm');
  const msgDiv = document.getElementById('registerMessage');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgDiv.textContent = '';

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (password !== confirm) {
      msgDiv.textContent = 'Passwords do not match';
      msgDiv.style.color = 'red';
      return;
    }

    const payload = {
      name,
      phoneNumber: phone,
      email,
      password
    };

    async function safeJson(response) {
      const t = await response.text();
      try { return t ? JSON.parse(t) : {}; } catch (_){ return {}; }
    }

    try {
      const res = await fetch('https://hotelbooking.stepprojects.ge/api/Users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await safeJson(res);
      if (!res.ok) {
        msgDiv.textContent = data.message || 'Registration failed';
        msgDiv.style.color = 'red';
      } else {
        msgDiv.textContent = 'Registered successfully. Redirecting to login...';
        msgDiv.style.color = 'green';
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      }
    } catch (err) {
      msgDiv.textContent = 'Error: ' + err.message;
      msgDiv.style.color = 'red';
    }
  });
});