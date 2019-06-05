angular.module("mainApp").controller("userProfileCtrl", function($scope) {
  $scope.userProfileImage = "static/images/userProfileImageDefault.png";
  $scope.userName = "testusername";
  $scope.userFavouritePOIS = ["testFav1", "testFav2", "testFav3"];
});
