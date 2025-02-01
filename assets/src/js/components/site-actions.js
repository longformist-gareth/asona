import debounce from '../helpers/debounce'

export default function () {
  const $header = document.querySelector('.site-header')
  const $actions = document.querySelector('.site-actions')
  const $actionTriggers = $header.querySelectorAll('[data-site-action-trigger]')
  const $closeSiteActions = $actions.querySelector('[data-close-site-actions]')

  $actionTriggers.forEach(action => {
    action.addEventListener('click', handleAction)
  })

  window.addEventListener('resize', debounce(() => {
    window.document.documentElement.style.setProperty('--asona--dvh', `${window.innerHeight}px`)
  }))

  function handleAction (e) {
    const $el = e.currentTarget
    const action = $el.getAttribute('data-site-action-trigger')
    const isExpanded = $el.getAttribute('aria-expanded') === 'true'
    const $controlEl = document.getElementById($el.getAttribute('aria-controls'))

    closeActions()

    if (!isExpanded) {
      document.body.style.overflow = 'hidden'
      window.document.documentElement.style.setProperty('--asona--dvh', `${window.innerHeight}px`)
      $el.setAttribute('aria-expanded', true)
      $header.setAttribute('data-state', `${action}-opening`)
      $actions.style.setProperty('--asona--site-actions--height', `${$controlEl.scrollHeight}px`)
      $header.style.setProperty('--asona--site-header--offset', `${window.Math.max(0, $header.getBoundingClientRect().top)}px`)

      setTimeout(() => {
        $header.setAttribute('data-state', `${action}-open`)
      }, 150)
    }

    const event = new window.CustomEvent('asona:site-actions', {
      detail: {
        isExpanded: !isExpanded,
        action,
        el: $el,
        controls: $controlEl
      }
    })
    window.dispatchEvent(event)
  }

  function closeActions () {
    $actionTriggers.forEach(action => {
      action.setAttribute('aria-expanded', false)
    })
    $header.removeAttribute('data-state')
    document.body.style.overflow = ''
  }

  // close all on closeSiteActions click
  $closeSiteActions.addEventListener('click', closeActions)
}
