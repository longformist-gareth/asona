export default function () {
  const $header = document.querySelector('.site-header')

  const checkIsSticky = (entries) => {
    const isSticky = !entries[0].isIntersecting
    $header.setAttribute('data-is-sticky', isSticky)
  }

  const observer = new window.IntersectionObserver(checkIsSticky, {
    root: document,
    threshold: [1]
  })

  observer.observe($header)
}
