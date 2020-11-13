const MobileMenu = () => {
  const mobileMenu = document.querySelector('#mobile-nav')
  if(mobileMenu){
    mobileMenu.addEventListener('focusin',(e) => {
      mobileMenu.classList.add('open')
    })
    mobileMenu.addEventListener('focusout',(e) => {
      mobileMenu.classList.remove('open')
    })
  }

  const ham = mobileMenu.querySelector('#hamburger')
  if(ham){
    ham.addEventListener('mouseup',(e) => {
      console.log('clicked',e.target.parentElement)
      mobileMenu.classList.toggle('open')
    })  
  }

  const close = mobileMenu.querySelector('#mobile-nav #close')
  console.log(close);
  if(close){
    close.addEventListener('mouseup',(e) => {
      console.log('clicked')
      mobileMenu.classList.toggle('open')
    })
  }
}

export { MobileMenu }