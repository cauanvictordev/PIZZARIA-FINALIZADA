// ===========================
// Seletores Principais
// ===========================
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const closeModalBtn = document.getElementById("close-modal-btn");
const menu = document.querySelector(".menu");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const checkoutBtn = document.getElementById("checkout-btn");
const customerNameInput = document.getElementById("customer-name");
const paymentInfo = document.getElementById("payment-info");
const pixInfo = document.getElementById("pix-info");
const copyPixBtn = document.getElementById("copy-pix-btn");
const pixKey = document.getElementById("pix-key");

// Array do carrinho unificado
let cart = [];

// ===========================
// Exibição do Modal do Carrinho
// ===========================
cartBtn.addEventListener("click", () => {
  cartModal.classList.add("active");
  cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  cartModal.classList.remove("active");
  cartModal.style.display = "none";
});

// ===========================
// Adicionar Item ao Carrinho (Pizzas)
    // ===========================
menu.addEventListener("click", (event) => {
  const parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    const imageSrc = parentButton.querySelector("img")?.getAttribute("src") || "default-image.png";
    openCustomPopup(name, price, imageSrc);
  }
});

const orderNoteInput = document.getElementById("order-note");

// ===========================
// Função para Adicionar ao Carrinho com Personalização
// ===========================
function addToCart(item) {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(item);
  }

  updateCartModal();
  updateCartCount();
}

// ===========================
// Atualização do Modal do Carrinho
// ===========================
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
      <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <p><strong>${item.name}</strong></p>
        <p><strong>Tamanho:</strong> ${item.size}</p>
        <p><strong>Sabores:</strong> ${item.flavors.join(", ")}</p>
        <p><strong>Massa:</strong> ${item.massa}</p>
        <p><strong>Borda:</strong> ${item.borda}</p>
        <p><strong>Refrigerante:</strong> ${item.refrigerante}</p>
        <p><strong>Observação:</strong> ${item.note || "Sem observação"}</p>
        <p><strong>Preço Unitário:</strong> R$ ${item.price.toFixed(2)}</p>
        <p><strong>Quantidade:</strong> ${item.quantity}</p>
        <p><strong>Subtotal:</strong> R$ ${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-from-cart-btn" data-index="${index}">
          <i class="fas fa-trash-alt"></i> Remover
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemElement);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// ===========================
// Remover Item do Carrinho
// ===========================
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.closest(".remove-from-cart-btn")) {
    const index = parseInt(event.target.closest(".remove-from-cart-btn").getAttribute("data-index"));
    cart.splice(index, 1);
    updateCartModal();
    updateCartCount();
  }
});

// ===========================
// Finalizar Compra
// ===========================
checkoutBtn.addEventListener("click", () => {
  const name = customerNameInput.value.trim();
  const address = addressInput.value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
  const total = cartTotal.textContent;

  if (!name || !address || !paymentMethod) {
    alert("Por favor, preencha todas as informações.");
    return;
  }

  if (cart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const cartItems = cart.map((item) => `
    ${item.name} (${item.size})
    Sabores: ${item.flavors.join(', ')}
    Massa: ${item.massa}
    Borda: ${item.borda}
    Refrigerante: ${item.refrigerante}
    Observação: ${item.note || "Sem observação"}
    Quantidade: ${item.quantity}
    Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}
  `).join("\n\n");

  let message = `Olá, segue o pedido:\n\nNome: ${name}\nEndereço: ${address}\nForma de Pagamento: ${paymentMethod}\nTotal: ${total}\n\nProdutos:\n${cartItems}`;

  if (paymentMethod.toLowerCase() === "pix") {
    alert("Você selecionou PIX como forma de pagamento. Por favor, envie o comprovante manualmente na conversa do WhatsApp após abrir o link.");
    message += "\nPor favor, envie o comprovante de pagamento nesta conversa.";
  }

  window.open(`https://wa.me/67996123728?text=${encodeURIComponent(message)}`, "_blank");
  cart = [];
  addressInput.value = "";
  customerNameInput.value = "";
  updateCartModal();
  updateCartCount();
});

// ===========================
// Atualizar Contador do Carrinho
// ===========================
function updateCartCount() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalCount;
}

// ===========================
// Forma de Pagamento - PIX
// ===========================
copyPixBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(pixKey.textContent).then(() => {
    alert("Chave Pix copiada para a área de transferência!");
  }).catch(() => {
    alert("Falha ao copiar a chave Pix. Por favor, copie manualmente.");
  });
});

document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", handlePaymentMethodChange);
});

function handlePaymentMethodChange() {
  const selectedPayment = document.querySelector('input[name="payment"]:checked').value.toLowerCase();
  if (selectedPayment === "pix") {
    pixInfo.classList.remove("hidden");
  } else {
    pixInfo.classList.add("hidden");
  }
}

// ===========================
// Funções de Notificação
// ===========================
function notifyPendingCart() {
  if (cart.length > 0) {
    alert("Você tem itens no carrinho! Não esqueça de finalizar sua compra.");
  }
}

function startCartNotification() {
  setInterval(() => {
    if (cart.length > 0 && !document.body.classList.contains("checkout-in-progress")) {
      notifyPendingCart();
    }
  }, 60000);
}

checkoutBtn.addEventListener("click", () => {
  document.body.classList.add("checkout-in-progress");
  setTimeout(() => document.body.classList.remove("checkout-in-progress"), 300000);
});

// ===========================
// Inicializar ao Carregar Página
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  startCartNotification();
});





















// ===========================
// CUSTOM POPUP
// ===========================
let selectedPizza = null; // Pizza selecionada
let basePrice = 0; // Preço base

// Elementos do popup
const popup = document.getElementById('customPopup');
const popupTitle = document.querySelector('.custom-popup-title');
const popupCloseBtn = document.getElementById('closePopup');
const popupAddBtn = document.getElementById('addToCartBtn');
const flavorCheckboxes = document.querySelectorAll('input[name="flavor"]');
const maxFlavorsDisplay = document.getElementById('maxFlavors');

// Tabela de preços base por tamanho
const sizePrices = {
  small: 20.0,
  medium: 30.0,
  large: 40.0,
  family: 60.0 // Adicionado para tamanho Família
};

// Atualizar o preço selecionado no popup
document.querySelectorAll('input[name="size"]').forEach(input => {
  input.addEventListener('change', () => {
    const selectedPrice = parseFloat(input.dataset.price).toFixed(2);
    document.getElementById('selectedPrice').textContent = `R$ ${selectedPrice.replace('.', ',')}`;
  });
});

// Funções de controle
function updateMaxFlavors() {
  const selectedSize = document.querySelector('input[name="size"]:checked');
  const maxFlavors = parseInt(selectedSize?.dataset.maxFlavors || 2);
  const selectedFlavors = Array.from(flavorCheckboxes).filter(cb => cb.checked);

  maxFlavorsDisplay.textContent = maxFlavors;

  flavorCheckboxes.forEach(cb => {
    cb.disabled = !cb.checked && selectedFlavors.length >= maxFlavors;
  });
}

function toggleAddButton() {
  const sizeSelected = !!document.querySelector('input[name="size"]:checked');
  const flavorsSelected = Array.from(flavorCheckboxes).some(cb => cb.checked);
  popupAddBtn.disabled = !(sizeSelected && flavorsSelected);
}

// Função para abrir o popup de personalização
function openCustomPopup(name, price, imageSrc) {
  selectedPizza = name;
  basePrice = price;
  popupTitle.textContent = `Personalize sua ${name}`;
  popup.style.display = 'flex';

  // Resetar todas as opções
  flavorCheckboxes.forEach(cb => (cb.checked = false));
  document.querySelectorAll('input[name="size"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="massa"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="borda"]').forEach(input => (input.checked = false));
  document.querySelectorAll('input[name="refrigerante"]').forEach(input => (input.checked = false));
  document.getElementById("observacao").value = "";

  updateMaxFlavors();
  toggleAddButton();
}

// Adicionar um item ao carrinho ao clicar no botão "Adicionar ao Carrinho"
popupAddBtn.addEventListener("click", () => {
  // 1. Captura o tamanho selecionado no popup (ex.: Pequena, Média, Grande)
  const selectedSizeInput = document.querySelector('input[name="size"]:checked');
  const selectedSize = selectedSizeInput ? selectedSizeInput.value : "Sem tamanho selecionado";
  const sizePrice = selectedSizeInput ? parseFloat(selectedSizeInput.dataset.price) : 0;

  // 2. Captura os sabores selecionados no popup
  const selectedFlavors = Array.from(flavorCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  // 3. Captura a massa escolhida no popup (ex.: Massa Fina, Massa Média)
  const selectedMassaInput = document.querySelector('input[name="massa"]:checked');
  const selectedMassa = selectedMassaInput ? selectedMassaInput.value : "Sem massa selecionada";
  const massaPrice = selectedMassaInput ? parseFloat(selectedMassaInput.dataset.extraPrice) : 0;

  // 4. Captura a borda escolhida no popup (ex.: Catupiry, Cheddar)
  const selectedBordaInput = document.querySelector('input[name="borda"]:checked');
  const selectedBorda = selectedBordaInput ? selectedBordaInput.value : "Sem borda";
  const bordaPrice = selectedBordaInput ? parseFloat(selectedBordaInput.dataset.extraPrice) : 0;

  // 5. Captura o refrigerante escolhido no popup (ex.: Pepsi, Fanta)
  const selectedRefrigeranteInput = document.querySelector('input[name="refrigerante"]:checked');
  const selectedRefrigerante = selectedRefrigeranteInput ? selectedRefrigeranteInput.value : "Sem refrigerante";
  const refrigerantePrice = selectedRefrigeranteInput ? parseFloat(selectedRefrigeranteInput.dataset.extraPrice) : 0;

  // 6. Captura a observação inserida pelo usuário (campo opcional)
  const observacao = document.getElementById("observacao").value.trim();

  // 7. Calcula o preço final com base no tamanho selecionado e extras
  const finalPrice = basePrice + sizePrice + massaPrice + bordaPrice + refrigerantePrice;

  // 8. Cria um identificador único para o item (opcional, pode ser usado para evitar duplicatas)
  const itemId = Date.now();

  // 9. Adiciona todas as informações ao carrinho
  const cartItem = {
    id: itemId,
    name: selectedPizza,
    size: selectedSize,
    flavors: selectedFlavors,
    massa: selectedMassa,
    borda: selectedBorda,
    refrigerante: selectedRefrigerante,
    note: observacao,
    price: finalPrice,
    quantity: 1,
    imageSrc: "default-image.png" // Substitua pelo caminho correto da imagem, se necessário
  };

  addToCart(cartItem);

  // 10. Exibe o carrinho atualizado no console para depuração
  console.log("Carrinho:", cart);

  // 11. Fecha o popup após adicionar o item ao carrinho
  popup.style.display = "none";
});

// Eventos para atualizar limites e botões
flavorCheckboxes.forEach(cb => cb.addEventListener('change', () => {
  updateMaxFlavors();
  toggleAddButton();
}));

document.querySelectorAll('input[name="size"]').forEach(input => input.addEventListener('change', () => {
  updateMaxFlavors();
  toggleAddButton();
}));

// Fechar popup ao clicar no botão de fechar
popupCloseBtn.addEventListener('click', function () {
  popup.classList.add('hidden');
  setTimeout(() => popup.style.display = 'none', 300); // Aguarda a animação antes de esconder
});
