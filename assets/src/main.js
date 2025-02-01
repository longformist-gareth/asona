// get all scripts inside cards and components
const scripts = import.meta.glob('./js/(cards|components)/*.js', { eager: true })

// execute the default exported function
for (const path in scripts) {
  scripts[path].default()
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const scrollbarWidth = window.innerWidth - document.body.offsetWidth
    document.documentElement.setAttribute('data-dom-content-loaded', true)
    document.documentElement.style.setProperty('--asona--scrollbar-width', `${scrollbarWidth}px`)
  }, 10)
})

const mutationObserver = new window.MutationObserver((mutations) => {
  const style = window.getComputedStyle(document.body)
  document.documentElement.toggleAttribute('data-scroll-disabled', style.overflow === 'hidden')
})

mutationObserver.observe(document.body, {
  attributes: true
})
