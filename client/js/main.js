window.history.pushState("object or string", "MacOutlet - Main", "/user/main");
let productService = [];
(async () => {
    const authToken = await cookieStore.get('token'); 
    fetch('http://localhost:3000/user/products', {
    method: 'GET', 
    headers: {
        "x-access-token": authToken.value,
        },
})
.then((response) => {
  return response.json();
})

.then((items) => {
      productService = new ProductService(items)
      renderProducts(productService.products)
});

const productsModal = document.getElementById("productsModal");

class ProductService {
    constructor(products = []) {
        this.products = products
        this.id = products.id,
        this.category = products.category,
        this.imgUrl = products.imgUrl,
        this.name = products.name,
        this.display = products.display,
        this.color_0 = products.color_0,
        this.color_1 = products.color_1,
        this.color_2 = products.color_2,
        this.color_3 = products.color_3,
        this.color_4 = products.color_4,
        this.color_5 = products.color_5,
        this.price = products.price,
        this.chip_name = products.chip_name,
        this.chip_cores = products.chip_cores,
        this.ram = products.ram,
        this.orderInfo_inStock = products.orderInfo_inStock,
        this.orderInfo_reviews = products.orderInfo_reviews,
        this.orderInfo_orders = products.orderInfo_orders,
        this.size_height = products.size_height,
        this.size_width = products.size_width,
        this.size_depth = products.size_depth,
        this.size_weight = products.size_weight,
        this.os = products.os,
        this.storage = products.storage
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
        return this.products.find(products => {
            return products.id === id
        })
    }
}

class CartService {
    constructor() {
        this.cart = {}
    }

    addToCart(products) {
        const key = products.id
        if (this.cart[key]) {
            const amount = this.cart[key].amount;
            if (amount >= 1 && amount < 4) {
                this.cart[key].amount++
            } 
            return
        } 
        else if (products.orderInfo_inStock === 0) {
            return this.cart[key]
        } 
        
        this.cart[key] = {
            name: products.name,
            price: products.price,
            category: products.category,
            color_0: products.color_0,
            color_1: products.color_1,
            color_2: products.color_2,
            color_3: products.color_3,
            display: products.display,
            orderInfo_inStock: products.orderInfo_inStock,
            imgUrl: products.imgUrl,
            amount: 1
        }
    }

    removeFromCart(productsId) {
        const amount = this.cart[productsId].amount
        if (amount === 1) {
            this.cart[productsId]
        } else {
            this.cart[productsId].amount--
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
    paintProduct(products){ // карточки
        const newCard = document.createElement('div')
        newCard.classList.add('products-card')
        newCard.classList.add('productsModal-open')
        newCard.innerHTML = `
        <div class="products-card-device" data-id="${products.id}">
            <img src="./img/${products.imgUrl}"title="${products.name}"/>
            <ul class="products-body">
                <li><h2 class="products-title">${products.name}</h2></li>
                <li><span>${products.orderInfo_inStock} left in stock </span></li>
                <li><span>Price: <span class="price">${products.price} $</span></span></li>
                <li><button class="product_buy" ${products.orderInfo_inStock === 0?'disabled':''}>Add to cart</button></li>
            </ul>
            <div class="products-footer">
                <img class="footer-img-like" src="img/icons/like_filled.svg" alt="Positive reviews">
                <span class="positive-reviews">
                    ${products.orderInfo_reviews}% positive reviews
                    <span>Above avarage</span>
                </span>
                <span class="orders">
                    ${products.orderInfo_orders} orders
                </span>
            </div>
        </div>
        `
        newCard.addEventListener('click', () => {
            productsModal.style.display = "block";
            const productInfo = productsModal.querySelector('#products_info')
            productInfo.innerHTML = this.paintProductsInfo(products)
            const infoBtn = productInfo.querySelector('.product_buy')
            infoBtn.addEventListener('click', (event) => addToStorage(event, products));
        })
        const btn = newCard.querySelector('.product_buy')
        btn.addEventListener('click', (event) => addToStorage(event, products));
        return newCard
    }

    paintProductsInfo(products) { // модалка для карточки
        return `
        <div class="products_info-device" data-id="${products.id}">
            <div class="products_info-header">
                <img src="./img/${products.imgUrl}"title="${products.name}"/>
            </div>
            <div class="products_info-body">
                <h2>${products.name}</h2>
                <div class="products_info-reviews products-footer"
                    <div class="positive-reviews">
                        <img class="footer-img-like" src="img/icons/like_filled.svg" alt="Positive reviews">
                        <span class="positive-reviews">
                            ${products.orderInfo_reviews}% positive reviews
                            <span>Above avarage</span>
                        </span>
                        <span class="orders">
                            ${products.orderInfo_orders} orders
                        </span>
                    </div>
                    
                    <div class="product_info-options">
                        <p>Color: <span class="options-descr">${products.color_0},${products.color_1},${products.color_2}</span></p>
                        <p>Operating System: <span class="options-descr">${products.os}</span></p>
                        <p>Storage: <span class="options-descr">${products.storage} Gb</span></p>
                        <p>Chip: <span class="options-descr">${products.chip_name}</span></p>
                        <p>Height: <span class="options-descr">${products.size_height} cm</span></p>
                        <p>Width: <span class="options-descr">${products.size_width} cm</span></p>
                        <p>Depth: <span class="options-descr">${products.size_depth} cm</span></p>
                        <p>Weight: <span class="options-descr">${products.size_weight} kg</span></p>    
                    </div>
                </div>
                
            </div>
            <div class="products_info-footer">
                <span class="products_info-price">$${products.price}</span>
                <p class="products_info-stock">Stock: ${products.orderInfo_inStock} pcs.</p>
                <button class="product_buy" ${products.orderInfo_inStock === 0?'disabled':''}>Add to cart</button>
            </div>
        </div>
        `
    }
    
    paintCartItem(products) { // корзина
        return `
            <div class="cart-body" data-type="remove" data-id="${products.id}">
                <img src="./img/${products.imgUrl}" class="cart-image"/>
                <p class="cart-name">${products.name}</p>
                <p class="cart-price">$${products.price}</p>
                <button class="cart-change" data-type="remove" data-id="${products.id}">&lt;</button>
                <p class="cart-amount">${products.amount}</p>
                <button class="cart-change" data-type="addCard" data-id="${products.id}">&gt;</button>
                <button class="cart-remove" data-type="clearCard" data-id="${products.id}">&times;</button>
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
const cartService = new CartService();
const htmlService = new HTMLService();

const productsContainer = document.getElementById('products')
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

function addToStorage(event, products) {
    cartService.addToCart(products)
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
})()

