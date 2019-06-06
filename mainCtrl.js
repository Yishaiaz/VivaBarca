var mainApp = angular.module("mainApp", ["ngRoute"]);
mainApp.config(function($routeProvider) {
  $routeProvider.when("/", {
    templateUrl: "pages/home.html",
    controller: "mainCtrl",
    controllerAs: "ctrl"
  });
  $routeProvider.when("/login", {
    templateUrl: "pages/login.html",
    controller: "loginCtrl",
    controllerAs: "ctrl"
  });
  $routeProvider.when("/register", {
    templateUrl: "pages/register.html",
    controller: "registerCtrl",
    controllerAs: "ctrl"
  });
  $routeProvider.when("/userProfile", {
    templateUrl: "pages/userProfile.html",
    controller: "userProfileCtrl",
    controllerAs: "ctrl"
  });
  $routeProvider.when("/POIS", {
    templateUrl: "pages/POIList.html",
    controller: "POIListCtrl",
    controllerAs: "ctrl"
  });
  $routeProvider.when("/SinglePOI/:id", {
    templateUrl: "pages/singlePOI.html",
    controller: "SinglePOICtrl",
    controllerAs: "ctrl"
  });
});
mainApp.controller("mainCtrl", function($scope) {
  var userData = localStorage.getItem("userData");
  if (userData) {
    console.log(userData);
  } else {
    console.log("no user");
  }
});
