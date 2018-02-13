"use strict"

angular.module("steamApp", ["ngRoute"]).config(
  $routeProvider.when("/?/auth/openid/", {
    templateUrl: "partial/navbar.html",
    controller: "navCtrl"
  })
);