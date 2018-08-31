import $ from 'jquery'
import Environment from './environment'

class AccountApi {
  constructor(options) {
    this._token = options.token;
    this._environment = new Environment(options);
  }

  _headers() {
    return {
      Authorization: `Bearer ${this._token}`,
      "Content-Type": "application/json"
    };
  }

  async presets() {
    return await $.ajax({
      url: this._environment.Url.PRESETS,
      method: "GET",
      headers: this._headers()
    });
  }
}

export default AccountApi;
