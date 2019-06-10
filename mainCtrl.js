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
  $routeProvider.when("/userFavouritePOIs", {
    templateUrl: "pages/userFavouritePOIs.html",
    controller: "userFavouritesCtrl",
    controllerAs: "ctrl"
  });
});
mainApp.controller("mainCtrl", function($scope, $http, $window) {
  // helper functions
  $scope.goToPoiPage = function(event) {
    let poiId = event.currentTarget.id;
    $window.location.href = "#!/SinglePOI/" + poiId;
  };

  // initializing variables
  $scope.isLoggedIn = false;
  $scope.userData = localStorage.getItem("userData");
  $scope.poisToShowToNewUser = {};
  $scope.twoPopularPOIS = {};
  $scope.poisToShowToUser = {};

  // checks user token data exist on local storage
  if ($scope.userData && $scope.userData != {}) {
    $scope.userData = JSON.parse($scope.userData);
    document.getElementById("navUsername").innerText =
      $scope.userData["username"];
    $scope.isLoggedIn = true;
    // twoPopularPOIS
    // getting two random pois in two different categories to a logged user
    $http({
      method: "POST",
      url: "http://localhost:3000/Analysis/getTwoPOIsByCategories",
      headers: { "x-auth-token": $scope.userData["token"] }
    }).then(
      function mySuccess(response) {
        $scope.POIData = response.data["POIs"];
        $scope.twoPopularPOIS = $scope.POIData;
      },
      function myError(response) {
        // $scope.twoPopularPOIS = response.statusText;
        console.log(response);
      }
    );
    // poisToShowToUser
    // getting two favourite pois in two different categories to a logged user, if don't exist, changes a scope flag
    $http({
      method: "POST",
      url: "http://localhost:3000/Analysis/getFavoritePOIs",
      headers: { "x-auth-token": $scope.userData["token"] }
    }).then(
      function mySuccess(response) {
        $scope.POIData = response.data["response"];
        for (let i = 0; i < $scope.POIData.length; i++) {
          console.log($scope.POIData[i]["username"]);
          // todo: change api call to the right one and extract data.
        }
      },
      function myError(response) {
        console.log("failed");
      }
    );
  } else {
    document.getElementById("navUsername").innerText = "New User";
    $scope.isLoggedIn = false;
    // Getting 3 random points with the minimal rank of 3.5 to present to not logged user.
    $http({
      method: "GET",
      url: "http://localhost:3000/else/getRandomPOI/3/3.5"
    }).then(
      function mySuccess(response) {
        $scope.POIData = response.data["POIs"];
        $scope.poisToShowToNewUser = $scope.POIData;
      },
      function myError(response) {
        console.log(response);
      }
    );
  }
});
function logoutUser() {
  localStorage.setItem("userData", {});
  location.reload();
}
