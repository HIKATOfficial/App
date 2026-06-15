/* =====================================
   HI • KAT COMMON.JS
   ===================================== */

(function () {
  "use strict";

  /* =========================
     DEVICE ID
     ========================= */

  function generateDeviceId() {
    let deviceId = localStorage.getItem(
      CONFIG.STORAGE_KEYS.DEVICE_ID
    );

    if (!deviceId) {
      deviceId =
        "DEV-" +
        Date.now() +
        "-" +
        Math.random().toString(36).substring(2, 10);

      localStorage.setItem(
        CONFIG.STORAGE_KEYS.DEVICE_ID,
        deviceId
      );
    }

    return deviceId;
  }

  generateDeviceId();

  /* =========================
     TOAST MESSAGE
     ========================= */

  window.showToast = function (
    message = "",
    duration = 2500
  ) {
    let toast = document.querySelector(".toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  };

  /* =========================
     LOADER
     ========================= */

  window.showLoader = function () {
    let loader = document.getElementById(
      "globalLoader"
    );

    if (!loader) {
      loader = document.createElement("div");

      loader.id = "globalLoader";

      loader.innerHTML = `
        <div style="
          position:fixed;
          inset:0;
          background:rgba(255,255,255,.8);
          z-index:99999;
          display:flex;
          align-items:center;
          justify-content:center;
          backdrop-filter:blur(2px);
        ">
          <div style="
            width:50px;
            height:50px;
            border:4px solid #eee;
            border-top:4px solid #5B1A9C;
            border-radius:50%;
            animation:hikatSpin 1s linear infinite;
          "></div>
        </div>
      `;

      document.body.appendChild(loader);

      const style =
        document.createElement("style");

      style.innerHTML = `
        @keyframes hikatSpin{
          from{transform:rotate(0deg);}
          to{transform:rotate(360deg);}
        }
      `;

      document.head.appendChild(style);
    }

    loader.style.display = "block";
  };

  window.hideLoader = function () {
    const loader =
      document.getElementById("globalLoader");

    if (loader) {
      loader.style.display = "none";
    }
  };

  /* =========================
     USER STORAGE
     ========================= */

  window.saveUser = function (user) {
    localStorage.setItem(
      CONFIG.STORAGE_KEYS.USER_ID,
      user.id || ""
    );

    localStorage.setItem(
      CONFIG.STORAGE_KEYS.USER_NAME,
      user.name || ""
    );

    localStorage.setItem(
      CONFIG.STORAGE_KEYS.USER_PHONE,
      user.phone || ""
    );
  };

  window.getUser = function () {
    return {
      id:
        localStorage.getItem(
          CONFIG.STORAGE_KEYS.USER_ID
        ) || "",

      name:
        localStorage.getItem(
          CONFIG.STORAGE_KEYS.USER_NAME
        ) || "",

      phone:
        localStorage.getItem(
          CONFIG.STORAGE_KEYS.USER_PHONE
        ) || ""
    };
  };

  window.isLoggedIn = function () {
    const phone =
      localStorage.getItem(
        CONFIG.STORAGE_KEYS.USER_PHONE
      );

    return !!phone;
  };

  window.clearUser = function () {
    localStorage.removeItem(
      CONFIG.STORAGE_KEYS.USER_ID
    );

    localStorage.removeItem(
      CONFIG.STORAGE_KEYS.USER_NAME
    );

    localStorage.removeItem(
      CONFIG.STORAGE_KEYS.USER_PHONE
    );
  };

  /* =========================
     AUTO LOGIN CHECK
     ========================= */

  window.checkLogin = function () {
    if (
      location.pathname.includes(
        "index.html"
      )
    ) {
      if (isLoggedIn()) {
        location.href =
          CONFIG.HOME_PAGE;
      }
    }
  };

  /* =========================
     LOGOUT
     ========================= */

  window.logout = function () {
    clearUser();

    showToast(
      CONFIG.MESSAGES.LOGOUT_SUCCESS
    );

    setTimeout(() => {
      location.href =
        CONFIG.LOGIN_PAGE;
    }, 600);
  };

  /* =========================
     NAVIGATION
     ========================= */

  window.goHome = function () {
    location.href =
      CONFIG.HOME_PAGE;
  };

  window.goProducts = function () {
    location.href =
      CONFIG.PRODUCTS_PAGE;
  };

  window.goCart = function () {
    location.href =
      CONFIG.CART_PAGE;
  };

  window.goOrders = function () {
    location.href =
      CONFIG.ORDERS_PAGE;
  };

  window.goProfile = function () {
    location.href =
      CONFIG.PROFILE_PAGE;
  };

  /* =========================
     VALIDATION
     ========================= */

  window.validatePhone =
    function (phone) {
      return /^[6-9]\d{9}$/.test(
        phone
      );
    };

  window.validateName =
    function (name) {
      return (
        name &&
        name.trim().length >= 2
      );
    };

  /* =========================
     FORMATTERS
     ========================= */

  window.formatPrice =
    function (amount) {
      return (
        "₹" +
        Number(amount || 0)
          .toLocaleString("en-IN")
      );
    };

  window.formatDate =
    function (date) {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN"
      );
    };

  /* =========================
     PAGE TITLE
     ========================= */

  window.setPageTitle =
    function (title) {
      document.title =
        title +
        " | " +
        CONFIG.APP_NAME;
    };

  /* =========================
     HEADER USER NAME
     ========================= */

  window.getUserName =
    function () {
      return (
        localStorage.getItem(
          CONFIG.STORAGE_KEYS.USER_NAME
        ) || "Guest"
      );
    };

  /* =========================
     CART COUNT
     ========================= */

  window.setCartCount =
    function (count) {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.CART_COUNT,
        count
      );
    };

  window.getCartCount =
    function () {
      return Number(
        localStorage.getItem(
          CONFIG.STORAGE_KEYS.CART_COUNT
        ) || 0
      );
    };

  /* =========================
     COPY TEXT
     ========================= */

  window.copyText =
    async function (text) {
      try {
        await navigator.clipboard.writeText(
          text
        );

        showToast(
          "Copied Successfully"
        );
      } catch (e) {
        console.error(e);
      }
    };

  /* =========================
     READY
     ========================= */

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      checkLogin();
    }
  );
})();
