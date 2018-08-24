export function timeoutAsync(timeout) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
  })
}

export async function race(...promises) {
  const result = await Promise.race(promises.map((promise, index) => promise.then(() =>  index)))
  return { promise: promises[result], index: result }
}

export async function waitOrTimeout(promise, timeout) {

  const timeoutPromise = timeoutAsync(timeout)
  const result = await race(promise, timeoutPromise)

  if (result.index === 0) {
    return await result.promise
  }

  return null
}

export class ResolvablePromise {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  resolve(args) {
    this._resolve(args)
  }

  reject(args) {
    this._reject(args)
  }
}
