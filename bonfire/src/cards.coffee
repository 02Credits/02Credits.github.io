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
        arbiter.publish("messages/send", {text: card, author: localStorage.displayName})
        closeCards(e)
      else
        openCards()
      e.stopPropagation()

  render = ->
    cardList = $('#card-list')
    $('body').click(closeCards)
    m.render cardList.get(0),
      for card in cards
        m "img.memeCard", {src: card, onclick: clickCard(card)}
