$ ->
  # LOADING ---------------------------------------------------------------------------------------
  $.getJSON './Posts/posts.txt', (postData) ->
    for post in postData
      element = $("<article><h1>#{post.Title}</h1><div id='guts'></div></article>")
      $('#content').append(element)
      element.data('post', "#{post.Title}")
      element.data('postUrl', "http://02credits.com/Posts/#{post.Url}/post.html")
      element.data('url', post.Url)

    # POST HANDLING -------------------------------------------------------------------------------

    $('article').on 'transitionend', () ->
      if $(this).hasClass 'active'
        guts = $(this).find('#guts')
        guts.addClass 'noTransitions'
        guts.css 'height', 'auto'
        setTimeout () ->
          guts.removeClass 'noTransitions'
        , 20

    $('article > h1').bind 'click', (e) ->
      article = $(this).parent()
      open = not article.hasClass 'active'
      closeActive()
      if open
        openPost article
        history.pushState(null, null, 'http://02credits.com/' + article.data 'url')
      else
        history.pushState(null, null, 'http://02credits.com/')

    openPost = (article) ->
      postUrl = article.data 'postUrl'
      url = article.data 'url'
      guts = article.find '#guts'
      guts.load postUrl, () ->
        article.addClass 'active'
        tmp = guts.clone()
        tmp.css
          'height': 'auto'
        tmp.appendTo(guts.parent())
        height = tmp.outerHeight()
        tmp.remove()
        guts.css 'height', height

    closeActive = () ->
      $('.active').each () ->
        article = $(this)
        guts = article.find '#guts'
        guts.addClass 'noTransitions'
        height = getFullElementHeight guts
        guts.css 'height', height
        setTimeout () ->
          guts.removeClass 'noTransitions'
          guts.css 'height', 0
          article.removeClass 'active'
        , 20

    getFullElementHeight = (element) ->
      tmp = element.clone()
      tmp.appendTo element.parent()
      tmp.css 'height', 'auto'
      height = tmp.outerHeight()
      tmp.remove()
      height

    openUrl = () ->
      closeActive()
      newUrl = location.pathname.replace /^.*[\\/]/, ''
      if newUrl != ''
        article = $('article').filter ->
          url = $(this).data('url').toLowerCase()
          url == newUrl.toLowerCase()
        if article.length > 0
          openPost article

    openUrl()

    $(window).bind 'popstate', () ->
      openUrl()

