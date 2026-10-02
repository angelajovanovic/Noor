function getCart() {
  try {
    return JSON.parse(localStorage.getItem('noorCart')) || [];
  } catch {
    return [];
  }
}

function announce(message) {
  const liveRegion = document.getElementById('liveRegion');
  if (!liveRegion) return;

  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 50);
}

function addToCart(button) {
  const card = button?.closest('.product-card');

  let title;
  let price;
  let image;
  let size = 'ONE SIZE';
  let quantity = 1;

  if (card) {
    title = card.querySelector('h3')?.textContent.trim();
    price = card.querySelector('p')?.textContent.trim();
    image = card.querySelector('img')?.src || '';
  } else {
    title = document.querySelector('main h1')?.textContent.trim();
    price = document.querySelector('main .h4')?.textContent.trim();
    image = document.getElementById('mainProductImg')?.src || '';

    size =
      document.querySelector('input[name="size"]:checked')
        ?.nextElementSibling?.textContent.trim() || 'ONE SIZE';

    quantity =
      Number.parseInt(document.getElementById('quantityInput')?.value, 10) || 1;
  }

  const product = {
    title: title || 'Proizvod',
    price: price || '0 RSD',
    size,
    quantity,
    image
  };

  const cart = getCart();
  const existingItem = cart.find(
    item =>
      item.title === product.title &&
      item.size === product.size &&
      item.image === product.image
  );

  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  localStorage.setItem('noorCart', JSON.stringify(cart));

  if (typeof renderCart === 'function') {
    renderCart();
  }

  announce('Proizvod je dodat u korpu.');
}

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<p>Vaša korpa je prazna.</p>';
    updateCartTotals(0);
    return;
  }

  let total = 0;

  container.innerHTML = cart
    .map((item, index) => {
      const price =
        Number.parseInt(String(item.price).replace(/\D/g, ''), 10) || 0;
      const quantity = Number.parseInt(item.quantity, 10) || 1;
      const itemTotal = price * quantity;
      total += itemTotal;

      return `
        <div class="card border-0 shadow-sm p-3 rounded-4 mb-3">
          <div class="row align-items-center g-3">
            <div class="col-3 col-sm-2">
              <img src="${item.image}" alt="${item.title}" class="img-fluid rounded-3"
                   style="height: 80px; width: 100%; object-fit: cover;">
            </div>
            <div class="col-9 col-sm-4">
              <h5>${item.title}</h5>
              <p>Veličina: ${item.size}</p>
            </div>
            <div class="col-6 col-sm-3">Količina: ${quantity}</div>
            <div class="col-4 col-sm-2 text-end">${itemTotal.toLocaleString()} RSD</div>
            <div class="col-2 col-sm-1 text-end">
              <button type="button" class="btn btn-link text-danger"
                      onclick="removeItem(${index})" aria-label="Ukloni ${item.title} iz korpe">
                <i class="bi bi-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>`;
    })
    .join('');

  updateCartTotals(total);
}

function updateCartTotals(total) {
  const subtotal = document.getElementById('subtotalPrice');
  const totalElement = document.getElementById('totalPrice');

  if (subtotal) subtotal.textContent = `${total.toLocaleString()} RSD`;
  if (totalElement) totalElement.textContent = `${total.toLocaleString()} RSD`;
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  localStorage.setItem('noorCart', JSON.stringify(cart));
  renderCart();
}

document.addEventListener('DOMContentLoaded', renderCart);

document.addEventListener('DOMContentLoaded', function () {
  const categoryLinks = document.querySelectorAll('.category-link');
  const sizeBtns = document.querySelectorAll('.size-btn');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const productItems = document.querySelectorAll('.product-item');

  const countShown = document.getElementById('count-shown');
  const countTotal = document.getElementById('count-total');

  let activeCategory = 'all';
  let activeSize = 'all';
  let maxPrice = priceRange ? Number.parseFloat(priceRange.value) || Infinity : Infinity;

  function updateCategoryCounts() {
    const counts = { all: productItems.length };

    productItems.forEach(item => {
      const cat = item.getAttribute('data-category');
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });

    categoryLinks.forEach(link => {
      const filter = link.getAttribute('data-filter');
      const countSpan = link.querySelector('.cat-count');

      if (countSpan) {
        countSpan.textContent = `(${counts[filter] || 0})`;
      }
    });

    if (countTotal) {
      countTotal.textContent = String(productItems.length);
    }
  }

  function applyFilters() {
    let visible = 0;

    productItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const sizeRaw = item.getAttribute('data-size') || 'all';
      const sizes = sizeRaw.split(',').map(value => value.trim());
      const price = Number.parseFloat(item.getAttribute('data-price')) || 0;

      const matchesCategory =
        activeCategory === 'all' || category === activeCategory;

      const matchesSize =
        activeSize === 'all' || sizes.includes(activeSize);

      const matchesPrice = price <= maxPrice;

      const show = matchesCategory && matchesSize && matchesPrice;
      item.style.display = show ? '' : 'none';

      if (show) visible++;
    });

    if (countShown) {
      countShown.textContent = String(visible);
    }

    if (priceValue) {
      priceValue.textContent = `${Math.round(maxPrice).toLocaleString()} RSD`;
    }
  }

  categoryLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();

      activeCategory = link.getAttribute('data-filter') || 'all';

      categoryLinks.forEach(item => {
        const isActive = item === link;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-current', isActive ? 'page' : 'false');
        item.classList.toggle('text-dark', isActive);
        item.classList.toggle('text-muted', !isActive);
      });

      applyFilters();
    });
  });

  sizeBtns.forEach(button => {
    button.addEventListener('click', () => {
      activeSize = button.getAttribute('data-size') || 'all';

      sizeBtns.forEach(item => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      applyFilters();
    });
  });

  if (priceRange) {
    priceRange.addEventListener('input', event => {
      maxPrice = Number.parseFloat(event.target.value) || Infinity;
      applyFilters();
    });
  }

  updateCategoryCounts();
  applyFilters();
});
