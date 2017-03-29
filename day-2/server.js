const Promise = require('bluebird'),
  fs = require('fs'),
  TicTacToeGame = require('./tic-tac-toe-game'),
  readdir = Promise.promisify(fs.readdir),
  readFile = Promise.promisify(fs.readFile);

let listManagedGames = [];
let run = function() {
  readdir('./sandwich/')
   .then(listFileNames => {
     return listFileNames.map(name => readFile('./sandwich/' + name, 'utf8'));
   })
   .then(Promise.all)
   .then(listFiles => {
     let listManagedGames = listFiles.map(file => TicTacToeGame.fromJson(file));
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
