const menuButton = document.querySelector('[data-menu="button"]')

const handleClick = () => {
  menuButton.classList.toggle('active')
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
    
    console.log(imagesUrl)
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