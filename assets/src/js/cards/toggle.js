export default function ($toggle) {
  const $headings = document.querySelectorAll('.kg-toggle-heading button')

  $headings.forEach(heading => heading.addEventListener('click', onToggle, false))

  function onToggle (e) {
    const $el = e.target
    const $card = $el.closest('.kg-toggle-card')
    const $content = $card.querySelector('.kg-toggle-content')
    const isClosed = $card.getAttribute('data-kg-toggle-state') === 'close'
    const contentHeight = $content.scrollHeight

    $card.setAttribute('data-kg-toggle-state', isClosed ? 'opening' : 'closing')
    $content.style.setProperty('--asona--toggle--max-height', `${contentHeight}px`)

    if (!isClosed) {
      setTimeout(() => {
        $content.style.setProperty('--asona--toggle--max-height', '0px')
      }, 10)
    }

    setTimeout(() => {
      $card.setAttribute('data-kg-toggle-state', isClosed ? 'open' : 'close')
    }, 300)
  }
}
