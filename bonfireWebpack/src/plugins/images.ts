import * as m from "mithril";
import * as $ from "jquery";
import { Plugin } from "../messageRenderer";

var imageRegex = /\.(?:jpg|gif|png|jpeg|bmp|JPG|GIF|PNG|JPEG|BMP)(?:\?[^=&]+=[^=&]+(?:&[^=&]+=[^=&]+)*)?$/
function imageConfig(element: HTMLElement, isInitialized: boolean) {
  if (!isInitialized) {
    $(element).materialbox();
  }
}
var imgurRegex = /https?:\/\/(i\.)?imgur\.com\/(gallery\/)?(.*?)(?:[#\/].*|$)/;
// var gfycatRegex = /(?:^https?:\/\/gfycat.com\/)/;
// function gfycatConfig(element: HTMLElement, isInitialized: boolean) {
//   if (!isInitialized) {
//     new gfyObject(element).init();
//   }
// }

var gifvRegex = /.(?:gifv|GIFV)$/;
var videoRegex = /.webm|.wmv|.mp4$/;
var youtubeRegex = /(?:(?:https?:\/\/www\.youtube\.com\/watch\?v=)|(?:^https?:\/\/youtu.be\/))([^#\&\?]*)(?:\?t=(\d+h)?(\d+m)?(\d+s)?)?/;
var preventDrag = (event: any) => event.preventDefault();

var imagesPlugin: Plugin = {
  name: "images",
  parent: "container",
  position: "before",
  render: async (doc, renderChildren) => {
    var children = await renderChildren(doc);

    var images = [];
    for (var link of doc.links) {
      if (imageRegex.test(link.href)) {
        images.push(m("img.materialboxed", {config: imageConfig, src: `${link.href}`, ondragstart: preventDrag }));
      } else if (gifvRegex.test(link.href)) {
        link.href = link.href.substring(0, link.href.length - 4) + "mp4";
      } else if (imgurRegex.test(link.href)) {
        var match = link.href.match(imgurRegex);
        images.push(m("img.materialboxed", { config: imageConfig, src: `http://i.imgur.com/${match[3]}.jpg`, ondragstart: preventDrag}));
      }
      // if (gfycatRegex.test(link.href)) {
      //   var id = link.href.replace(gfycatRegex, '');
      //   images.push(m(`img.gfyitem#giphyId=${id}`, {config: gfycatConfig, "data-id": id, "data-controls": true, ondragstart: preventDrag}));
      // }
      if (videoRegex.test(link.href)) {
        images.push(m("video.responsive-video", {
          controls: true,
          loop: true,
          autoplay: true,
          muted: true,
          width: "100%",
          src: link.href
        }));
      }
      if (youtubeRegex.test(link.href)) {
        var match = link.href.match(youtubeRegex);
        var youtubeId = match[1];
        var start = "";
        var seconds = 0;
        if (2 in match) {
          seconds += parseInt(match[2]) * 60 * 60;
        }
        if (3 in match) {
          seconds += parseInt(match[3]) * 60;
        }
        if (4 in match) {
          seconds += parseInt(match[4])
        }
        if (seconds != 0) {
          start = "&start=" + seconds;
        }
        var youtubeElement = m(".video-container[no-controls]",
                               m("iframe", {
                                 width: "853",
                                 height: "480",
                                 src: `http://www.youtube.com/embed/${youtubeId}?rel=0;autohide=1${start}`,
                                 frameborder: "0",
                                 allowfullscreen: true
                               }));
        images.push(youtubeElement);
      }
    }

    return m(".card-image", {width: "80%"}, [
      images,
      children
    ]);
  }
}

export default imagesPlugin;
