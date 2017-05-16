function clone<T>(el: T): T {
  if (typeof el == "object") {
    let newEl: any = {} as any;
    copy(el, newEl);
    return newEl;
  } else if (Array.isArray(el)) {
    let returnArray: any[] = [];
    for (let child of el as any[]) {
      returnArray.push(clone(child));
    }
    return returnArray as any as T;
  } else {
    return el;
  }
}

function copy<T>(source: T, dest: T) {
  for (let id in source) {
    if (typeof source[id] == "object") {
      if (!dest[id]) {
        dest[id] = {} as any;
      }
      copy(source[id], dest[id]);
    } else {
      dest[id] = clone(source[id]);
    }
  }
}

export class ObjectPool<T> {
  private pool: T[] = [];
  private proto: T;

  constructor(proto: T) {
    this.proto = proto;
  }

  public New(): T {
    if (this.pool.length != 0) {
      return this.pool.pop();
    } else {
      return clone(this.proto);
    }
  }

  public Free(obj: T) {
    copy(this.proto, obj);
    this.pool.push(obj);
  }
}
