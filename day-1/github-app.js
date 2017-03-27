const AUTH_TOKEN = "9f416ae726d490ec1af988533c3629fcfd796cb1"; // this won't work!

function getRandomIntAsStr(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  number = Math.floor(Math.random() * (max - min)) + min;
  if (number < 10) {
    return '0' + number;
  }
  return '' + number;
}
function getRandomDate() {
  var year = getRandomIntAsStr(2011, 2017);
  var month = getRandomIntAsStr(1, 12);
  var day = getRandomIntAsStr(1, 28);
  return year + '-' + month + '-' + day
}

function createResultsElem() {
  var results = document.createElement('div');
  results.id = "results";
  return results;
}

function pullGithub(searchText) {
  var endpoint = "https://api.github.com/search/repositories?access_token="
    + AUTH_TOKEN + "&q=";
  if (searchText) {
    endpoint += searchText;
  } else {
    endpoint += "created:>" + getRandomDate();
  }
  return new Ajax(endpoint)
    .then(result => {
      // parse
      // window.result = x;
      var listRepos = [];
      result.items.forEach(function (repo) {
        listRepos.push({
          name: repo.name,
          url: repo.html_url,
          avatar: repo.owner.avatar_url,
          description: repo.description // optional
        })
      })
      return listRepos;
    })
    .then(parsedData => {
      // render
      var newResultsElem = createResultsElem();
      newResultsElem.id = 'temporary';
      parsedData.forEach(function (repo) {
        var anchor = document.createElement('a');
        anchor.href = repo.url;
        newResultsElem.appendChild(anchor);

        var amazingImage = document.createElement('img');
        amazingImage.src = repo.avatar;
        anchor.appendChild(amazingImage)
      })
      var oldResultsElem = document.getElementById('results');
      document.body.replaceChild(newResultsElem, oldResultsElem);
      newResultsElem.id = 'results';
    })
    .catch(e => {
      console.error(e);
      var error = document.getElementById('error');
      if (!error) {
        error = document.createElement('div');
        error.id = 'error';
      }
      error.innerHTML = ":( Unable to fetch results from github: " + e.message;
      document.body.appendChild(error);
    })
   .get();
}

// o_O
var input = document.createElement('input');
input.type = "text";
input.id = "search";
document.body.appendChild(input);

var button = new Button();
button.text = 'Search Github!';
document.body.appendChild(button.render());
button.on('click', function() {
  var searchText = document.getElementById('search').value;
  if (searchText) {
    pullGithub(searchText);
  }
});

document.body.appendChild(createResultsElem());

pullGithub();
