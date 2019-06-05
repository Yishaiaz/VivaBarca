angular.module("mainApp").controller("POIListCtrl", function($scope, $http) {
  $http({
    method: "GET",
    url: "http://localhost:3000/else/getAllPOIs"
  }).then(
    function mySuccess(response) {
      $scope.allPoisData = response.data["POIs"];
      $scope.POIS = $scope.allPoisData;
      console.log($scope.POIS);
    },
    function myError(response) {
      $scope.allPoisData = response.statusText;
      console.log(response);
    }
  );
});
function POIClicked(poiDiv) {
  console.log(poiDiv.id);
}
