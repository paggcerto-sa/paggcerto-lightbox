import { ResolvablePromise } from "./async";

export default class LightboxRouter {

  constructor() {
    this._routes = []
    this._wakeUpPromise = null
  }

  async _renderRoute(route) {
    await new route.form(...route.args).render(this._encapsulate())
  }

  async _renderCurrentRoute() {
    await this._renderRoute(this._getCurrentRoute())
  }

  exit() {
    this._routes = []
    this._signalToWakeUp()
  }

  _goTo(form, args) {
    console.log('Scheduling:', form !== null, args)
    this._routes.push({ form, args })
    this._signalToWakeUp()
  }

  _encapsulate() {
    return {
      render: (form, ...args) => {
        return this._goTo(form, args)
      }
    }
  }

  _renewWakeUp() {
    this._wakeUpPromise = new ResolvablePromise()
  }

  async _waitWakeUpSignal() {
    await this._wakeUpPromise.promise
  }

  _signalToWakeUp() {
    if (this._wakeUpPromise === null) return

    this._wakeUpPromise.resolve()
  }

  _getCurrentRoute() {
    if (this._routes === null || this._routes.length === 0) {
      return null
    }

    return this._routes[this._routes.length - 1]
  }

  async render(form, ...args) {
    this._goTo(form, args)

    while(this._getCurrentRoute() !== null) {
      this._renewWakeUp()
      await this._renderCurrentRoute()
      await this._waitWakeUpSignal()
    }
  }
}
