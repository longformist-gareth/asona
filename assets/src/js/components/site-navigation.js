import debounce from '../helpers/debounce'

export default function () {
  const $header = document.querySelector('.site-header')
  const $navigation = document.querySelector('.site-navigation')
  const $itemsWithSubMenu = $navigation.querySelectorAll('[data-open-submenu]')
  const initalNavigationHeight = $navigation.scrollHeight
  const submenuHeights = new Map()

  $itemsWithSubMenu.forEach(action => {
    action.addEventListener('click', handleSubMenu)
  })

  $navigation.querySelectorAll('[data-has-submenu]').forEach(action => {
    action.addEventListener('focusout', (e) => {
      if (!action.contains(e.relatedTarget) && window.matchMedia('(min-width: 62.5em)').matches) {
        action.querySelector('[aria-expanded]').setAttribute('aria-expanded', false)
        action.querySelector('[aria-hidden]').setAttribute('aria-hidden', true)
      }
    })
  })

  window.addEventListener('resize', debounce(() => {
    maybeRemoveEnvSafeArea()
  }))

  window.addEventListener('asona:site-actions', (e) => {
    const isExpanded = e.detail.isExpanded

    if (isExpanded) {
      maybeRemoveEnvSafeArea()
    } else {
      submenuHeights.clear()
    }
  })

  document.addEventListener('click', (e) => {
    if ($navigation && $navigation !== e.target && !$navigation.contains(e.target)) {
      closeSubmenu()
    }
  })

  function handleSubMenu (e) {
    const $el = e.currentTarget
    const controls = $el.getAttribute('aria-controls')
    const $controls = document.getElementById(controls)
    const $parentSub = $el.closest('.nav-submenu')
    const isExpanded = $el.getAttribute('aria-expanded') === 'true'

    const subMenuScrollHeight = $controls.scrollHeight

    $el.setAttribute('aria-expanded', !isExpanded)
    $controls.setAttribute('aria-hidden', isExpanded)

    if (isExpanded) {
      $controls.style.setProperty('--nav-submenu-max-height', 0)
      submenuHeights.set(controls, 0)
    } else {
      if ($parentSub) {
        $parentSub.style.setProperty('--nav-submenu-max-height', $parentSub.scrollHeight + subMenuScrollHeight + 'px')
      }
      $controls.style.setProperty('--nav-submenu-max-height', subMenuScrollHeight + 'px')
      submenuHeights.set(controls, subMenuScrollHeight)
    }

    maybeRemoveEnvSafeArea()
  }

  function closeSubmenu (e) {
    $itemsWithSubMenu.forEach((el) => {
      el.setAttribute('aria-expanded', false)
      el.nextElementSibling.setAttribute('aria-hidden', true)
    })
    submenuHeights.clear()
  }

  function maybeRemoveEnvSafeArea () {
    const hasEnvSafeArea = window.getComputedStyle(document.documentElement).getPropertyValue('--asona--safe-area--bottom') > '0px'
    const dvh = window.innerHeight
    const sumSubmenuHeights = Array.from(submenuHeights.values()).reduce((a, b) => a + b, 0)
    const navigationHeight = initalNavigationHeight + sumSubmenuHeights
    const navigationOffset = $navigation.getBoundingClientRect().top

    if (hasEnvSafeArea && dvh > (navigationHeight + navigationOffset + 10)) {
      $header.style.setProperty('--asona--safe-area--bottom', '0px')
    } else {
      $header.style.removeProperty('--asona--safe-area--bottom')
    }
  }
}
