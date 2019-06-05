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
});
mainApp.controller("mainCtrl", function($scope) {
  $scope.name = "testing name";
});
