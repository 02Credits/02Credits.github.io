declare module "pouchdb-collate" {
  export function toIndexableString(props: any): string;
  export function parseIndexableString(str: string): any[];
  export function collate(a: any, b: any): number;
}
