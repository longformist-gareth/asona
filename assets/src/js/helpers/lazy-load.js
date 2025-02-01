import imageLoaded from './image-loaded'

export default function lazyLoad (elements) {
  const observer = new window.IntersectionObserver(function (entries) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const element = entry.target
        observer.unobserve(element)

        imageLoaded(element, (img) => {
          img.setAttribute('data-loaded', true)

          if (img.hasAttribute('data-srcset')) {
            img.setAttribute('sizes', img.dataset.sizes)
            img.setAttribute('srcset', img.dataset.srcset)
          }

          if (img.hasAttribute('data-src')) {
            img.setAttribute('src', img.dataset.src)
          }
        })
      }
    }
  }, {
    // 20% above and below the fold
    rootMargin: '20%'
  })

  elements.forEach(el => {
    observer.observe(el)
  })
}
