export default function imageLoaded (element, callback) {
  let image = false

  if (element.hasAttribute('data-srcset')) {
    image = {
      src: element.getAttribute('data-src'),
      srcset: element.getAttribute('data-srcset'),
      sizes: element.getAttribute('data-sizes')
    }
  } else if (element.hasAttribute('data-src')) {
    image = {
      src: element.getAttribute('data-src')
    }
  } else if (element.style.backgroundImage !== '') {
    const matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g
    const match = matchUrl.exec(element.style.backgroundImage)
    if (match) {
      image = {
        src: match[2]
      }
    }
  }

  if (image) {
    const img = new window.Image()

    img.addEventListener('load', () => {
      callback(element)
    }, false)

    if (image.srcset) {
      img.sizes = image.sizes
      img.srcset = image.srcset
    }

    img.src = image.src
  }
}
