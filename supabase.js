/* =====================================
   HI • KAT SUPABASE.JS
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

async function supabaseRequest(
  table,
  options = {}
) {
  const {
    method = "GET",
    body = null,
    query = "",
    prefer = "return=representation"
  } = options;

  const url =
    SUPABASE_REST +
    "/" +
    table +
    query;

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
   USERS
   ========================= */

async function findUserByPhone(phone) {
  const result = await supabaseRequest(
    "users",
    {
      query:
        "?phone=eq." +
        encodeURIComponent(phone) +
        "&select=*"
    }
  );

  return result[0] || null;
}

async function createUser(name, phone) {
  const user = {
    name: name,
    phone: phone,
    label: "New Customer",
    created_at: new Date().toISOString()
  };

  const result = await supabaseRequest(
    "users",
    {
      method: "POST",
      body: user
    }
  );

  return result[0];
}

async function loginOrCreateUser(name, phone) {
  let user = await findUserByPhone(phone);

  if (!user) {
    user = await createUser(name, phone);
  }

  saveUser({
    id: user.id,
    name: user.name,
    phone: user.phone
  });

  return user;
}

/* =========================
   PRODUCTS
   ========================= */

async function getProducts() {
  return await supabaseRequest(
    "products",
    {
      query:
        "?select=*&show=eq.true&order=created_at.desc"
    }
  );
}

async function getNewArrivalProducts(limit = 8) {
  return await supabaseRequest(
    "products",
    {
      query:
        "?select=*&show=eq.true&new_arrival=eq.true&order=created_at.desc&limit=" +
        limit
    }
  );
}

async function getProductById(productId) {
  const result = await supabaseRequest(
    "products",
    {
      query:
        "?product_id=eq." +
        encodeURIComponent(productId) +
        "&select=*"
    }
  );

  return result[0] || null;
}

async function getProductsByCategory(category) {
  return await supabaseRequest(
    "products",
    {
      query:
        "?category=eq." +
        encodeURIComponent(category) +
        "&show=eq.true&select=*"
    }
  );
}

/* =========================
   PRODUCT VIEWS
   ========================= */

async function saveProductView(product) {
  const user = getUser();

  const viewData = {
    product_id: product.product_id || product.id,
    product_name: product.product_name || product.name,
    category: product.category || "",
    user_name: user.name || "",
    user_phone: user.phone || "",
    created_at: new Date().toISOString()
  };

  return await supabaseRequest(
    "product_views",
    {
      method: "POST",
      body: viewData,
      prefer: "return=minimal"
    }
  );
}

/* =========================
   CART
   ========================= */

async function saveCartItem(item) {
  const user = getUser();

  const cartItem = {
    user_name: user.name || "",
    user_phone: user.phone || "",
    product_id: item.product_id,
    product_name: item.product_name,
    price: item.price,
    main_price: item.main_price,
    size: item.size,
    quantity: item.quantity || 1,
    image: item.image || "",
    category: item.category || "",
    ordered: false,
    created_at: new Date().toISOString()
  };

  return await supabaseRequest(
    "cart_items",
    {
      method: "POST",
      body: cartItem
    }
  );
}

async function getUserCart() {
  const user = getUser();

  return await supabaseRequest(
    "cart_items",
    {
      query:
        "?user_phone=eq." +
        encodeURIComponent(user.phone) +
        "&ordered=eq.false&select=*"
    }
  );
}

async function deleteCartItem(id) {
  return await supabaseRequest(
    "cart_items",
    {
      method: "DELETE",
      query:
        "?id=eq." +
        encodeURIComponent(id),
      prefer: "return=minimal"
    }
  );
}

/* =========================
   ORDERS
   ========================= */

async function createOrder(orderData) {
  const user = getUser();

  const order = {
    order_id:
      "HK" + Date.now(),

    user_name:
      orderData.user_name || user.name,

    user_phone:
      orderData.user_phone || user.phone,

    items:
      orderData.items || [],

    total_amount:
      orderData.total_amount || 0,

    payment_status:
      orderData.payment_status || "Pending",

    order_status:
      orderData.order_status || "Order Processing",

    address:
      orderData.address || {},

    coupon_code:
      orderData.coupon_code || "",

    created_at:
      new Date().toISOString()
  };

  const result = await supabaseRequest(
    "orders",
    {
      method: "POST",
      body: order
    }
  );

  return result[0];
}

async function getUserOrders() {
  const user = getUser();

  return await supabaseRequest(
    "orders",
    {
      query:
        "?user_phone=eq." +
        encodeURIComponent(user.phone) +
        "&select=*&order=created_at.desc"
    }
  );
}

async function updateOrderStatus(
  orderId,
  status
) {
  return await supabaseRequest(
    "orders",
    {
      method: "PATCH",
      query:
        "?order_id=eq." +
        encodeURIComponent(orderId),
      body: {
        order_status: status
      }
    }
  );
}

/* =========================
   REVIEWS
   ========================= */

async function getApprovedReviews(productId) {
  return await supabaseRequest(
    "reviews",
    {
      query:
        "?product_id=eq." +
        encodeURIComponent(productId) +
        "&is_approved=eq.true&select=*&order=created_at.desc"
    }
  );
}

async function canReviewProduct(productId) {
  const user = getUser();

  const orders = await supabaseRequest(
    "orders",
    {
      query:
        "?user_phone=eq." +
        encodeURIComponent(user.phone) +
        "&order_status=eq.Delivered&select=*"
    }
  );

  return orders.some(order => {
    const items = order.items || [];

    return items.some(
      item =>
        item.product_id === productId
    );
  });
}

async function submitReview(
  productId,
  rating,
  reviewText
) {
  const user = getUser();

  if (!user.phone) {
    showToast("Please sign in first");
    return;
  }

  const allowed =
    await canReviewProduct(productId);

  if (!allowed) {
    showToast(
      "Only delivered order customers can review"
    );
    return;
  }

  const review = {
    product_id: productId,
    user_name: user.name,
    user_phone: user.phone,
    rating: Number(rating),
    review_text: reviewText,
    review_type: "customer",
    is_approved: false,
    created_at: new Date().toISOString()
  };

  const result = await supabaseRequest(
    "reviews",
    {
      method: "POST",
      body: review
    }
  );

  showToast(
    "Review submitted for approval"
  );

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
    is_approved: true,
    created_at: new Date().toISOString()
  };

  const result = await supabaseRequest(
    "reviews",
    {
      method: "POST",
      body: review
    }
  );

  showToast("Review added");

  return result[0];
}

/* =========================
   STOCK REQUESTS
   ========================= */

async function saveStockRequestSupabase(product) {
  const user = getUser();

  const request = {
    product_id: product.product_id || product.id,
    product_name: product.product_name || product.name,
    user_name: user.name || "",
    user_phone: user.phone || "",
    created_at: new Date().toISOString()
  };

  return await supabaseRequest(
    "stock_requests",
    {
      method: "POST",
      body: request
    }
  );
}

/* =========================
   ADMIN ANALYTICS
   ========================= */

async function getTopProductViews(days = 3) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return await supabaseRequest(
    "product_views",
    {
      query:
        "?created_at=gte." +
        since.toISOString() +
        "&select=*"
    }
  );
}

async function getCartNoOrderUsers() {
  return await supabaseRequest(
    "cart_items",
    {
      query:
        "?ordered=eq.false&select=*"
    }
  );
}

async function getPendingOrders() {
  return await supabaseRequest(
    "orders",
    {
      query:
        "?order_status=eq.Order Processing&select=*"
    }
  );
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
