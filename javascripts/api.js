function appendResults(text) {
  var results = document.getElementById('results');
  results.appendChild(document.createElement('P'));
  results.appendChild(document.createTextNode(text));
}

function makeRequest() {
  var request = gapi.client.urlshortener.url.get({
    'shortUrl': 'http://goo.gl/fbsS'
  });
  request.execute(function(response) {
    appendResults(response.longUrl);
  });
}

function load() {
  gapi.client.setApiKey('AIzaSyCqCWh7YGfoxyhLp2WE1uKMq6iiJ-eKl84');
  gapi.client.load('urlshortener', 'v1', makeRequest);
}

