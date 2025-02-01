export default function ($wrapper) {
  const $buttons = document.querySelectorAll('.sharing-buttons [data-social]')

  $buttons.forEach(button => button.addEventListener('click', onShare))

  function onShare (e) {
    const $el = e.currentTarget
    const type = $el.getAttribute('data-social')
    const url = $el.getAttribute('href')

    if (type === 'copy-link') {
      const copyLink = $el.getAttribute('data-copy-link')

      window.navigator.clipboard.writeText(copyLink).then(() => {
        const $tooltip = $el.querySelector('[role=tooltip]')
        $tooltip.setAttribute('aria-hidden', 'false')
        setTimeout(() => {
          $tooltip.setAttribute('aria-hidden', 'true')
        }, 2500)
      })

      return false
    }

    if (type !== 'mail') {
      e.preventDefault()
      const windowFeatures = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=500,top=40,left=40'
      window.open(url, '_blank', windowFeatures)
    }
  }
}
