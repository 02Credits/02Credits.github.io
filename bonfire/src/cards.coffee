define [
  "jquery",
  "mithril",
  "arbiter"
], ($, m, arbiter) ->
  cards = [
    "http://i.imgur.com/aZ7GpiQ.png",
    "http://i.imgur.com/xmbl34o.jpg",
    "http://i.imgur.com/dVWdko8.jpg",
    "http://i.imgur.com/DieNi7L.jpg",
    "http://i.imgur.com/a1epPuB.jpg",
    "http://i.imgur.com/DIl4w3p.gif",
    "http://i.imgur.com/cPwAnaL.jpg",
    "http://i.imgur.com/doHAiPD.jpg",
    "http://i.imgur.com/FCKBSP0.jpg"
  ]
  spacing = 40
  cardWidth = 168
  cardHeight = 244

  closeCards = (e) ->
    $('.memeCard').css({'right': ""})
    $('.memeCard').removeClass('open')
    e.stopPropagation()

  openCards = () ->
    $('.memeCard').each((i) ->
      $(this).css({'right': (spacing * (i) + cardWidth).toString() + "px"})
      $(this).addClass('open')
    )

  clickCard = (card) ->
    (e) ->
      if e.target.className.indexOf('open') != -1
        cardElement = '<img src="#{card}" width="260px" style="margin: 0px -10px -11px -10px">'
        arbiter.publish("messages/send", {text: cardElement, author: localStorage.displayName})
        closeCards(e)
      else
        openCards()
      e.stopPropagation()

  if not localStorage.cardsEnabled?
    localStorage.cardsEnabled = true

  if localStorage.cardsEnabled
    $('#cards-enabled').prop("checked", true)
    $('.memeCard').show()
  else
    $('#cards-enabled').prop("checked", false)
    $('.memeCard').hide()

  $('#cards-enabled').click(() ->
    if this.checked
      localStorage.cardsEnabled = true
      $('.memeCard').show()
    else
      localStorage.cardsEnabled = false
      $('.memeCard').hide()
  )

  render = ->
    cardList = $('#card-list')
    $('body').click(closeCards)
    m.render cardList.get(0),
      for card in cards
        m "img.memeCard", {src: card, onclick: clickCard(card)}
