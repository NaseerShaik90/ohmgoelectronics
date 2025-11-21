// ==================== PRODUCT DATA ====================
const products = [
  { name: "Arduino UNO R3", price: 575, image: "" },
  { name: "Arduino Nano", price: 250, image: "" },
  { name: "ESP8266 NodeMCU", price: 300, image: "" },
  { name: "LED Red", price: 2, image: "" }
];

// Default fallback image
const fallbackImg = "https://dummyimage.com/300x300/cccccc/000000.png&text=No+Image";

// ==================== DISPLAY PRODUCTS ====================
function displayProducts(list) {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    const imgSrc = product.image ? product.image : fallbackImg;

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" onclick="changeImage('${product.name}')">
      <h3>${product.name}</h3>
      <p>Price: ₹${product.price}</p>
      <button onclick="addToCart('${product.name}')">Add to Cart</button>
    `;

    container.appendChild(card);
  });
}

// ==================== CHANGE IMAGE SYSTEM ====================
function changeImage(name) {
  const product = products.find(p => p.name === name);

  const choice = confirm("OK = Upload Image\nCancel = Enter URL");

  // ---- Upload image ----
  if (choice) {
    const uploader = document.getElementById("imgUploader");
    uploader.click();

    uploader.onchange = () => {
      const file = uploader.files[0];
      if (!file) return;

      compressImage(file, (compressedBase64) => {
        product.image = compressedBase64;
        displayProducts(products);
      });
    };
  }

  // ---- URL option ----
  else {
    const url = prompt("Enter image URL:");
    if (url) {
      product.image = url;
      displayProducts(products);
    }
  }
}

// ==================== IMAGE COMPRESSION SYSTEM ====================
function compressImage(file, callback) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const maxSize = 300;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/jpeg", 0.7);
      callback(compressed);
    };
  };

  reader.readAsDataURL(file);
}

// ==================== CART SYSTEM ====================
let cart = [];

function addToCart(name) {
  const data = products.find(p => p.name === name);
  cart.push(data);
  updateCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  updateCart();
}

function updateCart() {
  const box = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-price");

  box.innerHTML = "";

  if (cart.length === 0) {
    box.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "";
    document.getElementById("continue-btn").style.display = "none";
    document.getElementById("cart-count").textContent = 0;
    return;
  }

  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;

    box.innerHTML += `
      <div class="cart-item">
        <span>${item.name} - ₹${item.price}</span>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
  });

  totalEl.textContent = `Total: ₹${total}`;
  document.getElementById("continue-btn").style.display = "block";
  document.getElementById("cart-count").textContent = cart.length;
}

// ==================== SEARCH ====================
document.getElementById("search").addEventListener("input", function () {
  const v = this.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(v));
  displayProducts(filtered.length ? filtered : products);
});

// ==================== INITIAL LOAD ====================
displayProducts(products);
updateCart();
