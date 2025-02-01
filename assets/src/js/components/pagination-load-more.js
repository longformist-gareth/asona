export default function () {
  const $loadMore = document.querySelector('.pagination-load-more')

  if (!$loadMore) {
    return
  }

  const $pagination = $loadMore.closest('.pagination')
  const $postsFeed = document.querySelector('.posts-feed')

  const isIfiniteScroll = window.asona_infinite_scroll === true
  let isIfiniteScrollObserver = null

  if (isIfiniteScroll) {
    isIfiniteScrollObserver = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        $loadMore.click()
      }
    }, {
      threshold: 0,
      rootMargin: '100%'
    })

    isIfiniteScrollObserver.observe($pagination)
  }

  $loadMore.addEventListener('click', loadMore, false)

  function loadMore (e) {
    e.preventDefault()

    const $el = e.currentTarget
    const link = $el.getAttribute('href')
    const isLoading = $el.getAttribute('data-state') === 'loading'
    const pagination = {
      page: parseInt($pagination.querySelector('[data-pagination-page]').getAttribute('data-pagination-page'), 10),
      pages: parseInt($pagination.querySelector('[data-pagination-pages]').getAttribute('data-pagination-pages'), 10)
    }

    if (isLoading) {
      return
    }

    pagination.page++
    $loadMore.setAttribute('data-state', 'loading')

    window.fetch(link)
      .then(response => response.text())
      .then(data => {
        const parser = new window.DOMParser()
        const $html = parser.parseFromString(data, 'text/html')
        const $fetchedPosts = $html.querySelectorAll('.posts-feed .post')
        const $fetchedPagination = $html.querySelector('.pagination-load-more')
        const $fetchedPaginationInfo = $html.querySelector('.pagination__info')
        const $paginationInfo = $pagination.querySelector('.pagination__info')

        if ($fetchedPosts) {
          $fetchedPosts.forEach((el, key) => {
            $postsFeed.append(el)
          })

          const $firstPostFocusable = $fetchedPosts[0].querySelector('.post-card__media')
          $firstPostFocusable?.focus({
            preventScroll: true
          })
        }

        if ($fetchedPagination && pagination.page !== pagination.pages) {
          const nextUrl = $fetchedPagination.getAttribute('href')
          $loadMore.setAttribute('href', nextUrl)
        } else {
          $loadMore.remove()
          if (isIfiniteScroll) {
            isIfiniteScrollObserver.unobserve($pagination)
          }
        }

        $pagination.querySelector('.pagination__container').replaceChild($fetchedPaginationInfo, $paginationInfo)

        $loadMore.setAttribute('data-state', 'initial')
      })
      .catch(error => {
        console.log(error)
        $loadMore.setAttribute('data-state', 'error')
      })
  }
}
