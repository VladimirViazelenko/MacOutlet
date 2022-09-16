class ProductService {
    constructor(products = []) {
        this.products = products
        this.name = products.name,
        this.price = products.price,
        this.category = products.category,
        this.color = products.color,
        this.display = products.display,
        this.orderInfo = products.orderInfo

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
            this.cart[key].amount++
            return
        } else if (product.orderInfo.inStock === 0) {
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
            delete this.cart[productId]
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
    paintProduct(product){
        return `
        <div class="products-card" data-id="${product.id}">
            <img src="${product.imgUrl}"title="${product.name}"/>
            <ul class="products-body">
                <li><h2 class="products-title">${product.name}</h2></li>
                <li><span>${product.orderInfo.inStock} left in stock </span></li>
                <li><span>Price: $${product.price}</span></li>
                <li><button class="product_buy">Add to cart</button></li>
            </ul>
            <ul class="products-footer">
                <li>${product.orderInfo.reviews}% positive reviews</li>
                <li><span>Above avarage</span>
                <li><span>500 orders</span></li>
            </ul>
        </div>
        `
    }


    paintProducts(products = []) {
        return products.map(this.paintProduct).join('')
       
    }

    paintCartItem(product) {
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
                    <p>Cart is empty</p>
                </div>   
            `
        }
        if (items.length >= 1) {
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
                <button class="cart-buy" data-type="buy">Buy</button>
                <button class="clear" data-type="clear">Clean out</button>
            </div>
        `
        }
        
    }
}

const productService = new ProductService(items)
const cartService = new CartService()
const htmlService = new HTMLService()

const productsContainer = document.getElementById('products')
const cartContainer = document.getElementById('cart') 
const filterInput = document.getElementById('filter') 

filterInput.addEventListener('input', event => {
    const value = event.target.value

    const filteredProducts = productService.filterBy(value)

    renderProducts(filteredProducts)
})

productsContainer.addEventListener('click', event => {
    const id = event.target.dataset.id 
        ? event.target.dataset.id
        : event.target.closest('div')?.dataset.id

    if (id) {
        cartService.addToCart(
            productService.getById(+id)
        )
        renderCart()
    }
})

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
            cartService.addToCart()
            renderCart()
            break
    }
})
function renderProducts(products) {
    productsContainer.innerHTML = htmlService.paintProducts(products)
}

function renderCart() {
    cartContainer.innerHTML = htmlService.paintCart(
        cartService.getCartInfo())
}

renderCart()
renderProducts(productService.products)