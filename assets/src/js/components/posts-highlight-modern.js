import debounce from '../helpers/debounce'

export default function () {
  const $cards = document.querySelectorAll('[data-highlight="modern"] .post-card')

  if (!$cards.length) {
    return
  }

  function minmax (value, min, max) {
    return Math.min(max, Math.max(value, min)).toFixed(2)
  }

  function isMobile () {
    return window.matchMedia('(max-width: 767px)').matches
  }

  let cardsData = []

  function calculateCardsData () {
    cardsData = []

    const scrollTop = document.documentElement.scrollTop

    $cards.forEach((card) => {
      const rect = card.getBoundingClientRect()
      const content = card.querySelector('.post-card__content').getBoundingClientRect()

      const anime = {
        startFadeIn: rect.top + scrollTop - (window.innerHeight * 0.9),
        stopFadeIn: rect.top + scrollTop - (window.innerHeight * 0.45),
        startFadeOut: content.top + scrollTop - 64,
        stopFadeOut: rect.height + rect.top + scrollTop - (rect.height / 8),
        startTranslate: rect.top + scrollTop + (rect.height / 8),
        stopTranslate: rect.top + scrollTop + (rect.height * 3)
      }

      cardsData.push({
        element: card,
        anime,
        height: rect.height,
        isMobile: isMobile()
      })
    })
  }

  function animate () {
    const scrollTop = document.documentElement.scrollTop

    for (let i = 0; i < cardsData.length; i++) {
      const data = cardsData[i]

      if (data.anime.startFadeOut <= scrollTop && data.anime.stopFadeOut >= scrollTop) {
        const fadeOutPercentage = 1 - ((scrollTop - data.anime.startFadeOut) / (data.anime.stopFadeOut - data.anime.startFadeOut))
        data.element.style.opacity = minmax(fadeOutPercentage, 0.1, 1)
      }

      if (data.anime.startFadeOut >= scrollTop && data.anime.startFadeIn <= scrollTop) {
        data.element.style.opacity = 1
      }

      if (data.anime.stopFadeOut < scrollTop || data.anime.startFadeIn > scrollTop) {
        data.element.style.opacity = 0.1
      }

      if (data.anime.startFadeIn <= scrollTop && data.anime.stopFadeIn >= scrollTop) {
        const fadeInPercentage = ((scrollTop - data.anime.startFadeIn) / (data.anime.stopFadeIn - data.anime.startFadeIn))
        data.element.style.opacity = minmax(fadeInPercentage, 0.1, 1)
      }

      if (data.anime.startTranslate <= scrollTop && data.anime.stopTranslate >= scrollTop && !data.isMobile) {
        const percentage = ((scrollTop - data.anime.startTranslate) / (data.anime.stopTranslate - data.anime.startTranslate))
        const translateY = Math.round(percentage * data.height * 1.3)
        // const scale = 1 - (percentage * 0.5)
        data.element.style.transform = `translate3d(0, ${translateY}px, 0)`
      }

      if (data.anime.startTranslate > scrollTop) {
        data.element.style.transform = 'translate3d(0,0,0)'
      }
    }
  }

  window.addEventListener('resize', debounce(() => {
    calculateCardsData()
    animate()
  }))

  function loop () {
    animate()
    window.requestAnimationFrame(loop)
  }

  calculateCardsData()
  loop()
}
