// ✅ auth.js – Handles login, signup, and user session

function toggleForm(type) {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));

  if (type === "login") {
    document.getElementById("login-form").classList.remove("hidden");
    document.querySelector(".tab:nth-child(1)").classList.add("active");
  } else {
    document.getElementById("signup-form").classList.remove("hidden");
    document.querySelector(".tab:nth-child(2)").classList.add("active");
  }
}

toggleForm("login"); // default

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (username === "" || password === "") {
    showToast("Username and password required", "error");
    return;
  }

  const storedUser = localStorage.getItem("quizUser");
  const storedPass = localStorage.getItem("quizPass");

  if (username === storedUser && password === storedPass) {
    showToast("Login successful ✅");
    setTimeout(() => {
      localStorage.setItem("quizUser", username);
      window.location.href = "quiz.html";
    }, 1000);
  } else {
    showToast("Incorrect credentials ❌", "error");
  }
}

function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (username === "" || password === "") {
    showToast("Fill all fields", "error");
    return;
  }

  localStorage.setItem("quizUser", username);
  localStorage.setItem("quizPass", password);
  showToast("Signup successful ✅ Now login.", "success");
  toggleForm("login");
}