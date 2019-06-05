angular.module("mainApp").controller("registerCtrl", function($scope) {
  $scope.testVar = "not Changed";
  $scope.submit = function() {
    $scope.testVar =
      $scope.username + "," + $scope.password + "," + $scope.city;
  };
});
