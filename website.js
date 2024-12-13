

// Function to navigate back
function goBack() {
  window.history.back();
}

// Open modals for login and sign-up
document.getElementById("loginBtn").addEventListener("click", () => {
  document.getElementById("loginModal").style.display = "flex";
});

document.getElementById("signUpBtn").addEventListener("click", () => {
  document.getElementById("signUpModal").style.display = "flex";
});

// Close any modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Login functionality
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const userData = JSON.parse(localStorage.getItem("users")) || [];
  const user = userData.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    alert("Login successful!");
    closeModal("loginModal");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Update UI based on login
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("signUpBtn").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("logoutBtn").style.display = "inline-block";
    document.getElementById("viewCheckoutHistoryBtn").style.display = "inline-block";
  } else {
    alert("Invalid username or password.");
  }
});

// Sign-up functionality
document.getElementById("signUpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const newUsername = document.getElementById("newUsername").value;
  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("newPassword").value;

  if (newUsername && email && newPassword) {
    const userData = JSON.parse(localStorage.getItem("users")) || [];
    if (userData.find((user) => user.username === newUsername)) {
      alert("Username already taken.");
    } else {
      userData.push({ username: newUsername, email, password: newPassword });
      localStorage.setItem("users", JSON.stringify(userData));
      alert("Sign Up successful!");
      closeModal("signUpModal");
    }
  } else {
    alert("Please fill in all fields.");
  }
});

// Toggle password visibility
function togglePassword(inputId, toggleId) {
  document.getElementById(toggleId).addEventListener("change", (e) => {
    const passwordInput = document.getElementById(inputId);
    passwordInput.type = e.target.checked ? "text" : "password";
  });
}

togglePassword("password", "toggleLoginPassword");
togglePassword("newPassword", "toggleSignUpPassword");

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  alert("You have logged out.");

  // Update UI on logout
  document.getElementById("loginBtn").style.display = "inline-block";
  document.getElementById("signUpBtn").style.display = "inline-block";
  document.getElementById("logoutBtn").style.display = "none";
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("viewCheckoutHistoryBtn").style.display = "none";
});

// Display checkout history
document.getElementById("viewCheckoutHistoryBtn").addEventListener("click", () => {
  displayCheckoutHistory();
});

function displayCheckoutHistory() {
  const historyContainer = document.getElementById("checkoutHistory");
  const checkoutHistory = JSON.parse(localStorage.getItem("checkoutHistory")) || [];

  historyContainer.innerHTML = ""; // Clear previous history

  if (checkoutHistory.length === 0) {
    historyContainer.innerHTML = "<p>No history found.</p>";
  } else {
    checkoutHistory.forEach((entry, index) => {
      const historyItem = document.createElement("div");
      historyItem.classList.add("history-item");
      historyItem.innerHTML = `
        <div>
          <img src="${entry.image}" alt="${entry.product}" class="history-item-image" />
        </div>
        <div>Product: ${entry.product}</div>
        <div>Price: $${entry.price}</div>
        <div>Date: ${entry.date}</div>
        <button class="delete-btn" onclick="deleteCheckoutHistory(${index})">Delete</button>
      `;
      historyContainer.appendChild(historyItem);
    });
  }

  document.getElementById("checkoutHistoryModal").style.display = "block";
}

// Close checkout history modal
function closeCheckoutHistoryModal() {
  document.getElementById("checkoutHistoryModal").style.display = "none";
}

// Delete checkout history entry
function deleteCheckoutHistory(index) {
  const checkoutHistory = JSON.parse(localStorage.getItem("checkoutHistory")) || [];
  checkoutHistory.splice(index, 1);
  localStorage.setItem("checkoutHistory", JSON.stringify(checkoutHistory));
  displayCheckoutHistory();
}

// Add product to cart with department
function addToCart(product, price, imageUrl, department) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ product, price, image: imageUrl, department });
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`${product} from ${department} department added to cart!`);
}

// Display cart with department
function viewCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <div>
        <img src="${item.image}" alt="${item.product}" class="cart-item-image" />
      </div>
      <div>Product: ${item.product}</div>
      <div>Price: $${item.price}</div>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(cartItem);
    total += item.price;
  });

  totalPrice.innerText = `Total: $${total}`;
  document.getElementById("cartModal").style.display = "block";
}

// Remove product from cart
function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  viewCart();
}

// Checkout functionality
function checkout() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!isLoggedIn) {
    alert("You need to log in to proceed with checkout.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const currentDateTime = new Date().toLocaleString();
  const checkoutHistory = JSON.parse(localStorage.getItem("checkoutHistory")) || [];

  cart.forEach((item) => {
    checkoutHistory.push({ ...item, date: currentDateTime });
  });

  localStorage.setItem("checkoutHistory", JSON.stringify(checkoutHistory));
  localStorage.removeItem("cart");

  alert("Checkout successful! Your cart has been cleared.");
  document.getElementById("cartModal").style.display = "none";
}

// Initialize UI based on login state
window.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  document.getElementById("loginBtn").style.display = isLoggedIn ? "none" : "inline-block";
  document.getElementById("signUpBtn").style.display = isLoggedIn ? "none" : "inline-block";
  document.getElementById("mainContent").style.display = isLoggedIn ? "block" : "none";
  document.getElementById("logoutBtn").style.display = isLoggedIn ? "inline-block" : "none";
  document.getElementById("viewCheckoutHistoryBtn").style.display = isLoggedIn ? "inline-block" : "none";
});
function closeCartModal() {
  document.getElementById("cartModal").style.display = "none";
}

