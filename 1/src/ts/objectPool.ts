
export default class ObjectPool {
  private pool: any[] = [];
  private proto: any;

  static copy(source: any, dest: any) {
    for (let id in source) {
      if (typeof source[id] == "object") {
        if (!dest[id]) {
          dest[id] = {} as any;
        }
        this.copy(source[id], dest[id]);
      } else {
        dest[id] = this.clone(source[id]);
      }
    }
  }

  static clone(el: any): any {
    if (typeof el == "object") {
      let newEl: any = {} as any;
      this.copy(el, newEl);
      return newEl;
    } else if (Array.isArray(el)) {
      let returnArray: any[] = [];
      for (let child of el as any[]) {
        returnArray.push(this.clone(child));
      }
      return returnArray;
    } else {
      return el;
    }
  }

  constructor(proto: any) {
    this.proto = proto;
  }

  public New(): any {
    if (this.pool.length != 0) {
      return this.pool.pop();
    } else {
      return ObjectPool.clone(this.proto);
    }
  }

  public Free(obj: any) {
    ObjectPool.copy(this.proto, obj);
    this.pool.push(obj);
  }
}
