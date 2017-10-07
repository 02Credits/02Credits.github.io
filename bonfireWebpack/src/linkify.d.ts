declare module linkify {
  interface LinkifyOptions {
    format?: (value: string, typeOfString: string) => string;
  }

  interface LinkifyInstance {
    (text: string, options?: LinkifyOptions): string;
    find(text: string): {type: string, value: string, href: string}[];
  }
}

declare module "linkifyjs" {
  var instance: linkify.LinkifyInstance;

  export default instance;
}


