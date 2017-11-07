declare module Linkify {
  interface LinkifyOptions {
    format?: (value: string, typeOfString: string) => string;
  }

  interface LinkifyHTMLInstance {
    (text: string, options?: LinkifyOptions): string;
  }

  interface LinkifyInstance {
    find(text: string): {type: string, value: string, href: string}[];
  }
}


declare module "linkifyjs" {
  var instance: Linkify.LinkifyInstance;

  export default instance;
}

declare module "linkifyjs/html" {
  var instance: Linkify.LinkifyHTMLInstance;

  export default instance;
}


