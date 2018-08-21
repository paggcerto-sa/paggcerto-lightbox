
export default class LightboxRouter {

  constructor() {
    this.routes = []
  }

  async _renderRoute(form, $container, options) {
    await new form($container, options).render(this._encapsulate())
  }

  _goTo(form, $container, options) {
    this.routes.push({ form, $container, options })
  }

  _encapsulate() {
    return {
      render: (form, $container, options) => {
        return this._goTo(form, $container, options)
      }
    }
  }

  async render(form, $container, options) {

    this._goTo(form, $container, options)

    while(this.routes.length > 0) {
      const route = this.routes.splice(0, 1)[0]
      await this._renderRoute(route.form, route.$container, route.options)
    }
  }
}
