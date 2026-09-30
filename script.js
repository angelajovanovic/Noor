function getCart() {
  try {
    return JSON.parse(localStorage.getItem('noorCart')) || [];
  } catch {
    return [];
  }
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
  alert('Proizvod je dodat u korpu.');
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

  container.innerHTML = cart.map((item, index) => {
    const price = Number.parseInt(String(item.price).replace(/\D/g, ''), 10) || 0;
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
  }).join('');

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

