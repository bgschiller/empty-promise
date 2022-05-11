export interface EmptyPromise<T = any> extends Promise<T> {
  resolve(t?: T): Promise<T>;
  reject(e: any): Promise<T>;
  done(): boolean;
}

export default function emptyPromise<T = any>(): EmptyPromise<T> {
  let callbacks: any;
  let done = false;

  const p = new Promise<T>((resolve, reject) => {
    callbacks = { resolve, reject };
  });

  // @ts-ignore
  p.done = () => done;
  // @ts-ignore
  p.resolve = val => {
    callbacks.resolve(val);
    done = true;
    return p;
  };
  // @ts-ignore
  p.reject = val => {
    callbacks.reject(val);
    done = true;
    return p;
  };

  return p as EmptyPromise<T>;
}
