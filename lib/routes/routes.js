const express = require("express");
const session = require("express-session");
const FirebaseStore = require("connect-session-firebase")(session);
const firebase = require("firebase-admin");
const ref = firebase.initializeApp({
  credential: firebase.credential.cert("./node/serviceAccountSettings.json"),
  databaseURL: "https://steamdata-9a8ab.firebaseio.com"
});
var app = express();
var steamUserID;
// ***********STEAM AUTH BEGINS**************
var steamAuth = app => {
  app.use(
    session({
      store: new FirebaseStore({
        database: ref.database()
      }),
      secret: "big boy",
      resave: true,
      saveUninitialized: true
    })
  );

  var OpenIDStrategy = require("passport-openid").Strategy;
  var SteamStrategy = new OpenIDStrategy(
    {
      // OpenID provider configuration
      providerURL: "http://steamcommunity.com/openid",
      stateless: true,
      // How the OpenID provider should return the client to us
      returnURL: "http://localhost:4000/auth/openid/return",
      realm: "http://localhost:4000/"
    },
    function(identifier, done) {
      process.nextTick(function() {
        var user = {
          identifier: identifier,
          steamId: identifier.match(/\d+$/)[0]
        };
        return done(null, user);
      });
    }
  );

  var passport = require("passport");
  passport.use(SteamStrategy);

  passport.serializeUser(function(user, done) {
    done(null, user.identifier);
  });

  passport.deserializeUser(function(identifier, done) {
    done(null, {
      identifier: identifier,
      steamId: identifier.match(/\d+$/)[0]
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.post("/auth/openid", passport.authenticate("openid"));

  app.get("/auth/openid/return", passport.authenticate("openid"), function(
    request,
    response
  ) {
    if (request.user) {
      response.redirect("/");
    } else {
      response.redirect("/?failed");
    }
  });

  app.post("/auth/logout", function(request, response) {
    request.logout();
    response.redirect(request.get("Referer") || "/");
  });

  app.get("/", function(request, response) {
    response.write("<!DOCTYPE html>");
    if (request.user) {
      response.write(
        (request.session.passport &&
          console.log("SteamId: " + request.user.steamId)) ||
          ""
      );
      steamUserID = request.user.steamId;
      // **Kick off the API**
      appRouter(app);
      //********** */

      console.log("steamUserID: ", steamUserID);
      response.write('<form action="/auth/logout" method="post">');
      response.write('<input type="submit" value="Log Out"/></form>');
    } else {
      if (request.query.steamid) {
      }
      response.write('<form action="/auth/openid" method="post">');
      response.write(
        '<input name="submit" type="image" src="http://steamcommunity-a.' +
          'akamaihd.net/public/images/signinthroughsteam/sits_small.png" ' +
          'alt="Sign in through Steam"/></form>'
      );

      var signIn = () => {
        var signinButton = document.getElementById("steamButton");
      };
    }
    response.send();
  });
};
// **********STEAM AUTH ENDS**************

// ********SteamID API********
function appRouter(app) {
  app.get("/", function(req, res) {
    res.status(200).send();
  });

  app.get("/steamId", function(req, res) {
    var data = {
      signInID: steamUserID
    };
    res.status(200).send(data);
  });
}
// *********API ENDS******************

module.exports = steamAuth;
