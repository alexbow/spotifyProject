var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var request = require('request'); // "Request" library
var SpotifyWebApi = require('spotify-web-api-node');

// var client_id = '254640d2091f4efdadb1bb21313edd64'; // Your client id
// var client_secret = 'c53367b395764dfd90b1da7f9598b38d'; // Your client secret
// var redirect_uri = 'http://localhost:8000/callback'; // Your redirect uri

var spotifyApi = new SpotifyWebApi({
  clientId : '254640d2091f4efdadb1bb21313edd64',
  clientSecret : 'c53367b395764dfd90b1da7f9598b38d',
  redirectUri : 'http://localhost:8000/callback'
});
/* GET home page. */
router.get('/', function(req, res, next) {  
  res.render('index', { title: 'Express' });
});

router.get('/start', function(req, res, next) {
    console.log("We got here");
  res.render('start', { title: 'Communify' });
});


var stateKey = 'spotify_auth_state';
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get('/login', function(req, res) {
    console.log("I got here");
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: spotifyApi.clientId,
      scope: scope,
      redirect_uri: spotifyApi.redirectUri,
      state: state
    }));
});



router.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(spotifyApi.clientId + ':' + spotifyApi.clientSecret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });




        // we can also pass the token to the browser to make requests from there
        // res.redirect('/#' +
        //   querystring.stringify({
        //       // REDIRECT HERE
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));
        console.log("redirecting");
        res.redirect('/start');
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

router.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(spotifyApi.clientId + ':' + spotifyApi.clientSecret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

// var authOptions1 = {
//     url: 'https://api.spotify.com//v1/browse/categories/pop/playlists',
//     dataType:'json',
//     headers: {
//         'Authorization': "Bearer BQDhexjNrYowX25xFI96zN917tTXcEHb1mEXw7640012iqM-v95-vPMWqW8BDdlWpy4_JVorIefZGuzpjnPxK9-V7wlawyviXGAu46IUuPH1AOQoHco9IEE-7esDMPfyHLyXHCST-UV0Wz6zDRlP4UWXLjeh6Ukv-nEX87W87GbttEk2r9dejmyLyjiQvUgTtRGPnICnbeo3wjlnmWU14iB8Xbqw8PWhNTmiqhHBSn1S",
//         'Content-Type': 'application/json',
//     }
// };

// request.get(authOptions1, function(error, response, body) {
//     console.log(body);
//     console.log("POST REQUEST");
// });

spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', { limit: 10, offset: 20 }, function(err, data) {
  if (err) {
    console.error('Something went wrong!');
  } else {
    console.log(data.body);
  }
});



module.exports = router;
