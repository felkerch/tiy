class Button {
  constructor() {
    this._button = document.createElement('button');
  }

  get text() {
    return this._button.innerHTML;
  }

  set text(value) {
    this._button.innerHTML = value;
  }

  render() {
    return this._button;
  }

  on(name, callback) {
    this._button.addEventListener(name, function () {
      callback.call(this);
    });
  }
}
