/********************************************
 * STORAGE — робота з localStorage
 ********************************************/
const Storage = {
  // Завантажуємо кошик з localStorage
  loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  },

  // Зберігаємо кошик
  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  // Завантажуємо користувача
  loadUser() {
    return JSON.parse(localStorage.getItem("user")) || null;
  },

  // Зберігаємо користувача
  saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};


/********************************************
 * ГЛОБАЛЬНИЙ СТАН
 ********************************************/
let cart = Storage.loadCart();

// Тимчасові книги (backend замінить)
const books = [
  { id: 1, title: "The Silent Detective", author: "J. Black", price: 19.99, stock: 5, genre: "detective", description: "A mysterious detective story." },
  { id: 2, title: "Classic Tales", author: "A. Writer", price: 14.5, stock: 0, genre: "classic", description: "A collection of timeless classics." },
  { id: 3, title: "Fantasy World", author: "L. Dreamer", price: 22.0, stock: 3, genre: "fantasy", description: "A journey through magical lands." },
  { id: 4, title: "Future Science", author: "K. Nova", price: 18.75, stock: 7, genre: "sci-fi", description: "Exploring the science of tomorrow." }
];

let user = Storage.loadUser() || {
  name: "John Doe",
  phone: "+1 555 123 456",
  email: "john@example.com",
  address: "123 Maple Street, Toronto"
};

let orders = [
  { id: 101, date: "2026-04-10", total: 39.98, status: "Paid" },
  { id: 102, date: "2026-04-12", total: 19.99, status: "Shipped" }
];


/********************************************
 * UTILS — допоміжні функції
 ********************************************/
const Utils = {
  go(url) {
    window.location.href = url;
  },

  qs(sel) {
    return document.querySelector(sel);
  },

  qsa(sel) {
    return document.querySelectorAll(sel);
  }
};


/********************************************
 * UI — інтерфейс (іконка кошика, toast, навігація)
 ********************************************/
const UI = {
  // Оновлюємо цифру в кошику
  updateCartIcon() {
    const el = Utils.qs(".basket-count");
    if (el) el.textContent = cart.reduce((s, i) => s + i.qty, 0);
  },

  // Показуємо toast-повідомлення
  showToast(message) {
    const toast = Utils.qs("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  },

  // Глобальна навігація
  setupGlobalNav() {
    Utils.qs(".logo")?.addEventListener("click", () => Utils.go("./index.html"));
    Utils.qs("#basketBtn")?.addEventListener("click", () => Utils.go("./cart.html"));
    Utils.qs("#loginBtn")?.addEventListener("click", () => Utils.go("./auth.html"));
  }
};


/********************************************
 * CATALOG — головна сторінка з книгами
 ********************************************/
const Catalog = {
  render(filter = "all", search = "", options = {}) {
    const grid = Utils.qs("#booksGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const term = search.toLowerCase();

    // Фільтрація
    const filtered = books.filter(b =>
      (filter === "all" || b.genre === filter) &&
      (b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term))
    );

    // Якщо нічого не знайдено — переходимо на сторінку помилки
    if (filtered.length === 0) {
      if (!options.noRedirect) Utils.go("./search-error.html");
      return;
    }

    // Рендеримо книги
    filtered.forEach(book => {
      const card = document.createElement("article");
      card.className = "book-card";

      card.innerHTML = `
        <div class="book-cover"></div>
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
        <div class="book-price">$${book.price.toFixed(2)}</div>
        <div class="book-stock">${book.stock > 0 ? "In stock" : "Out of stock"}</div>
        <div class="book-actions">
          <button class="btn ghost" data-id="${book.id}" data-role="details">Details</button>
          <button class="btn primary" data-id="${book.id}" data-role="add" ${book.stock === 0 ? "disabled" : ""}>Add to Cart</button>
        </div>
      `;

      grid.appendChild(card);
    });
  },

  init() {
    if (!location.pathname.includes("index.html")) return;

    let genre = "all";
    let search = "";

    const genreSelect = Utils.qs("#genreFilter");
    const searchInput = Utils.qs("#searchInput");
    const grid = Utils.qs("#booksGrid");

    Catalog.render();

    // Зміна жанру
    genreSelect?.addEventListener("change", e => {
      genre = e.target.value;
      Catalog.render(genre, search);
    });

    // Живий пошук без редіректу
    searchInput?.addEventListener("input", e => {
      search = e.target.value;
      Catalog.render(genre, search, { noRedirect: true });
    });

    // Enter → пошук з редіректом
    searchInput?.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        search = e.target.value;
        Catalog.render(genre, search);
      }
    });

    // Обробка кнопок
    grid?.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const role = e.target.dataset.role;

      if (role === "add") Cart.add(id);
      if (role === "details") Utils.go(`./book.html?id=${id}`);
    });
  }
};


/********************************************
 * BOOK PAGE — сторінка книги
 ********************************************/
const BookPage = {
  init() {
    if (!location.pathname.includes("book.html")) return;

    const params = new URLSearchParams(location.search);
    const id = Number(params.get("id"));
    const book = books.find(b => b.id === id);
    if (!book) return;

    Utils.qs("#bookTitle").textContent = book.title;
    Utils.qs("#bookAuthor").textContent = book.author;
    Utils.qs("#bookDescription").textContent = book.description;
    Utils.qs("#bookPrice").textContent = `$${book.price.toFixed(2)}`;
    Utils.qs("#bookStock").textContent = book.stock > 0 ? `${book.stock} available` : "Out of stock";

    const addBtn = Utils.qs("#addToCartBtn");
    if (book.stock === 0) addBtn.disabled = true;

    addBtn.addEventListener("click", () => Cart.add(book.id));
  }
};


/********************************************
 * CART — логіка кошика
 ********************************************/
const Cart = {
  add(id) {
    const book = books.find(b => b.id === id);
    if (!book || book.stock === 0) return;

    const item = cart.find(i => i.id === id);

    // Не дозволяємо перевищувати stock
    if (item) {
      if (item.qty < book.stock) {
        item.qty++;
        UI.showToast("Book added to cart");
      } else {
        UI.showToast("No more stock available");
      }
    } else {
      cart.push({ id, qty: 1 });
      UI.showToast("Book added to cart");
    }

    Storage.saveCart(cart);
    UI.updateCartIcon();
  },

  render() {
    if (!location.pathname.includes("cart.html")) return;

    const container = Utils.qs("#cartList");
    if (!container) return;

    if (cart.length === 0) {
      Utils.go("./empty-cart.html");
      return;
    }

    container.innerHTML = "";

    cart.forEach(item => {
      const book = books.find(b => b.id === item.id);

      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-title">${book.title}</span>
          <span class="cart-item-author">${book.author}</span>
        </div>

        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${book.id}" data-action="minus">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-id="${book.id}" data-action="plus">+</button>
          <button class="remove-btn" data-id="${book.id}" data-action="remove">Remove</button>
        </div>
      `;

      container.appendChild(row);
    });

    Cart.updateSummary();
  },

  updateSummary() {
    const qty = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => {
      const book = books.find(b => b.id === i.id);
      return s + book.price * i.qty;
    }, 0);

    Utils.qs("#summaryQty").textContent = qty;
    Utils.qs("#summaryTotal").textContent = `$${total.toFixed(2)}`;
  },

  events() {
    if (!location.pathname.includes("cart.html")) return;

    Utils.qs("#cartList").addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      const action = e.target.dataset.action;
      if (!id || !action) return;

      const item = cart.find(i => i.id === id);
      const book = books.find(b => b.id === id);

      if (action === "plus" && item.qty < book.stock) item.qty++;
      if (action === "minus") item.qty = Math.max(1, item.qty - 1);
      if (action === "remove") cart = cart.filter(i => i.id !== id);

      Storage.saveCart(cart);
      UI.updateCartIcon();
      Cart.render();
    });

    Utils.qs("#checkoutBtn")?.addEventListener("click", () => Utils.go("./payment.html"));
  }
};


/********************************************
 * AUTH — логін/реєстрація
 ********************************************/
const Auth = {
  init() {
    if (!location.pathname.includes("auth.html")) return;

    Utils.qs("#showPassLogin")?.addEventListener("change", e => {
      Utils.qs("#loginPassword").type = e.target.checked ? "text" : "password";
    });

    Utils.qs("#loginSubmit")?.addEventListener("click", () => {
      const email = Utils.qs("#loginEmail").value;
      const pass = Utils.qs("#loginPassword").value;

      if (!email || !pass) {
        alert("Заповніть всі поля");
        return;
      }

      alert("Вхід виконано (фейк)");
      Utils.go("./profile.html");
    });

    Utils.qs("#registerSubmit")?.addEventListener("click", () => {
      const name = Utils.qs("#regName").value;
      const email = Utils.qs("#regEmail").value;
      const pass = Utils.qs("#regPassword").value;
      const pass2 = Utils.qs("#regPassword2").value;

      if (!name || !email || !pass || !pass2) {
        alert("Заповніть всі поля");
        return;
      }

      if (pass !== pass2) {
        alert("Паролі не співпадають");
        return;
      }

      alert("Акаунт створено (фейк)");
      Utils.go("./profile.html");
    });
  }
};


/********************************************
 * PROFILE — профіль користувача
 ********************************************/
const Profile = {
  init() {
    if (!location.pathname.includes("profile.html")) return;

    Utils.qs("#profName").value = user.name;
    Utils.qs("#profPhone").value = user.phone;
    Utils.qs("#profEmail").value = user.email;
    Utils.qs("#profAddress").value = user.address;

    Utils.qs("#saveProfileBtn").addEventListener("click", () => {
      user.name = Utils.qs("#profName").value;
      user.phone = Utils.qs("#profPhone").value;
      user.email = Utils.qs("#profEmail").value;
      user.address = Utils.qs("#profAddress").value;

      Storage.saveUser(user);
      alert("Збережено");
    });

    const list = Utils.qs("#ordersList");

    if (orders.length === 0) {
      list.innerHTML = `<p>У вас немає замовлень.</p>`;
    } else {
      list.innerHTML = "";
      orders.forEach(o => {
        const item = document.createElement("div");
        item.className = "order-item";

        item.innerHTML = `
          <h3>Order #${o.id}</h3>
          <p>Date: ${o.date}</p>
          <p>Total: $${o.total.toFixed(2)}</p>
          <p>Status: ${o.status}</p>
        `;

        list.appendChild(item);
      });
    }

    Utils.qsa(".profile-menu li").forEach(li => {
      li.addEventListener("click", () => {
        Utils.qsa(".profile-menu li").forEach(x => x.classList.remove("active"));
        li.classList.add("active");

        const section = li.dataset.section;

        Utils.qsa(".profile-section").forEach(sec => sec.classList.remove("active"));
        Utils.qs(`#section-${section}`).classList.add("active");
      });
    });
  }
};


/********************************************
 * PAYMENT — оплата
 ********************************************/
const Payment = {
  init() {
    if (!location.pathname.includes("payment.html")) return;

    const cardForm = Utils.qs("#cardForm");

    Utils.qsa("input[name='payMethod']").forEach(radio => {
      radio.addEventListener("change", () => {
        cardForm.style.display = radio.value === "card" ? "block" : "none";
      });
    });

    Utils.qs("#completeOrderBtn").addEventListener("click", () => {
      const method = Utils.qs("input[name='payMethod']:checked").value;

      if (method === "card") {
        const num = Utils.qs("#cardNumber").value.trim();
        const exp = Utils.qs("#cardExpiry").value.trim();
        const cvv = Utils.qs("#cardCVV").value.trim();
        const postal = Utils.qs("#cardPostal").value.trim();

        if (!num || !exp || !cvv || !postal) {
          alert("Заповніть всі поля картки");
          return;
        }

        const success = Math.random() > 0.2;

        Utils.go(success ? "./order-success.html" : "./payment-error.html");
      } else {
        Utils.go("./order-success.html");
      }
    });
  }
};


/********************************************
 * ERRORS — empty cart, search error, payment error
 ********************************************/
const Errors = {
  recommendations() {
    const container = Utils.qs("#recommendGrid");
    if (!container) return;

    container.innerHTML = "";

    books.slice(0, 4).forEach(book => {
      const card = document.createElement("article");
      card.className = "book-card";

      card.innerHTML = `
        <div class="book-cover"></div>
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
        <div class="book-price">$${book.price.toFixed(2)}</div>
        <div class="book-actions">
          <button class="btn ghost" data-id="${book.id}" data-role="details">Details</button>
        </div>
      `;

      container.appendChild(card);
    });

    container.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      if (id) Utils.go(`./book.html?id=${id}`);
    });
  },

  init() {
    if (location.pathname.includes("empty-cart")) {
      Errors.recommendations();
      Utils.qs("#backToCatalogBtn")?.addEventListener("click", () => Utils.go("./index.html"));
    }

    if (location.pathname.includes("search-error")) {
      Errors.recommendations();
      Utils.qs("#backToCatalogBtn")?.addEventListener("click", () => Utils.go("./index.html"));
    }

    if (location.pathname.includes("payment-error")) {
      Utils.qs("#retryPaymentBtn")?.addEventListener("click", () => Utils.go("./payment.html"));
      Utils.qs("#backToCartBtn")?.addEventListener("click", () => Utils.go("./cart.html"));
    }

    if (location.pathname.includes("order-success")) {
      cart = [];
      Storage.saveCart(cart);
      UI.updateCartIcon();

      Utils.qs("#viewOrdersBtn")?.addEventListener("click", () => Utils.go("./profile.html"));
      Utils.qs("#backToCatalogBtn")?.addEventListener("click", () => Utils.go("./index.html"));
    }
  }
};


/********************************************
 * APP — запуск всіх модулів
 ********************************************/
const App = {
  init() {
    UI.updateCartIcon();
    UI.setupGlobalNav();

    Catalog.init();
    BookPage.init();
    Cart.render();
    Cart.events();
    Auth.init();
    Profile.init();
    Payment.init();
    Errors.init();
  }
};

document.addEventListener("DOMContentLoaded", App.init);
