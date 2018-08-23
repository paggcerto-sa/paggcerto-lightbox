export function timeoutAsync(timeout) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
  })
}

export async function waitOrTimeout(promise, timeout) {

  const result = await Promise.race([
    promise.then(() => 1),
    timeoutAsync(timeout).then(() => 2)
  ])

  if (result === 1) {
    return await promise
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
