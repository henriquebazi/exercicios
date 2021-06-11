const menuButton = document.querySelector('[data-menu="button"]')
const shopCart = document.querySelector('[data-cart="shopCart"]')

const handleClick = () => {
  menuButton.classList.toggle('active')
  shopCart.classList.toggle('active')
}

menuButton.addEventListener('click', handleClick)

/* Fetch */
const fetchUrl = async (url) => {
  const getData = await fetch(url)
  const data = await getData.json()

  return data
}

const getHtml = async (url) => {
  const products = await fetchUrl(url)
  const productsHtml = []

  products.forEach(product => {
    const { name, images, price } = product.product
    const imagesUrl = images.reduce((acc, image) => {  
      return acc += `<img src="${image}">`
    }, '')  
    
    const html = `
      <div class="product-item">
        <div class="short-images">
          ${imagesUrl}
        </div>
        <div class="cover-image">
          <img src="${images[0]}" />
        </div>
        <div class="item-info">
          <h2>${name}</h2>
          <div class="price-info">
            <div class="price">
              <p>${price.installments}x R$ <span>${price.installmentValue}</span></p>
              <p>ou <span>R$ ${price.value}</span> à vista</p>
            </div>
            <div class="add-button">
              <button class="btn-add">Adicionar ao carrinho</button>
            </div>
          </div>
        </div>
      </div>
    `
    
    productsHtml.push(html)
  })

  return productsHtml
}

const setHtmlProducts = async () => {
  const divProducts = document.querySelector('.products')
  const html = await getHtml("http://localhost:5566/items")

  const htmlString = html.reduce((acc, product) => {
    return acc += product
  }, '')

  divProducts.innerHTML = htmlString
}

document.addEventListener("DOMContentLoaded", () => {
  setHtmlProducts()
})

/* Shop Cart */
const shopSet = async () => {
  let carts = document.querySelectorAll('.btn-add')
  let products = []

  const myProducts = await fetchUrl('http://localhost:5566/items')
  
  myProducts.forEach(({product}) => {
    products.push(product)
  })
  
  for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
      cartNumbers(products[i])
      totalCost(products[i])
      onLoadCartNumbers()
    })
  }

  const onLoadCartNumbers = () => {
    let productsNumbers = localStorage.getItem('cartNumbers')

    if (productsNumbers) {
      document.querySelector('.menu .cart').textContent = productsNumbers
      document.querySelector('.menu .totalCart').style.display = 'flex'
    }
  }

  onLoadCartNumbers()

  const cartNumbers = product => {
    let productsNumbers = localStorage.getItem('cartNumbers')
    productsNumbers = parseInt(productsNumbers)

    if (productsNumbers) {
      localStorage.setItem('cartNumbers', productsNumbers + 1)
      document.querySelector('.menu .cart').textContent = productsNumbers + 1
    } else {
      localStorage.setItem('cartNumbers', 1)
      document.querySelector('.menu .cart').textContent = 1
    }

    setItens(product)
  }

  const setItens = product => {
    let cartItems = localStorage.getItem('productsInCart')
    cartItems = JSON.parse(cartItems)

    if(cartItems != null) {
      if(cartItems[product.id] == undefined) {
        cartItems = {
          ...cartItems,
          [product.id]: product
        }
      }
      if (cartItems[product.id].inCart != null) {
        cartItems[product.id].inCart += 1
      } else {
        cartItems[product.id].inCart = 1
      }
    } else {
      product.inCart = 1 
      
      cartItems = {
        [product.id]: product
      }
    }
    
    localStorage.setItem("productsInCart", JSON.stringify(cartItems))
  }

  const totalCost = ({price}) => {
    let cartCost = JSON.parse(localStorage.getItem('totalCost'))
    let priceValue = null
    let installments = null
    let installmentValue = null

    if (cartCost != null) {
      priceValue = cartCost.priceValue + price.value
      installments = price.installments
      installmentValue = cartCost.installmentValue + price.installmentValue
    } else {
      priceValue = price.value
      installments = price.installments
      installmentValue = price.installmentValue
    }

    const prices = {priceValue, installments, installmentValue}

    localStorage.setItem('totalCost', JSON.stringify(prices))
  }
}

setTimeout(shopSet, 2000)