export default function () {
  const $images = document.querySelectorAll('.kg-gallery-image img')

  $images.forEach($image => {
    const $container = $image.closest('.kg-gallery-image')
    const width = $image.getAttribute('width')
    const height = $image.getAttribute('height')
    const ratio = width / height
    $container.style.flex = ratio + ' 1 0%'
  })
}
