const fs = require('fs'),
 Promise = require('bluebird'),
 writeFile = Promise.promisify(fs.writeFile),
 rmFile = Promise.promisify(fs.unlink);

let mkdir = function (path) {
  return new Promise((good, bad) => {
    fs.mkdir(path, err => {
      if (err && err.code !== 'EEXIST') {
        return bad(err);
      }
      good();
    })
  });
}

class DB {

  static initDB() {
    return new DB([], [])
  }

  constructor(listFileNames, listGames) {
    this._listFileNames = listFileNames;
    this._listGames = listGames;
  }

  size() {
    return this._listFileNames.filter(name => name !== null).length
  }

  _getNewFileName() {
    return `${new Date().getTime()}.json`
  }

  add(newGame) {
    this._listFileNames.push(this._getNewFileName());
    this._listGames.push(newGame);
    return newGame;
  }

  remove(index) {
    if (this._listFileNames[index]) {
      let oldFileName = this._listFileNames[index];
      this._listFileNames[index] = null;
      this._listGames[index] = null;
      rmFile(`./sandwich/${oldFileName}`)
       .then(console.log(`rmed ${oldFileName}`))
    }
  }

  get(index) {
    return this._listGames[index];
  }

  getAllGames() {
    return this._listGames.slice(0);
  }

  save() {
    const path = './sandwich/';
    let nonNullGames = this._listGames.filter(name => name !== null),
     nonNullFileNames = this._listFileNames.filter(name => name !== null),
     listSerializedGames = nonNullGames.map(game => game.toJson()),
     listObjects = listSerializedGames.map((game, i) => {
      return {
          fileName: nonNullFileNames[i],
          data: game
        };
    });
    return mkdir(path)
      .then(() => {
        return listObjects.map(obj => {
          return writeFile(`${path}${obj.fileName}`, obj.data)
        })
      })
      .then(Promise.all)
      .then(console.log("done!"))
  }

}

module.exports = DB;
