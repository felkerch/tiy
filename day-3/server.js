// called server.js because:    running npm start  opens package.json and
//  looks at scripts['start']. then it looks for server.js

const Promise = require('bluebird'),
  fs = require('fs'),
  TicTacToeGame = require('./src/tic-tac-toe-game'),
  DB = require('./src/db'),
  readdir = Promise.promisify(fs.readdir),
  readFile = Promise.promisify(fs.readFile),
  express = require('express'),
  bodyparser = require('body-parser'),
  nunjucks = require('nunjucks');

let app = express(),
 db = DB.initDB();

// tell the app that this is our templating engine and
//  that the templates live in templates/
nunjucks.configure('templates', {
  autoescape: true,
  express: app,
  watch: true,
  autoescape: true
})

// o_O
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended: true
}))

app.use(function (req, res, next) {
  console.info('a request flew by!!!!!!!!!!!!!!!!!!!!!!!!!!\n', req.path)
  next(); // go to the next middlware
  //next(err); // go to the error middleware
  // BEWARE:
  // next('router'); // somethign completely magical!
  // next('view'); // ??!?!!

  // if you don't call next, we'll hang because the client won't receive a response
})

app.use(function (req, res, next) {
  // we use a form to delete, so actually set the method to delete
  if (req.body['X-HTTP-METHOD'] === 'delete') {
    req.method = 'DELETE';
    console.log('set request method to delete...')
  }
  next();
})

// length of two means the callback renders a normal request
app.get('/', function(request, response) {
  // usually shortened to (req, res). but be careful with prmoises (res rej)
  response.render('index.html', {
    games: db.getAllGames(),
    numberGames: db.size()
  });
})

// create a new game
app.post('/', function (req, res) {
  let game = new TicTacToeGame();
  let newIndex = db.add(game);
  res.redirect(`/${newIndex}`)
})

app.get('/:gameIndex', function(req, res) {
// console.log('request index: ', req.params.gameIndex)
  let maybeIndex = req.params.gameIndex;

  if (maybeIndex === 'kindly_shutdown') {
    console.log('in kindly_shudown!')
    db.save()
      .catch(e => {
        console.error('problem saving our data! ', e)
        // console.log(db._thisGames.map(game => game))
      })
      .then(new Error('daf'));
    res.redirect('/'); // ?!
  }

  if (!Number.isInteger(Number.parseInt(maybeIndex)) || maybeIndex > db._listGames.length || maybeIndex < 0) {
    return res.redirect('/')
  }

  let index = maybeIndex,
    game = db.get(index);

  if (!game) {
    res.redirect('/')
  }

  res.render('game.html', {
    index: req.params.gameIndex,
    game: game,
    over: game.isOver()
  })
})

app.post('/:gameIndex', function(req, res) {
  let body = JSON.stringify(req.body),
   gameIndex = Number.parseInt(req.params.gameIndex)
   row = req.body.row,
   col = req.body.col,
   game = db.get(gameIndex);
  game.play(row - 0, col - 0);
  res.redirect(`/${gameIndex}`)
})

app.delete('/:gameIndex', (req, res) => {
  // fixme delete doesn't work yet? :(
  let index = req.params.gameIndex;
  console.log('in delete! ', index)
  db.remove(index)
  res.redirect('/')
})

let startApp = function() {
  readdir('./sandwich/')
   .then(fileNames => {
     let filePromises = fileNames.map(name => readFile('./sandwich/' + name, 'utf8'));
     return Promise.all(filePromises).then(files => {
       return {
        fileNames: fileNames,
        files: files
      }
     })
   })
   .then(payload => {
     let listManagedGames = payload.files.map(file => TicTacToeGame.fromJson(file));
     db = new DB(payload.fileNames, listManagedGames)
     let port = process.env.PORT || 8080;
     app.listen(port, () => console.log('listening on port 8080!'))
        // callback fires on "app.ready()"
    })
   .catch(e => console.error(e))
};
startApp();



/*
can't do:

```
let listManagedGames = run()
console.log(listManagedGames)
```

because listManagedGames is undefined until the final then completes.
*/
