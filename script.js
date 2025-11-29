// script.js
// Contém: toggle do carrinho, fechamento, atualização mínima do contador,
// e o efeito de fumaça (movi do inline para cá).

document.addEventListener('DOMContentLoaded', () => {
  const cartToggle = document.getElementById('cart-toggle'); // botão ícone
  const cartPanel = document.getElementById('cart');        // painel aside
  const closeCartBtn = document.getElementById('close-cart');
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-button');

  // Estado simples do carrinho (vazio por enquanto)
  let cart = [];

  function updateCartUI() {
    // atualiza contador
    const totalQty = cart.reduce((s, it) => s + it.qty, 0);
    cartCount.textContent = totalQty;

    // limpa e preenche itens (ainda vazio por padrão)
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
      cartTotalEl.textContent = '0.00';
      return;
    }

    cart.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.img || 'placeholder.png'}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">R$ ${Number(item.price).toFixed(2)} x ${item.qty}</div>
        </div>
        <div class="cart-item-actions">
          <button class="qty-decrease" data-index="${idx}">-</button>
          <button class="qty-increase" data-index="${idx}">+</button>
          <button class="remove-item" data-index="${idx}">🗑️</button>
        </div>
      `;
      cartItemsContainer.appendChild(el);
    });

    const total = cart.reduce((s, it) => s + (it.price * it.qty), 0);
    cartTotalEl.textContent = total.toFixed(2).replace('.', ',');
  }

  // abrir / fechar
  function openCart() {
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
  }

  // toggle pelo ícone
  if (cartToggle) {
    cartToggle.addEventListener('click', () => {
      if (cartPanel.classList.contains('open')) closeCart();
      else openCart();
    });
  }

  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

  // placeholder: delegação de ações dentro do painel (se houver itens)
  cartItemsContainer && cartItemsContainer.addEventListener('click', (e) => {
    const idx = e.target.dataset.index;
    if (e.target.classList.contains('qty-increase')) {
      cart[idx].qty++;
      updateCartUI();
    } else if (e.target.classList.contains('qty-decrease')) {
      if (cart[idx].qty > 1) cart[idx].qty--;
      else cart.splice(idx, 1);
      updateCartUI();
    } else if (e.target.classList.contains('remove-item')) {
      cart.splice(idx, 1);
      updateCartUI();
    }
  });

  // finalizar compra (exemplo: abrir WhatsApp com resumo; ajuste número)
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
      }
      const lines = cart.map(i => `${i.qty}x ${i.name} - R$ ${Number(i.price*i.qty).toFixed(2)}`);
      const total = cart.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2);
      const message = encodeURIComponent(`Olá, quero fazer um pedido:\n${lines.join('\n')}\nTotal: R$ ${total}`);
      // Substitua pelo seu número (ex: 5511999999999)
      window.open(`https://wa.me/5591999999999?text=${message}`, '_blank');
    });
  }

  // Efeito da fumaça: movido do script inline para cá
  document.querySelectorAll('.card').forEach(card => {
    const smoke = card.querySelector('.smoke');

    const triggerSmoke = () => {
      card.classList.remove('smoking');
      void card.offsetWidth; // reinicia a animação
      card.classList.add('smoking');

      if (smoke) {
        smoke.addEventListener('animationend', () => {
          card.classList.remove('smoking');
        }, { once: true });
      } else {
        setTimeout(() => card.classList.remove('smoking'), 1500);
      }
    };

    card.addEventListener('click', triggerSmoke);
    card.addEventListener('touchstart', triggerSmoke);
  });

  // inicializa UI (contador zerado)
  updateCartUI();
});