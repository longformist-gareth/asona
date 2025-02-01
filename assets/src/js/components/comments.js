export default function () {
  const $commentsIframe = document.querySelector('.comments iframe')

  $commentsIframe?.addEventListener('load', (e) => {
    const $iframe = e.target

    $iframe.contentDocument.documentElement.classList.add('asona-comments-iframe')

    // add all style tags to iframe
    document.querySelectorAll('style').forEach((style) => {
      $iframe.contentDocument.head.appendChild(style.cloneNode(true))
    })

    // add all link stylesheets to iframe
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      $iframe.contentDocument.head.appendChild(link.cloneNode(true))
    })

    setCommentsColorScheme(getCurrentColorScheme())
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const colorScheme = e.matches ? 'dark' : 'light'
    setCommentsColorScheme(colorScheme)
  })

  window.addEventListener('asona:color-scheme-changed', (e) => {
    const colorScheme = e.detail.colorScheme
    setCommentsColorScheme(colorScheme)
  })

  function setCommentsColorScheme (colorScheme) {
    const isSystem = colorScheme === 'system'

    colorScheme = isSystem ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : colorScheme

    $commentsIframe?.contentDocument.documentElement.setAttribute('data-has-dark-mode-support', true)
    $commentsIframe?.contentDocument.documentElement.setAttribute('data-prefers-color-scheme', colorScheme)
    $commentsIframe?.contentDocument.querySelector('.ghost-display')?.classList.toggle('dark', colorScheme === 'dark')
  }

  function getCurrentColorScheme () {
    const prefersColorScheme = document.documentElement.getAttribute('data-prefers-color-scheme')

    if (prefersColorScheme) {
      return prefersColorScheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
}
