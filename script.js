function addToCart(){
  const titleElement = document.querySelector('h1');
  const priceElement = document.querySelector('.h4') || document.querySelector('.price');
  const imgElement = document.getElementById('mainProductImg') || document.querySelector('.main-img-box img');
  const quantityInput = document.getElementById('quantityInput') || document.querySelector('input[type="number"]');
  const selectedSize = document.querySelector('input[name="size"]:checked')?.nextElementSibling?.innerText || 'Standard';
}
const product = {
    title: titleElement ? titleElement.innerText.trim() : 'Proizvod',
    price: priceElement ? priceElement.innerText.trim() : '0 RSD',
    size: selectedSize,
    quantity: quantityInput ? parseInt(quantityInput.value) : 1,
    image: imgElement ? imgElement.src : ''
};

let cart = JSON.parse(localStorage.getItem('noorCarT')) || [];

const existingIndex = cart.findIndex(item => item.title === product.title && item.size === product.size);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += product.quantity;
  } else {
    cart.push(product);
  }

  localStorage.setItem('noorCart', JSON.stringify(cart));

  //--Prikaz korpe--//

  function renderCart(){
    const container = document.getElementById('cartItemsContainer');
  if (!container) return; // Ako nismo na cart.html stranici, prekini izvršavanje

  let cart = JSON.parse(localStorage.getItem('noorCart')) || [];

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="card border-0 shadow-sm p-5 text-center rounded-4">
        <i class="bi bi-bag-x fs-1 text-muted mb-3"></i>
        <h4>Vaša korpa je prazna</h4>
        <p class="text-muted small">Istražite našu ponudu i dodajte omiljene komade.</p>
        <div class="mt-3">
          <a href="shop.html" class="btn btn-dark rounded-pill px-4">Idi u shop</a>
        </div>
      </div>`;
    if(document.getElementById('subtotalPrice')) document.getElementById('subtotalPrice').innerText = '0 RSD';
    if(document.getElementById('totalPrice')) document.getElementById('totalPrice').innerText = '0 RSD';
    return;
    }

    let html='';
    let totalSum=0;

    cart.forEach((item, index) => {
    const numericPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    const itemTotal = numericPrice * item.quantity;
    totalSum += itemTotal;

    html += `
      <div class="card border-0 shadow-sm p-3 rounded-4 mb-3">
        <div class="row align-items-center g-3">
          <div class="col-3 col-sm-2">
            <img src="${item.image}" alt="${item.title}" class="img-fluid rounded-3 object-fit-cover" style="height: 80px; width: 100%;">
          </div>
          <div class="col-9 col-sm-4">
            <h5 class="fw-bold fs-6 mb-1">${item.title}</h5>
            <p class="text-muted small mb-0">Veličina: ${item.size}</p>
          </div>
          <div class="col-6 col-sm-3">
            <div class="fw-semibold">Količina: ${item.quantity}</div>
          </div>
          <div class="col-4 col-sm-2 text-end fw-bold">
            ${itemTotal.toLocaleString()} RSD
          </div>
          <div class="col-2 col-sm-1 text-end">
            <button class="btn btn-link text-danger p-0 border-0" onclick="removeItem(${index})" aria-label="Ukloni artikal">
              <i class="bi bi-trash fs-5"></i>
            </button>
          </div>
        </div>
      </div>`;
  });

  container.innerHTML = html;
  if(document.getElementById('subtotalPrice'))document.getElementById('subtotalPrice').innerText=totalSum.toLocaleString()+'RSD';
  if(document.getElementById('totalPrice'))document.getElementById('totalPrice').innerText=totalSum.toLocaleString()+'RSD';
  }

  function removalItem(index){
    let cart = JSON.parse(localStorage.getItem('noorCart')) || [];
    cart.splce(index,1);
    localStorage.setItem('noorCart', JSON.stringify(cart));
    renderCart();
  }
  // Učitaj korpu automatski kada se stranica otvori
document.addEventListener('DOMContentLoaded', renderCart);

