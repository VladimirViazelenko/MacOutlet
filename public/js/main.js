fetch('http://localhost:3000/user/products')
.then((response) => {
  return response.json();
})
.then((items) => {
  renderProducts(productService.products)
  console.log(items)
});

const productsModal = document.getElementById("productsModal");

class ProductService {
    constructor(products = []) {
        this.products = products
        this.name = products.name,
        this.price = products.price,
        this.category = products.category,
        this.color = products.color,
        this.display = products.display,
        this.orderInfo = products.orderInfo,
        this.size = products.size,
        this.chip = products.chip,
        this.os = products.os
    }
    filterBy(search = '') {
        if(!search.trim()) return this.products
        
        return this.products.filter(product => {
            return product.name.toLowerCase().includes(search.toLowerCase())
        })
    }

    getByIndex(index) {
        return this.products[index]
    }

    getById(id) {
        return this.products.find(product => {
            return product.id === id
        })
    }
}

class CartService {
    constructor() {
        this.cart = {}
    }

    addToCart(product) {
        const key = product.id
        if (this.cart[key]) {
            const amount = this.cart[key].amount;
            if (amount >= 1 && amount < 4) {
                this.cart[key].amount++
            } 
            return
        } 
        else if (product.orderInfo.inStock === 0) {
            return this.cart[key]
        } 
        
        this.cart[key] = {
            name: product.name,
            price: product.price,
            category: product.category,
            color: product.color,
            display: product.display,
            orderInfo: product.orderInfo,
            imgUrl: product.imgUrl,
            amount: 1
        }
    }

    removeFromCart(productId) {
        const amount = this.cart[productId].amount
        if (amount === 1) {
            this.cart[productId]
        } else {
            this.cart[productId].amount--
        }
    }

    clearCart() {
        this.cart = {}
    }

    clearFromCart(productId) {
        const amount = this.cart[productId].amount
        if (amount >= 1) {
            delete this.cart[productId]
        } else {
            this.cart[productId].amount--
        }
    }

    addCart(productId) {
        const amount = this.cart[productId].amount
        if (amount >= 1 && amount < 4) {
            this.cart[productId].amount++
        } 
    }

    getCartInfo() {
        const items = Object.keys(this.cart).map(id => {
            return {
                id,
                ...this.cart[id]
            }
        })
        const totalPrice = items.reduce((sum, item) => {
            return sum += item.amount * item.price
        }, 0)

        const totalAmount = items.reduce((sum, item) => {
            return sum += item.amount
        }, 0)

        return {
            items, totalPrice, totalAmount
        }
    }
}

class HTMLService {
    paintProduct(product){ // карточки
        const newCard = document.createElement('div')
        newCard.classList.add('products-card')
        newCard.classList.add('productsModal-open')
        newCard.innerHTML = `
        <div class="products-card-device" data-id="${product.id}">
            <img src="${product.imgUrl}"title="${product.name}"/>
            <ul class="products-body">
                <li><h2 class="products-title">${product.name}</h2></li>
                <li><span>${product.orderInfo?.inStock} left in stock </span></li>
                <li><span>Price: <span class="price">${product.price} $</span></span></li>
                <li><button class="product_buy" ${product.orderInfo?.inStock === 0?'disabled':''}>Add to cart</button></li>
            </ul>
            <div class="products-footer">
                <img class="footer-img-like" src="img/icons/like_filled.svg" alt="Positive reviews">
                <span class="positive-reviews">
                    ${product.orderInfo.reviews}% positive reviews
                    <span>Above avarage</span>
                </span>
                <span class="orders">
                    ${product.orderInfo.orders} orders
                </span>
            </div>
        </div>
        `
        newCard.addEventListener('click', () => {
            productsModal.style.display = "block";
            const productInfo = productsModal.querySelector('#products_info')
            productInfo.innerHTML = this.paintProductsInfo(product)
            const infoBtn = productInfo.querySelector('.product_buy')
            infoBtn.addEventListener('click', (event) => addToStorage(event, product));
        })
        const btn = newCard.querySelector('.product_buy')
        btn.addEventListener('click', (event) => addToStorage(event, product));
        return newCard
    }

    paintProductsInfo(product) { // модалка для карточки
        return `
        <div class="products_info-device" data-id="${product.id}">
            <div class="products_info-header">
                <img src="${product.imgUrl}"title="${product.name}"/>
            </div>
            <div class="products_info-body">
                <h2>${product.name}</h2>
                <div class="products_info-reviews products-footer"
                    <div class="positive-reviews">
                        <img class="footer-img-like" src="img/icons/like_filled.svg" alt="Positive reviews">
                        <span class="positive-reviews">
                            ${product.orderInfo.reviews}% positive reviews
                            <span>Above avarage</span>
                        </span>
                        <span class="orders">
                            ${product.orderInfo.orders} orders
                        </span>
                    </div>
                    
                    <div class="product_info-options">
                        <p>Color: <span class="options-descr">${product.color}</span></p>
                        <p>Operating System: <span class="options-descr">${product.os}</span></p>
                        <p>Storage: <span class="options-descr">${product.storage.toFixed(0)} Gb</span></p>
                        <p>Chip: <span class="options-descr">${product.chip?.name}</span></p>
                        <p>Height: <span class="options-descr">${product.size?.height} cm</span></p>
                        <p>Width: <span class="options-descr">${product.size?.width} cm</span></p>
                        <p>Depth: <span class="options-descr">${product.size?.depth} cm</span></p>
                        <p>Weight: <span class="options-descr">${product.size?.weight} g</span></p>    
                    </div>
                </div>
                
            </div>
            <div class="products_info-footer">
                <span class="products_info-price">$${product.price}</span>
                <p class="products_info-stock">Stock: ${product.orderInfo?.inStock} pcs.</p>
                <button class="product_buy" ${product.orderInfo?.inStock === 0?'disabled':''}>Add to cart</button>
            </div>
        </div>
        `
    }
    
    paintCartItem(product) { // корзина
        return `
            <div class="cart-body" data-type="remove" data-id="${product.id}">
                <img src="${product.imgUrl}" class="cart-image"/>
                <p class="cart-name">${product.name}</p>
                <p class="cart-price">$${product.price}</p>
                <button class="cart-change" data-type="remove" data-id="${product.id}">&lt;</button>
                <p class="cart-amount">${product.amount}</p>
                <button class="cart-change" data-type="addCard" data-id="${product.id}">&gt;</button>
                <button class="cart-remove" data-type="clearCard" data-id="${product.id}">&times;</button>
            </div>
        `
    }

    paintCart({ items, totalPrice, totalAmount}) {
        if (items.length === 0) {
            return `
                <div class="cart-list" id="cart-list">
                    <div class="cart-title">
                        <h3 class="shopping-title">Shopping Cart</h3>
                        <span class="shopping-description">Checkout is almost done!</span>
                    </div>
                </div> 
                <hr />
                <div id="cart-body">
                    <p class="cart-info">Cart is empty</p>
                </div>
                <hr />
                <div class="cart-footer info">
                    <span>Total amount: <strong>0 ptc</strong></span>
                    <span>Total price: <strong>0 $</strong></span>
                </div>
                <div class="cart-buttons">
                    <button class="cart-buy" data-type="buy">Buy</button>
                </div>
                
            `
        }
        else if (items.length >= 1) {
            return `
            <div class="cart-list" id="cart-list">
                <div class="cart-title">
                    <h3 class="shopping-title">Shopping Cart</h3>
                    <span class="shopping-description">Checkout is almost done!</span>
                </div>
                <hr />
                <div id="cart-body">
                    ${items.map(this.paintCartItem).join('')}
                </div>
                <hr />
                <div class="cart-footer info">
                    <span>Total amount: <strong>${totalAmount} ptc</strong></span>
                    <span>Total price: <strong>$${totalPrice.toFixed(2)}</strong></span>
                </div>
                <div class="cart-buttons">
                    <button class="cart-buy" data-type="buy">Buy</button>
                </div>
            </div>
        `
        }
    }
}

const productService = new ProductService(items)
const cartService = new CartService()
const htmlService = new HTMLService()

const productsContainer = document.getElementById('products')
const productsInfoContainer = document.getElementById('products_info')
const cartContainer = document.getElementById('cart')
const filterContainer = document.getElementById('filter-container')

const filterInput = document.getElementById('filter') 
const filterOpen = document.getElementById('filter-open')

filterOpen.addEventListener('click', () => {
    if (filterContainer.style.display === "block") {
        filterContainer.style.display = "none";
    } else {
        filterContainer.style.display = "block";
    }
})

filterInput.addEventListener('input', event => {
    const value = event.target.value
    const filteredProducts = productService.filterBy(value)
    renderProducts(filteredProducts)
})

function addToStorage(event, product) {
    cartService.addToCart(product)
    renderCart()
    event.stopPropagation()
}

cartContainer.addEventListener('click', event => {
    const type = event.target?.dataset.type
    const id = event.target?.dataset.id
    switch (type) {
        case 'clear':
            cartService.clearCart()
            renderCart()
            break
        case 'remove':
            cartService.removeFromCart(id)
            renderCart()
            break
        case 'clearCard':
            cartService.clearFromCart(id)
            renderCart()
            break
        case 'addCard':
            cartService.addCart(id)
            renderCart()
            break
    }
})

const modal = document.querySelector("#modal");
const modalOverlay = document.querySelector("#modal-overlay");
const openButton = document.querySelector("#open-button");
const closeButton = document.querySelector("#close-button");

openButton.addEventListener("click", function() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
  });

closeButton.addEventListener("click", function() {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");
});

function modalActions() {
    const productsModal = document.getElementById("productsModal");
    const modalClose = document.getElementsByClassName("productsModal-close")[0];

    modalClose.addEventListener("click", function() {
        productsModal.style.display = "none";
      });
      
    window.addEventListener("click", function(event) {
        if (event.target == productsModal) {
          productsModal.style.display = "none";
        }
      }); 
}

const acc = document.getElementsByClassName("accordion"); // Accordion filter (price,color..)
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    const shopFilter = this.nextElementSibling;
    if (shopFilter.style.display === "block") {
        shopFilter.style.display = "none";
    } else {
        shopFilter.style.display = "block";
    }
  });
}

function renderProducts(products) { 
    productsContainer.innerHTML = ''
    products.map(product => productsContainer.appendChild(htmlService.paintProduct(product)));
    modalActions()
}

function renderCart() {
    cartContainer.innerHTML = htmlService.paintCart(
        cartService.getCartInfo())
}

renderCart()
renderProducts(productService.products)