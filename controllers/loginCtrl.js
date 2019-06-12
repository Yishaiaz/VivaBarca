angular
  .module("mainApp")
  .controller("loginCtrl", function($scope, $http, $window) {
    $scope.submit = function() {
      $scope.credentials = {
        username: $scope.username,
        password: $scope.password
      };
      var req = {
        method: "POST",
        url: "http://localhost:3000/Authentication/Login",
        headers: {
          "Content-Type": "application/json"
        },
        data: $scope.credentials
      };
      $http(req).then(
        function success(response) {
          var userData = JSON.stringify({
            token: response.data["token"],
            username: $scope.username
          });
          // console.log(userData);
          localStorage.setItem("userData", userData);
          // GETTING THE USER'S FAVOURITE POIs IF EXISTS AND PUTTING IT TOO IN THE LCL STORAGE
          var req = {
            method: "POST",
            url: "http://localhost:3000/Analysis/getFavoritePOIs",
            headers: {
              "x-auth-token": response.data["token"]
            }
          };
          $scope.initialResponse = response;
          $http(req).then(
            function mySuccess(response) {
              $scope.userFavouritePOIsID = [];
              for (let j = 0; j < response.data["response"].length; j++) {
                $scope.userFavouritePOIsID.push({
                  poiID: response.data["response"][j]["poiID"]
                });
              }
              localStorage.setItem(
                "usersFavouritePOIs",
                JSON.stringify($scope.userFavouritePOIsID)
              );
              $window.location.href = "/index.html";
              // console.log(response.data["token"]);
            },
            function myError(response) {
              console.log(response);
              $window.location.href = "/index.html";
            }
          );
        },
        function myError(response) {
          console.log(response);
          alert("Wrong username or password");
        }
      );
    };
  });
