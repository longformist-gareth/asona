export default function ($embed) {
  const $iframes = document.querySelectorAll('.kg-embed-card iframe')

  $iframes.forEach(iframe => {
    const width = iframe.getAttribute('width')
    const height = iframe.getAttribute('height')

    if (!isNaN(width) && !isNaN(height)) {
      iframe.classList.add('has-aspect-ratio')
      iframe.style.setProperty('--asona--aspect-ratio', `${width}/${height}`)
    }
  })
}
