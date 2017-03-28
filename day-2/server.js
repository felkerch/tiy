const Promise = require('bluebird'),
  fs = require('fs'),
  TicTacToeGame = require('./tic-tac-toe-game'),
  readdir = Promise.promisify(fs.readdir),
  readFile = Promise.promisify(fs.readFile);

let listManagedGames = [];
let run = function() {
  readdir('./sandwich/')
   .then(listFileNames => {
     let listFilesToRead = [];
     listFileNames.forEach((name) => {
       listFilesToRead.push(readFile('./sandwich/' + name, 'utf8'));
     })
     return listFilesToRead;
   })
   .then(Promise.all)
   .then(listFiles => {
     listFiles.forEach((file) => {
      listManagedGames.push(TicTacToeGame.fromJson(file))
      })
      console.log(listManagedGames)
    })
   .catch(e => console.error(e))
};
run();


/*
can't do:

```
let listManagedGames = run()
console.log(listManagedGames)
```

because listManagedGames is undefined until the final then completes.
*/
