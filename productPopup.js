/* =====================================
   HI • KAT PRODUCT POPUP.JS
   Part 1
   ===================================== */

(function () {
  "use strict";

  let currentProduct = null;
  let selectedSize = "";
  let activeImageIndex = 0;

  /* =========================
     DEFAULT PRODUCT FALLBACK
     ========================= */

  const defaultProduct = {
    id: "DS00001",
    name: "Floral Printed Kurti",
    category: "Kurtis",
    mainPrice: 999,
    price: 699,
    offerType: "Today Offer",
    stock: 12,
    description:
      "Premium quality stylish kurti designed for everyday comfort with elegant ethnic look and soft breathable fabric.",
    shippingText: "Free shipping on prepaid order",
    rating: 4.7,
    reviews: 128,
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    images: [
      "https://images.unsplash.com/photo-1583391733981-8498405f51b7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583391733975-62a7de3c8e09?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=900&q=80"
    ]
  };

  /* =========================
     CREATE POPUP HTML
     ========================= */

  function createPopupHTML() {
    const popup = document.createElement("div");
    popup.id = "productPopup";
    popup.className = "product-popup-overlay";

    popup.innerHTML = `
      <div class="product-popup">

        <button class="popup-close" onclick="closeProductPopup()">
          <i class="ri-close-line"></i>
        </button>

        <div class="popup-gallery">

          <div class="main-popup-image">
            <img id="popupMainImage" src="" alt="Product Image">
          </div>

          <div class="popup-thumbs" id="popupThumbs"></div>

        </div>

        <div class="popup-details">

          <div class="popup-top-row">
            <span class="popup-product-id" id="popupProductId"></span>
            <span class="popup-stock" id="popupStock"></span>
          </div>

          <h2 id="popupProductName"></h2>

          <div class="popup-price-row">
            <span class="popup-price" id="popupPrice"></span>
            <span class="popup-main-price" id="popupMainPrice"></span>
            <span class="popup-discount" id="popupDiscount"></span>
          </div>

          <div class="popup-offer-row">
            <span class="popup-offer-badge" id="popupOfferType"></span>
            <span class="popup-live-view" id="popupLiveView"></span>
          </div>

          <p class="popup-description" id="popupDescription"></p>

          <div class="popup-shipping">
            <i class="ri-truck-line"></i>
            <span id="popupShippingText"></span>
          </div>

          <div class="popup-size-section">
            <div class="popup-section-title">
              Select Size
            </div>
            <div class="popup-size-list" id="popupSizeList"></div>
          </div>

          <div class="popup-review-box">
            <div>
              <strong id="popupRating"></strong>
              <span id="popupReviewCount"></span>
            </div>
            <p>Trusted by happy HI • KAT customers</p>
          </div>

          <div class="popup-actions">
            <button class="more-like-btn" onclick="moreLikeThis()">
              More Like This
            </button>

            <button class="add-cart-btn" id="popupAddCartBtn" onclick="addPopupProductToCart()">
              Add To Cart
            </button>
          </div>

          <button class="buy-now-btn" id="popupBuyNowBtn" onclick="buyNowFromPopup()">
            Buy Now
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(popup);
  }

  /* =========================
     POPUP CSS
     ========================= */

  function injectPopupCSS() {
    const style = document.createElement("style");

    style.innerHTML = `
      .product-popup-overlay{
        position:fixed;
        inset:0;
        background:rgba(17,24,39,.55);
        z-index:99999;
        display:none;
        align-items:center;
        justify-content:center;
        padding:18px;
        backdrop-filter:blur(3px);
      }

      .product-popup-overlay.show{
        display:flex;
      }

      .product-popup{
        width:min(960px,100%);
        max-height:92vh;
        background:#fff;
        border-radius:26px;
        display:grid;
        grid-template-columns:1fr 1fr;
        overflow:hidden;
        position:relative;
        box-shadow:0 30px 70px rgba(0,0,0,.28);
      }

      .popup-close{
        position:absolute;
        top:16px;
        right:16px;
        width:42px;
        height:42px;
        border-radius:50%;
        background:#fff;
        color:#5B1A9C;
        box-shadow:0 6px 18px rgba(0,0,0,.12);
        z-index:5;
        font-size:24px;
      }

      .popup-gallery{
        background:linear-gradient(180deg,#FAF5FF,#fff);
        padding:24px;
      }

      .main-popup-image{
  width:100%;
  height:75vh;
  border-radius:20px;
  overflow:hidden;
  background:#fff;
}

      .main-popup-image img{
  width:100%;
  height:100%;
  object-fit:contain;
}

      .popup-thumbs{
  display:flex;
  gap:10px;
  margin-top:14px;
  overflow-x:auto;
  scrollbar-width:none;
  padding-bottom:4px;
}

      .popup-thumb{
  min-width:82px;
  width:82px;
  height:82px;
  border-radius:12px;
  overflow:hidden;
  border:2px solid transparent;
  cursor:pointer;
  background:#f8f8f8;
  flex-shrink:0;
}

      .popup-thumb.active{
        border-color:#5B1A9C;
      }

      .popup-thumb img{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      .popup-details{
        padding:34px 30px;
        overflow:auto;
      }

      .popup-top-row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:14px;
      }

      .popup-product-id{
        color:#6B7280;
        font-weight:700;
        font-size:14px;
      }

      .popup-stock{
        padding:7px 12px;
        border-radius:999px;
        font-size:13px;
        font-weight:800;
      }

      .popup-stock.in{
        background:#DCFCE7;
        color:#16A34A;
      }

      .popup-stock.out{
        background:#FEE2E2;
        color:#DC2626;
      }

      #popupProductName{
        font-size:28px;
        line-height:1.25;
        color:#111827;
        margin-bottom:14px;
      }

      .popup-price-row{
        display:flex;
        align-items:center;
        gap:12px;
        flex-wrap:wrap;
        margin-bottom:14px;
      }

      .popup-price{
        font-size:32px;
        font-weight:900;
        color:#5B1A9C;
      }

      .popup-main-price{
        color:#777;
        text-decoration:line-through;
        font-size:17px;
      }

      .popup-discount{
        color:#16A34A;
        font-weight:800;
        font-size:15px;
      }

      .popup-offer-row{
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        margin-bottom:18px;
      }

      .popup-offer-badge{
        background:#F4ECFF;
        color:#5B1A9C;
        padding:8px 12px;
        border-radius:999px;
        font-size:13px;
        font-weight:800;
      }

      .popup-live-view{
        background:#FFF7ED;
        color:#EA580C;
        padding:8px 12px;
        border-radius:999px;
        font-size:13px;
        font-weight:800;
      }

      .popup-description{
        color:#4B5563;
        line-height:1.7;
        font-size:15px;
        margin-bottom:16px;
      }

      .popup-shipping{
        display:flex;
        align-items:center;
        gap:10px;
        background:#ECFDF5;
        color:#16A34A;
        padding:13px 14px;
        border-radius:12px;
        font-weight:700;
        margin-bottom:18px;
      }

      .popup-shipping i{
        font-size:22px;
      }

      .popup-section-title{
        font-weight:800;
        font-size:16px;
        margin-bottom:12px;
      }

      .popup-size-list{
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-bottom:18px;
      }

      .popup-size-btn{
        min-width:52px;
        height:42px;
        border-radius:10px;
        background:#fff;
        border:1.5px solid #E5E7EB;
        color:#111827;
        font-weight:800;
        padding:0 14px;
      }

      .popup-size-btn.active{
        background:#5B1A9C;
        color:#fff;
        border-color:#5B1A9C;
      }

      .popup-review-box{
        background:#FAF5FF;
        border-radius:14px;
        padding:16px;
        margin-bottom:18px;
      }

      .popup-review-box strong{
        color:#F59E0B;
        font-size:18px;
      }

      .popup-review-box span{
        color:#6B7280;
        font-size:14px;
        margin-left:8px;
      }

      .popup-review-box p{
        margin-top:6px;
        color:#5B1A9C;
        font-size:14px;
        font-weight:600;
      }

      .popup-actions{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
        margin-bottom:12px;
      }

      .more-like-btn,
      .add-cart-btn,
      .buy-now-btn{
        height:54px;
        border-radius:12px;
        font-size:15px;
        font-weight:900;
      }

      .more-like-btn{
        background:#fff;
        border:1.5px solid #5B1A9C;
        color:#5B1A9C;
      }

      .add-cart-btn{
        background:#5B1A9C;
        color:#fff;
      }

      .buy-now-btn{
        width:100%;
        background:linear-gradient(135deg,#4C0D8F,#7E22CE,#4C0D8F);
        color:#fff;
      }

      .add-cart-btn.disabled,
      .buy-now-btn.disabled{
        background:#D1D5DB;
        color:#6B7280;
        cursor:not-allowed;
      }

      @media(max-width:768px){
        .product-popup{
          grid-template-columns:1fr;
          max-height:94vh;
          overflow:auto;
          border-radius:24px;
        }

        .main-popup-image{
          height:390px;
        }

        .popup-details{
          padding:24px 20px;
        }

        #popupProductName{
          font-size:23px;
        }

        .popup-price{
          font-size:28px;
        }
      }

      @media(max-width:480px){
        .product-popup-overlay{
          align-items:flex-end;
          padding:0;
        }

        .product-popup{
          border-radius:26px 26px 0 0;
          max-height:92vh;
        }

        .main-popup-image{
          height:330px;
        }

        .popup-thumbs{
          grid-template-columns:repeat(4,1fr);
        }

        .popup-thumb{
          height:68px;
        }
      }
    `;

    document.head.appendChild(style);
  }
    /* =========================
     INIT POPUP
     ========================= */

  function initProductPopup() {
    if (!document.getElementById("productPopup")) {
      createPopupHTML();
      injectPopupCSS();
    }
  }

  document.addEventListener("DOMContentLoaded", initProductPopup);

  /* =========================
     OPEN PRODUCT POPUP
     ========================= */

  window.openProductPopup = function (product = {}) {
    initProductPopup();

    currentProduct = {
      ...defaultProduct,
      ...product
    };

    selectedSize = "";
    activeImageIndex = 0;

    const images =
      currentProduct.images && currentProduct.images.length
        ? currentProduct.images.slice(0, 4)
        : defaultProduct.images;

    currentProduct.images = images;

    document.getElementById("popupProductId").innerText =
      currentProduct.id || "DS00001";

    document.getElementById("popupProductName").innerText =
      currentProduct.name || "Product Name";

    document.getElementById("popupPrice").innerText =
      formatPrice(currentProduct.price);

    document.getElementById("popupMainPrice").innerText =
      formatPrice(currentProduct.mainPrice);

    document.getElementById("popupDiscount").innerText =
      getDiscountText(
        currentProduct.mainPrice,
        currentProduct.price
      );

    document.getElementById("popupOfferType").innerText =
      currentProduct.offerType || "Today Offer";

    document.getElementById("popupDescription").innerText =
      currentProduct.description || "";

    document.getElementById("popupShippingText").innerText =
      currentProduct.shippingText ||
      "Free shipping on prepaid order";

    document.getElementById("popupRating").innerText =
      "⭐ " + (currentProduct.rating || "4.7");

    document.getElementById("popupReviewCount").innerText =
      "(" + (currentProduct.reviews || 0) + " reviews)";

    renderPopupImages();
    renderPopupSizes();
    renderStockStatus();
    renderLiveViewers();

    document
      .getElementById("productPopup")
      .classList.add("show");
  };

  /* =========================
     CLOSE POPUP
     ========================= */

  window.closeProductPopup = function () {
    const popup = document.getElementById("productPopup");

    if (popup) {
      popup.classList.remove("show");
    }
  };

  /* =========================
     IMAGE GALLERY
     ========================= */

  function renderPopupImages() {
    const mainImage =
      document.getElementById("popupMainImage");

    const thumbs =
      document.getElementById("popupThumbs");

    mainImage.src =
      currentProduct.images[activeImageIndex];

    thumbs.innerHTML = "";

    currentProduct.images.forEach((img, index) => {
      const btn = document.createElement("button");

      btn.className =
        "popup-thumb" +
        (index === activeImageIndex ? " active" : "");

      btn.innerHTML = `
        <img src="${img}" alt="Product Image">
      `;

      btn.onclick = function () {
        activeImageIndex = index;
        renderPopupImages();
      };

      thumbs.appendChild(btn);
    });
  }

  /* =========================
     SIZE LOGIC
     ========================= */

  function renderPopupSizes() {
    const sizeList =
      document.getElementById("popupSizeList");

    sizeList.innerHTML = "";

    let sizes =
      currentProduct.sizes &&
      currentProduct.sizes.length
        ? currentProduct.sizes
        : CONFIG.SIZES;

    sizes.forEach(size => {
      const btn = document.createElement("button");

      btn.className = "popup-size-btn";
      btn.innerText = size;

      btn.onclick = function () {
        selectedSize = size;

        document
          .querySelectorAll(".popup-size-btn")
          .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
      };

      sizeList.appendChild(btn);
    });

    if (sizes.length === 1 && sizes[0] === "Free Size") {
      selectedSize = "Free Size";
      sizeList.querySelector("button").classList.add("active");
    }
  }

  /* =========================
     STOCK LOGIC
     ========================= */

  function renderStockStatus() {
    const stock =
      Number(currentProduct.stock || 0);

    const stockBox =
      document.getElementById("popupStock");

    const addBtn =
      document.getElementById("popupAddCartBtn");

    const buyBtn =
      document.getElementById("popupBuyNowBtn");

    if (stock > 0) {
      stockBox.innerText = "In Stock";
      stockBox.className = "popup-stock in";

      addBtn.innerText = "Add To Cart";
      addBtn.classList.remove("disabled");

      buyBtn.innerText = "Buy Now";
      buyBtn.classList.remove("disabled");
    } else {
      stockBox.innerText = "Out Of Stock";
      stockBox.className = "popup-stock out";

      addBtn.innerText = "Notify Me";
      addBtn.classList.add("disabled");

      buyBtn.innerText = "Out Of Stock";
      buyBtn.classList.add("disabled");
    }
  }

  /* =========================
     DISCOUNT LOGIC
     ========================= */

  function getDiscountText(mainPrice, price) {
    mainPrice = Number(mainPrice || 0);
    price = Number(price || 0);

    if (!mainPrice || !price || mainPrice <= price) {
      return "";
    }

    const discount =
      Math.round(((mainPrice - price) / mainPrice) * 100);

    return discount + "% OFF";
  }
    /* =========================
     LIVE VIEWER LOGIC
     ========================= */

  function renderLiveViewers() {
    const price = Number(currentProduct.price || 0);
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    let slot = "night";

    if (hour >= 6 && hour < 10) slot = "morning";
    else if (hour >= 10 && hour < 14) slot = "lateMorning";
    else if (hour >= 14 && hour < 18) slot = "afternoon";
    else if (hour >= 18 && hour < 21) slot = "evening";
    else if (hour >= 21 && (hour < 23 || (hour === 23 && minute < 50))) slot = "nightPrime";
    else slot = "lateNight";

    const ranges = {
      morning: [
        [100, 300, 140, 250],
        [301, 499, 30, 120],
        [500, 799, 50, 100],
        [800, 999, 180, 300],
        [1000, 1399, 20, 70],
        [1400, 99999, 10, 40]
      ],
      lateMorning: [
        [100, 300, 240, 350],
        [301, 499, 130, 190],
        [500, 799, 300, 500],
        [800, 999, 400, 650],
        [1000, 1399, 820, 970],
        [1400, 99999, 110, 240]
      ],
      afternoon: [
        [100, 300, 340, 450],
        [301, 499, 230, 390],
        [500, 799, 600, 800],
        [800, 999, 320, 550],
        [1000, 1399, 120, 290],
        [1400, 99999, 50, 100]
      ],
      evening: [
        [100, 300, 540, 650],
        [301, 499, 150, 250],
        [500, 799, 800, 1200],
        [800, 999, 50, 140],
        [1000, 1399, 120, 290],
        [1400, 99999, 10, 100]
      ],
      nightPrime: [
        [100, 300, 250, 450],
        [301, 499, 800, 1250],
        [500, 799, 500, 700],
        [800, 999, 150, 340],
        [1000, 1399, 700, 999],
        [1400, 99999, 340, 500]
      ],
      lateNight: [
        [100, 300, 0, 0],
        [301, 499, 1, 50],
        [500, 799, 30, 90],
        [800, 999, 1, 40],
        [1000, 1399, 60, 110],
        [1400, 99999, 0, 0]
      ]
    };

    const range = ranges[slot].find(r => price >= r[0] && price <= r[1]);
    let viewers = 0;

    if (range) {
      viewers = randomBetween(range[2], range[3]);
    }

    const liveBox = document.getElementById("popupLiveView");

    if (viewers <= 0) {
      liveBox.innerText = "Low live activity";
    } else {
      liveBox.innerText = viewers + " people viewing now";
    }
  }

  function randomBetween(min, max) {
    min = Number(min || 0);
    max = Number(max || 0);

    if (max <= min) return min;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* =========================
     SIZE CHECK
     ========================= */

  function requireSize() {
    const sizes =
      currentProduct.sizes && currentProduct.sizes.length
        ? currentProduct.sizes
        : CONFIG.SIZES;

    if (sizes.length === 1 && sizes[0] === "Free Size") {
      selectedSize = "Free Size";
      return true;
    }

    if (!selectedSize) {
      showToast(CONFIG.MESSAGES.SIZE_REQUIRED || "Please select a size");
      return false;
    }

    return true;
  }

  /* =========================
     ADD TO CART
     ========================= */

  window.addPopupProductToCart = function () {
    if (!currentProduct) return;

    if (Number(currentProduct.stock || 0) <= 0) {
      saveStockRequest();
      showToast("Stock request saved");
      return;
    }

    if (!requireSize()) return;

    const cartItem = {
      product_id: currentProduct.id,
      product_name: currentProduct.name,
      price: currentProduct.price,
      main_price: currentProduct.mainPrice,
      size: selectedSize,
      quantity: 1,
      image: currentProduct.images[0],
      category: currentProduct.category
    };

    let cart = JSON.parse(localStorage.getItem("hikat_cart_items") || "[]");

    const existingIndex = cart.findIndex(
      item =>
        item.product_id === cartItem.product_id &&
        item.size === cartItem.size
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("hikat_cart_items", JSON.stringify(cart));

    setCartCount(cart.length);
    showToast(CONFIG.MESSAGES.CART_ADDED || "Product added to cart");
  };

  /* =========================
     BUY NOW
     ========================= */

  window.buyNowFromPopup = function () {
    if (!currentProduct) return;

    if (Number(currentProduct.stock || 0) <= 0) {
      showToast("Product is out of stock");
      return;
    }

    if (!requireSize()) return;

    addPopupProductToCart();

    setTimeout(() => {
      location.href = CONFIG.CART_PAGE;
    }, 600);
  };

  /* =========================
     STOCK REQUEST
     ========================= */

  function saveStockRequest() {
    const user = getUser ? getUser() : {};

    const request = {
      product_id: currentProduct.id,
      product_name: currentProduct.name,
      user_name: user.name || "",
      user_phone: user.phone || "",
      created_at: new Date().toISOString()
    };

    let requests = JSON.parse(localStorage.getItem("hikat_stock_requests") || "[]");

    requests.push(request);

    localStorage.setItem("hikat_stock_requests", JSON.stringify(requests));
  }

  /* =========================
     MORE LIKE THIS
     ========================= */

  window.moreLikeThis = function () {
    if (!currentProduct) return;

    localStorage.setItem(
      "hikat_filter_category",
      currentProduct.category || "All"
    );

    location.href = CONFIG.PRODUCTS_PAGE;
  };

  /* =========================
     REVIEW SYSTEM
     ========================= */

  function getDemoReviews() {
    return [
      {
        product_id: currentProduct.id,
        user_name: "Ananya Das",
        rating: 5,
        review_text: "Very comfortable fabric and beautiful colour quality.",
        review_type: "admin_added",
        is_approved: true
      },
      {
        product_id: currentProduct.id,
        user_name: "Priya Shaw",
        rating: 4,
        review_text: "Good fitting and nice daily wear style.",
        review_type: "admin_added",
        is_approved: true
      }
    ];
  }

  window.canUserReviewProduct = function (productId) {
    const user = getUser ? getUser() : {};
    const orders = JSON.parse(localStorage.getItem("hikat_orders") || "[]");

    return orders.some(order => {
      const delivered =
        String(order.status || "").toLowerCase() === "delivered";

      const sameUser =
        order.user_phone === user.phone;

      const hasProduct =
        Array.isArray(order.items) &&
        order.items.some(item => item.product_id === productId);

      return delivered && sameUser && hasProduct;
    });
  };

  window.submitProductReview = function (rating, reviewText) {
    if (!currentProduct) return;

    const user = getUser ? getUser() : {};

    if (!user.phone) {
      showToast("Please sign in first");
      return;
    }

    if (!canUserReviewProduct(currentProduct.id)) {
      showToast("Only delivered order customers can review");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      showToast("Please select rating");
      return;
    }

    if (!reviewText || reviewText.trim().length < 5) {
      showToast("Please write a proper review");
      return;
    }

    const review = {
      id: "REV-" + Date.now(),
      product_id: currentProduct.id,
      user_name: user.name,
      user_phone: user.phone,
      rating: Number(rating),
      review_text: reviewText.trim(),
      review_type: "customer",
      is_approved: false,
      created_at: new Date().toISOString()
    };

    let reviews = JSON.parse(localStorage.getItem("hikat_reviews") || "[]");

    const alreadyReviewed = reviews.some(
      r =>
        r.product_id === currentProduct.id &&
        r.user_phone === user.phone
    );

    if (alreadyReviewed) {
      showToast("You already reviewed this product");
      return;
    }

    reviews.push(review);

    localStorage.setItem("hikat_reviews", JSON.stringify(reviews));

    showToast("Review submitted for approval");
  };

  window.addAdminReview = function (productId, name, rating, text) {
    const review = {
      id: "REV-" + Date.now(),
      product_id: productId,
      user_name: name,
      user_phone: "",
      rating: Number(rating),
      review_text: text,
      review_type: "admin_added",
      is_approved: true,
      created_at: new Date().toISOString()
    };

    let reviews = JSON.parse(localStorage.getItem("hikat_reviews") || "[]");
    reviews.push(review);
    localStorage.setItem("hikat_reviews", JSON.stringify(reviews));

    showToast("Admin review added");
  };

  window.getApprovedReviews = function (productId) {
    const savedReviews = JSON.parse(localStorage.getItem("hikat_reviews") || "[]");

    const approved = savedReviews.filter(
      r => r.product_id === productId && r.is_approved === true
    );

    return [...getDemoReviews(), ...approved].slice(0, 5);
  };

  /* =========================
     POPUP CLOSE EVENTS
     ========================= */

  document.addEventListener("click", function (e) {
    const overlay = document.getElementById("productPopup");

    if (!overlay) return;

    if (e.target === overlay) {
      closeProductPopup();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeProductPopup();
    }
  });

})();
