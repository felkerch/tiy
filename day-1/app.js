
class Button {
  constructor() {
    this._button = document.createElement('button');
  }

  set text(value) {
    this._button.innerHTML = value;
  }

  get text() {
    return this._button.innherHTML;
  }

  render() {
    return this._button;
  }
}

// var button = new Button();
// document.body.appendChild(button.render());
//
// button.text = 'This button is not null'


new Ajax("http://ip.jsontest.com")
  .then(x => console.log(x.ip))
  .then(u => console.log('undefined?', u))
  .catch(e => {
    console.error(e);
    return "I give up!";
  })
  .catch(x => alert(x))
  .get();

//
// function Button() {
//   this._button = document.createElement('button');
// }
//
// Button.prototype.render = function() {
//   //
// }

console.log("ran app.js");
