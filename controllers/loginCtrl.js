angular.module("mainApp").controller("loginCtrl", function($scope, $http) {
  $scope.testVar = "not Changed";
  $scope.submit = function() {
    $scope.testVar = $scope.username + "," + $scope.password;
  };
});
