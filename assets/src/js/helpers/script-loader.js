function isVisible (element) {
  return new Promise(function (resolve) {
    const observer = new window.IntersectionObserver(function (entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect()
          resolve(true)
        }
      }
    }, {
      rootMargin: '100%'
    })
    observer.observe(element)
  })
}

function getLoader (loading, element) {
  const loader = {
    eager: (x) => x(),
    lazy: async (x) => {
      await isVisible(element)
      x()
    }
  }
  return loader[loading] ?? loader.eager
}

export default function scriptLoader (scripts) {
  for (const [dir, group] of Object.entries(scripts)) {
    for (const [element, options] of Object.entries(group)) {
      const selector = (dir === 'cards') ? `kg-${element}-card` : element
      const $element = document.querySelector(`.${selector}`)

      if ($element) {
        const loader = getLoader(options.loading, $element)

        loader(() => {
          import(`../${dir}/${element}.js`).then((component) =>
            component.default($element)
          )
        })
      }
    }
  }
}
