import * as $ from "jquery";
import * as m from "mithril";
import * as messagesManager from "./messagesManager";

var cards = [
  "http://i.imgur.com/ircucO0.png",
  "http://i.imgur.com/1kFeLly.png",
  "http://i.imgur.com/aZ7GpiQ.png",
  "http://i.imgur.com/rOYS9Sm.png",
  "http://i.imgur.com/xmbl34o.jpg",
  "http://i.imgur.com/dVWdko8.jpg",
  "http://i.imgur.com/Dr9ekTi.gif",
  "http://i.imgur.com/DieNi7L.jpg",
  "http://i.imgur.com/a1epPuB.jpg",
  "http://i.imgur.com/4ER9a4v.jpg",
  "http://i.imgur.com/DIl4w3p.gif",
  "http://i.imgur.com/cPwAnaL.jpg",
  "http://i.imgur.com/doHAiPD.jpg",
  "http://i.imgur.com/FCKBSP0.jpg"
]

var focusedCard = null;
var spacing = 100;
var cardWidth = 168;
var cardHeight = 244;

function closeCards(e: any) {
  $('.memeCard').css({'right': ""})
  $('.memeCard').removeClass('open')
  $('.memeCard').removeClass('focusedCard')
  e.stopPropagation()
}

function openCards() {
  var usableWidth = window.innerWidth - cardWidth * 2;
  $('.memeCard').each((i: number) => {
    $(this).css({'right': ((usableWidth / cards.length) * i + cardWidth / 2).toString() + "px"})
    $(this).addClass('open')
  });
}

function clickCard(card: string) {
  (e: any) => {
    if (e.srcElement.classList.contains('open')) {
      if (e.srcElement.classList.contains('focusedCard')) {
        var cardElement = "<img class=\"materialboxed\" src='#{card}' width='260px' style='margin: 0px -10px -5px -10px'>";
        messagesManager.send({text: cardElement, author: localStorage.displayName});
        closeCards(e);
      } else {
        $('.focusedCard').removeClass('focusedCard');
        e.srcElement.classList.add("focusedCard");
      }
    } else {
      openCards();
      e.stopPropagation();
    }
  }
}

export function render() {
  var cardList = $('#card-list');
  $('body').click(closeCards);
  var renderedCards = [];
  for (var card in cards) {
    renderedCards.push(m("img.memeCard", {src: card, onclick: clickCard(card)}));
  }

  return m("#card-list", renderedCards);
}

render();
