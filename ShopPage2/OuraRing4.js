// State management
let selectedColor = "silver";
let selectedPrice = 349;
let selectedSize = null;
let currentStep = "finish";
let currentImageIndex = 1; // Track current image index

// Fixed images for image viewer (doesn't change with color selection)
const fixedImages = [
  "/assets/images/Silver.png",
  "/assets/images/Black.png",
  "/assets/images/Brushed.png",
  "/assets/images/Stealth.png",
  "/assets/images/Gold.png",
  "/assets/images/Rose.png",
];

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  loadFromStorage();
  updateCartDisplay();

  // Color selection event listeners
  document.querySelectorAll(".color-option").forEach((option) => {
    option.addEventListener("click", function () {
      selectColor(this.dataset.color, parseInt(this.dataset.price));
    });
  });

  // Size selection event listeners
  document.querySelectorAll(".size-option").forEach((option) => {
    option.addEventListener("click", function () {
      selectSize(this.dataset.size);
    });
  });

  // Image viewer event listeners
  document.querySelectorAll(".image-thumb").forEach((thumb) => {
    thumb.addEventListener("click", function () {
      selectImage(parseInt(this.dataset.image));
    });
  });
});

function loadFromStorage() {
  // Load from session storage
  const savedColor = sessionStorage.getItem("selectedColor");
  const savedPrice = sessionStorage.getItem("selectedPrice");
  const savedSize = sessionStorage.getItem("selectedSize");

  if (savedColor) {
    selectedColor = savedColor;
    selectedPrice = parseInt(savedPrice);
    updateColorSelection();
  }

  if (savedSize) {
    selectedSize = savedSize;
    updateSizeSelection();
  }
}

function selectColor(color, price) {
  selectedColor = color;
  selectedPrice = price;

  // Save to session storage
  sessionStorage.setItem("selectedColor", color);
  sessionStorage.setItem("selectedPrice", price.toString());

  updateColorSelection();
}

function selectSize(size) {
  selectedSize = size;
  sessionStorage.setItem("selectedSize", size);
  updateSizeSelection();
}

function updateColorSelection() {
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("selected");
    if (option.dataset.color === selectedColor) {
      option.classList.add("selected");
    }
  });

  document.getElementById("current-price").textContent =
    "$" + selectedPrice + " USD";
}

function updateSizeSelection() {
  document.querySelectorAll(".size-option").forEach((option) => {
    option.classList.remove("selected");
    if (option.dataset.size === selectedSize) {
      option.classList.add("selected");
    }
  });
}

function updateImages() {
  // Images are now fixed, no need to update thumbnails based on color
  // Thumbnails always show the same 6 images
}

function updateBackgroundImage() {
  // Use fixed images array instead of color-specific images
  const imageSection = document.querySelector(".image-section");

  if (fixedImages[currentImageIndex - 1]) {
    imageSection.style.backgroundImage = `url('${
      fixedImages[currentImageIndex - 1]
    }')`;
  }
}

function selectImage(imageIndex) {
  currentImageIndex = imageIndex;

  // Update background image using fixed images array
  const imageSection = document.querySelector(".image-section");
  if (fixedImages[imageIndex - 1]) {
    imageSection.style.backgroundImage = `url('${
      fixedImages[imageIndex - 1]
    }')`;
  }

  // Update active thumbnail
  document.querySelectorAll(".image-thumb").forEach((thumb) => {
    thumb.classList.remove("active");
  });
  document
    .querySelector(`[data-image="${imageIndex}"]`)
    .classList.add("active");
}

function showFinishStep() {
  currentStep = "finish";

  document.getElementById("finish-step").classList.add("active");
  document.getElementById("size-step").classList.remove("active");

  document.getElementById("finish-content").style.display = "block";
  document.getElementById("size-content").style.display = "none";

  document.getElementById("action-button").textContent = "Choose Your Size";
}

function showSizeStep() {
  currentStep = "size";

  document.getElementById("finish-step").classList.remove("active");
  document.getElementById("size-step").classList.add("active");

  document.getElementById("finish-content").style.display = "none";
  document.getElementById("size-content").style.display = "block";

  document.getElementById("action-button").textContent = "Add to Cart";
}

function toggleSizeOptions() {
  const checkbox = document.getElementById("know-size");
  const sizeOptions = document.getElementById("size-options");

  if (checkbox.checked) {
    sizeOptions.style.display = "grid";
  } else {
    sizeOptions.style.display = "none";
    selectedSize = null;
    sessionStorage.removeItem("selectedSize");
    updateSizeSelection();
  }
}

function handleAction() {
  if (currentStep === "finish") {
    showSizeStep();
  } else if (currentStep === "size") {
    addToCart();
  }
}

function addToCart() {
  if (!selectedSize) {
    alert("Please select a size before adding to cart.");
    return;
  }

  // Get current cart count from localStorage
  let cartCount = parseInt(localStorage.getItem("cartCount") || "0");
  cartCount += 1;
  localStorage.setItem("cartCount", cartCount.toString());

  // Save current selection to localStorage for cart
  const cartItem = {
    color: selectedColor,
    size: selectedSize,
    price: selectedPrice,
    timestamp: Date.now(),
  };

  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  cartItems.push(cartItem);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  updateCartDisplay();

  // Show confirmation (you can customize this)
  alert("Added to cart!");
}

function updateCartDisplay() {
  const cartCount = parseInt(localStorage.getItem("cartCount") || "0");
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = cartCount;
}

function openCart() {
  // Implement cart opening logic
  console.log("Opening cart...");
}
