const menuButton = document.querySelector('[data-menu="button"]')

const handleClick = () => {
  menuButton.classList.toggle('active')
}

menuButton.addEventListener('click', handleClick)