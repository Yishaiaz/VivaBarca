angular
  .module("mainApp")
  .controller("loginCtrl", function($scope, $http, $window) {
    $scope.testVar = "not Changed";
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
          localStorage.setItem(
            "userData",
            JSON.stringify({
              token: response.data["token"],
              username: $scope.username
            })
          );
          $window.location.href = "/index.html";
        },
        function failure(response) {
          console.log(response);
        }
      );
    };
  });
