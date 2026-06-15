/* =====================================
   HI • KAT SUPABASE.JS
   Matches your current Supabase tables
   ===================================== */

/* Supabase REST Setup */
const SUPABASE_URL =
  "https://ijclbrwofsgrdnlyzkro.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_FzFZFR7qCsSv89mxruHFDQ_Gdfs1Yqx";

const SUPABASE_REST =
  SUPABASE_URL + "/rest/v1";

/* =========================
   COMMON SUPABASE REQUEST
   ========================= */

async function supabaseRequest(table, options = {}) {
  const {
    method = "GET",
    body = null,
    query = "",
    prefer = "return=representation"
  } = options;

  const url =
    SUPABASE_REST + "/" + table + query;

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json",
    Prefer: prefer
  };

  const config = {
    method,
    headers
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Supabase Error:", errorText);
    throw new Error(errorText);
  }

  if (response.status === 204) {
    return [];
  }

  return await response.json();
}

/* =========================
   USERS TABLE
   users:
   id, created_at, name, phone, label
   ========================= */

async function findUserByPhone(phone) {
  const result = await supabaseRequest("users", {
    query:
      "?phone=eq." +
      encodeURIComponent(phone) +
      "&select=*"
  });

  return result[0] || null;
}

async function createUser(name, phone) {
  const user = {
    name: name,
    phone: phone,
    label: "New Customer"
  };

  const result = await supabaseRequest("users", {
    method: "POST",
    body: user
  });

  return result[0];
}

async function loginOrCreateUser(name, phone) {
  let user = await findUserByPhone(phone);

  if (!user) {
    user = await createUser(name, phone);
  }

  if (typeof saveUser === "function") {
    saveUser({
      id: user.id,
      name: user.name,
      phone: user.phone
    });
  } else {
    localStorage.setItem("hikat_user_id", user.id || "");
    localStorage.setItem("hikat_user_name", user.name || "");
    localStorage.setItem("hikat_user_phone", user.phone || "");
  }

  return user;
}

/* =========================
   PRODUCTS TABLE
   products:
   id, created_at, product_id, product_name,
   category, price, stock, sizes,
   image1, image2, image3, image4,
   description1, description2, offer, show
   ========================= */

function normalizeProduct(row) {
  return {
    id: row.product_id,
    product_id: row.product_id,
    name: row.product_name,
    product_name: row.product_name,
    category: row.category,
    price: Number(row.price || 0),
    mainPrice: Number(row.price || 0),
    main_price: Number(row.price || 0),
    stock: Number(row.stock || 0),
    sizes: row.sizes
      ? row.sizes.split(",").map(s => s.trim()).filter(Boolean)
      : [],
    images: [
      row.image1,
      row.image2,
      row.image3,
      row.image4
    ].filter(Boolean),
    image: row.image1 || "",
    image1: row.image1 || "",
    image2: row.image2 || "",
    image3: row.image3 || "",
    image4: row.image4 || "",
    description: row.description2 || row.description1 || "",
    description1: row.description1 || "",
    description2: row.description2 || "",
    offerType: row.offer || "",
    offer: row.offer || "",
    show: row.show
  };
}

async function getProducts() {
  const rows = await supabaseRequest("products", {
    query:
      "?select=*&show=eq.true&order=created_at.desc"
  });

  return rows.map(normalizeProduct);
}

async function getNewArrivalProducts(limit = 8) {
  const rows = await supabaseRequest("products", {
    query:
      "?select=*&show=eq.true&order=created_at.desc&limit=" +
      limit
  });

  return rows.map(normalizeProduct);
}

async function getProductById(productId) {
  const result = await supabaseRequest("products", {
    query:
      "?product_id=eq." +
      encodeURIComponent(productId) +
      "&select=*"
  });

  return result[0] ? normalizeProduct(result[0]) : null;
}

async function getProductsByCategory(category) {
  if (!category || category === "All") {
    return await getProducts();
  }

  const rows = await supabaseRequest("products", {
    query:
      "?category=eq." +
      encodeURIComponent(category) +
      "&show=eq.true&select=*&order=created_at.desc"
  });

  return rows.map(normalizeProduct);
}

/* =========================
   PRODUCT VIEWS TABLE
   product_views:
   id, created_at, product_id, product_name,
   category, user_name, user_phone
   ========================= */

async function saveProductView(product) {
  const user =
    typeof getUser === "function"
      ? getUser()
      : {
          name: localStorage.getItem("hikat_user_name") || "",
          phone: localStorage.getItem("hikat_user_phone") || ""
        };

  const viewData = {
    product_id: product.product_id || product.id || "",
    product_name: product.product_name || product.name || "",
    category: product.category || "",
    user_name: user.name || "",
    user_phone: user.phone || ""
  };

  return await supabaseRequest("product_views", {
    method: "POST",
    body: viewData,
    prefer: "return=minimal"
  });
}

/* =========================
   CART ITEMS TABLE
   cart_items:
   id, created_at, user_phone, product_id,
   product_name, price, size, quantity, image
   ========================= */

async function saveCartItem(item) {
  const user =
    typeof getUser === "function"
      ? getUser()
      : {
          phone: localStorage.getItem("hikat_user_phone") || ""
        };

  const cartItem = {
    user_phone: user.phone || "",
    product_id: item.product_id || "",
    product_name: item.product_name || item.name || "",
    price: Number(item.price || 0),
    size: item.size || "",
    quantity: Number(item.quantity || 1),
    image: item.image || item.image1 || ""
  };

  return await supabaseRequest("cart_items", {
    method: "POST",
    body: cartItem
  });
}

async function getUserCart() {
  const user =
    typeof getUser === "function"
      ? getUser()
      : {
          phone: localStorage.getItem("hikat_user_phone") || ""
        };

  return await supabaseRequest("cart_items", {
    query:
      "?user_phone=eq." +
      encodeURIComponent(user.phone || "") +
      "&select=*&order=created_at.desc"
  });
}

async function deleteCartItem(id) {
  return await supabaseRequest("cart_items", {
    method: "DELETE",
    query:
      "?id=eq." +
      encodeURIComponent(id),
    prefer: "return=minimal"
  });
}

/* =========================
   ORDERS TABLE
   orders:
   id, created_at, order_id, user_name, user_phone,
   product_id, product_name, price, quantity, size,
   image, order_status, payment_status, address, pincode
   ========================= */

async function createOrder(orderData) {
  const user =
    typeof getUser === "function"
      ? getUser()
      : {
          name: localStorage.getItem("hikat_user_name") || "",
          phone: localStorage.getItem("hikat_user_phone") || ""
        };

  const orderId =
    orderData.order_id || "HK" + Date.now();

  const items = orderData.items || [];

  const savedOrders = [];

  for (const item of items) {
    const orderRow = {
      order_id: orderId,
      user_name: orderData.user_name || user.name || "",
      user_phone: orderData.user_phone || user.phone || "",
      product_id: item.product_id || "",
      product_name: item.product_name || item.name || "",
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      size: item.size || "",
      image: item.image || "",
      order_status:
        orderData.order_status || "Order Processing",
      payment_status:
        orderData.payment_status || "Pending",
      address:
        typeof orderData.address === "string"
          ? orderData.address
          : JSON.stringify(orderData.address || {}),
      pincode:
        orderData.pincode ||
        (orderData.address && orderData.address.pincode) ||
        ""
    };

    const result = await supabaseRequest("orders", {
      method: "POST",
      body: orderRow
    });

    if (result[0]) {
      savedOrders.push(result[0]);
    }
  }

  return savedOrders;
}

async function getUserOrders() {
  const user =
    typeof getUser === "function"
      ? getUser()
      : {
          phone: localStorage.getItem("hikat_user_phone") || ""
        };

  return await supabaseRequest("orders", {
    query:
      "?user_phone=eq." +
      encodeURIComponent(user.phone || "") +
      "&select=*&order=created_at.desc"
  });
}

async function updateOrderStatus(orderId, status) {
  return await supabaseRequest("orders", {
    method: "PATCH",
    query:
      "?order_id=eq." +
      encodeURIComponent(orderId),
    body: {
      order_status: status
    }
  });
}

/* =========================
   REVIEWS TABLE
   reviews:
   id, created_at, product_id, user_name,
   user_phone, rating, review_text,
   review_type, is_approved
   ========================= */

async function getApprovedReviews(productId) {
  return await supabaseRequest("reviews", {
    query:
      "?product_id=eq." +
      encodeURIComponent(productId) +
      "&is_approved=eq.true&select=*&order=created_at.desc"
  });
}

async function canReviewProduct(productId) {
  const user =
    typeof getUser === "function"
      ? getUser()
      : {
          phone: localStorage.getItem("hikat_user_phone") || ""
        };

  const orders = await supabaseRequest("orders", {
    query:
      "?user_phone=eq." +
      encodeURIComponent(user.phone || "") +
      "&order_status=eq.Delivered&product_id=eq." +
      encodeURIComponent(productId) +
      "&select=*"
  });

  return orders.length > 0;
}

async function submitReview(productId, rating, reviewText) {
  const user =
    typeof getUser === "function"
      ? getUser()
      : {
          name: localStorage.getItem("hikat_user_name") || "",
          phone: localStorage.getItem("hikat_user_phone") || ""
        };

  if (!user.phone) {
    if (typeof showToast === "function") {
      showToast("Please sign in first");
    }
    return null;
  }

  const allowed = await canReviewProduct(productId);

  if (!allowed) {
    if (typeof showToast === "function") {
      showToast("Only delivered order customers can review");
    }
    return null;
  }

  const review = {
    product_id: productId,
    user_name: user.name || "",
    user_phone: user.phone || "",
    rating: Number(rating),
    review_text: reviewText,
    review_type: "customer",
    is_approved: false
  };

  const result = await supabaseRequest("reviews", {
    method: "POST",
    body: review
  });

  if (typeof showToast === "function") {
    showToast("Review submitted for approval");
  }

  return result[0];
}

async function addAdminReview(
  productId,
  customerName,
  rating,
  reviewText
) {
  const review = {
    product_id: productId,
    user_name: customerName,
    user_phone: "",
    rating: Number(rating),
    review_text: reviewText,
    review_type: "admin_added",
    is_approved: true
  };

  const result = await supabaseRequest("reviews", {
    method: "POST",
    body: review
  });

  if (typeof showToast === "function") {
    showToast("Review added");
  }

  return result[0];
}

/* =========================
   STOCK REQUESTS TABLE
   stock_requests:
   id, created_at, product_id, product_name,
   user_name, user_phone
   ========================= */

async function saveStockRequestSupabase(product) {
  const user =
    typeof getUser === "function"
      ? getUser()
      : {
          name: localStorage.getItem("hikat_user_name") || "",
          phone: localStorage.getItem("hikat_user_phone") || ""
        };

  const request = {
    product_id: product.product_id || product.id || "",
    product_name: product.product_name || product.name || "",
    user_name: user.name || "",
    user_phone: user.phone || ""
  };

  return await supabaseRequest("stock_requests", {
    method: "POST",
    body: request
  });
}

/* =========================
   ADMIN ANALYTICS
   ========================= */

async function getTopProductViews(days = 3) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return await supabaseRequest("product_views", {
    query:
      "?created_at=gte." +
      since.toISOString() +
      "&select=*"
  });
}

async function getCartNoOrderUsers() {
  return await supabaseRequest("cart_items", {
    query:
      "?select=*&order=created_at.desc"
  });
}

async function getPendingOrders() {
  return await supabaseRequest("orders", {
    query:
      "?order_status=eq.Order Processing&select=*"
  });
}

/* =========================
   GLOBAL EXPORT
   ========================= */

window.supabaseRequest = supabaseRequest;

window.findUserByPhone = findUserByPhone;
window.createUser = createUser;
window.loginOrCreateUser = loginOrCreateUser;

window.getProducts = getProducts;
window.getNewArrivalProducts = getNewArrivalProducts;
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;

window.saveProductView = saveProductView;

window.saveCartItem = saveCartItem;
window.getUserCart = getUserCart;
window.deleteCartItem = deleteCartItem;

window.createOrder = createOrder;
window.getUserOrders = getUserOrders;
window.updateOrderStatus = updateOrderStatus;

window.getApprovedReviews = getApprovedReviews;
window.canReviewProduct = canReviewProduct;
window.submitReview = submitReview;
window.addAdminReview = addAdminReview;

window.saveStockRequestSupabase = saveStockRequestSupabase;

window.getTopProductViews = getTopProductViews;
window.getCartNoOrderUsers = getCartNoOrderUsers;
window.getPendingOrders = getPendingOrders;

console.log("✅ HI • KAT Supabase REST connected");
