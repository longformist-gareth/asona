export default function () {
  const $actionTriggers = document.querySelectorAll('[data-toggle-color-scheme]')

  $actionTriggers.forEach(action => {
    action.addEventListener('click', handleAction)
  })

  function handleAction (e) {
    const $el = e.currentTarget
    const colorScheme = $el.getAttribute('data-toggle-color-scheme')
    const isSystem = colorScheme === 'system'

    if (isSystem) {
      window.localStorage.removeItem(`asona-pcs-${window.location.hostname}`)
      document.documentElement.removeAttribute('data-prefers-color-scheme')
    } else {
      window.localStorage.setItem(`asona-pcs-${window.location.hostname}`, colorScheme)
      document.documentElement.setAttribute('data-prefers-color-scheme', colorScheme)
    }

    document.documentElement.setAttribute('data-transitions-disabled', true)

    setTimeout(() => {
      document.documentElement.removeAttribute('data-transitions-disabled')
    }, 10)

    const event = new window.CustomEvent('asona:color-scheme-changed', {
      detail: {
        colorScheme
      }
    })
    window.dispatchEvent(event)
  }
}
