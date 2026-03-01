document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('authToken')) {
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('registerForm');
  const msgDiv = document.getElementById('registerMessage');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgDiv.textContent = '';

    const fullName = document.getElementById('name').value.trim();
    const phoneNumber = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (password !== confirm) {
      msgDiv.textContent = 'Passwords do not match';
      msgDiv.style.color = 'red';
      return;
    }

    // fullname გავყოთ firstName და lastName-ზე
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      role:"user"
    };

    try {
      const res = await fetch('https://rentcar.stepprojects.ge/api/Users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        msgDiv.textContent = data.message || 'Registration failed';
        msgDiv.style.color = 'red';
        console.log(data);
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

// Burger menu toggle
const burgerBtn = document.getElementById("burgerBtn");
const navBar = document.getElementById("Nav-Bar");

burgerBtn.addEventListener("click", () => {
  navBar.classList.toggle("show");
});
