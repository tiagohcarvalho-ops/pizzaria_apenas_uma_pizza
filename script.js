
document.addEventListener('DOMContentLoaded', () => {
  const cartToggle = document.getElementById('cart-toggle'); // botão ícone que abre o carrinho
  const cartPanel = document.getElementById('cart');        // painel do carrinho (aside)
  const closeCartBtn = document.getElementById('close-cart');
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-button');

  let cart = [];

  function updateCartUI() {

    // atualiza contador visual
    const totalQty = cart.reduce((s, it) => s + it.qty, 0);
    if (cartCount) cartCount.textContent = totalQty;

    // limpa container e renderiza
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
      if (cartTotalEl) cartTotalEl.textContent = '0,00';
      return;
    }

    cart.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.img || 'placeholder.png'}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">R$ ${Number(item.price).toFixed(2).replace('.', ',')} x ${item.qty}</div>
        </div>
        <div class="cart-item-actions">
          <button class="qty-decrease" data-index="${idx}">-</button>
          <button class="qty-increase" data-index="${idx}">+</button>
          <button class="remove-item" data-index="${idx}" aria-label="Remover item">🗑️</button>
        </div>
      `;
      cartItemsContainer.appendChild(el);
    });

    const total = cart.reduce((s, it) => s + (it.price * it.qty), 0);
    if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2).replace('.', ',');
  }

  // -------------------------
  // Funções de abrir / fechar painel do carrinho
  // -------------------------
  function openCart() {
    if (!cartPanel) return;
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    if (!cartPanel) return;
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
  }

  // Listener do ícone de toggle do carrinho
  if (cartToggle) {
    cartToggle.addEventListener('click', () => {
      if (!cartPanel) return;
      if (cartPanel.classList.contains('open')) closeCart();
      else openCart();
    });
  }

  // Botão fechar
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const btn = e.target;
      const idx = btn.dataset && btn.dataset.index !== undefined ? Number(btn.dataset.index) : null;
      if (btn.classList.contains('qty-increase') && idx !== null) {
        cart[idx].qty++;
        updateCartUI();
      } else if (btn.classList.contains('qty-decrease') && idx !== null) {
        if (cart[idx].qty > 1) cart[idx].qty--;
        else cart.splice(idx, 1);
        updateCartUI();
      } else if (btn.classList.contains('remove-item') && idx !== null) {
        cart.splice(idx, 1);
        updateCartUI();
      }
    });
  }

  // -------------------------
  // Botão finalizar compra
  // - monta resumo e abre WhatsApp (número de exemplo)
  // -------------------------
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
      }
      const lines = cart.map(i => `${i.qty}x ${i.name} - R$ ${Number(i.price * i.qty).toFixed(2)}`);
      const total = cart.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2);
      const message = encodeURIComponent(`Olá, quero fazer um pedido:\n${lines.join('\n')}\nTotal: R$ ${total}`);

      // TODO: substitua pelo seu número no formato internacional (ex: 55 + DDD + número)
      window.open(`https://wa.me/5591999999999?text=${message}`, '_blank');
    });
  }
  document.querySelectorAll('.card').forEach(card => {
    const smoke = card.querySelector('.smoke');

    const triggerSmoke = () => {

      // reinicia a animação
      card.classList.remove('smoking');
      void card.offsetWidth;
      card.classList.add('smoking');

      if (smoke) {

        // remove a classe quando a animação terminar
        smoke.addEventListener('animationend', () => {
          card.classList.remove('smoking');
        }, { once: true });
      } else {

        // fallback: remove após tempo
        setTimeout(() => card.classList.remove('smoking'), 1500);
      }
    };
    card.addEventListener('click', triggerSmoke);
    card.addEventListener('touchstart', triggerSmoke);
  });
  document.querySelectorAll('.card').forEach(card => {
    const addBtn = card.querySelector('.add-to-cart');
    if (!addBtn) return;
    addBtn.addEventListener('click', () => {
      const id = card.dataset.id || String(Date.now());
      const name = card.dataset.name || card.querySelector('h3')?.textContent?.trim() || 'Produto';
      const price = parseFloat(card.dataset.price || '0') || 0;
      const img = card.dataset.img || card.querySelector('img')?.getAttribute('src') || '';

      // se já existe, incrementa qty; senão, adiciona novo
      const existing = cart.find(i => i.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, price, qty: 1, img });
      }
      updateCartUI();
      
      // opção: abrir o carrinho automaticamente
      openCart();
    });
  });

  // Inicializa UI
  updateCartUI();
});
