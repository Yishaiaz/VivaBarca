angular
  .module("mainApp")
  .controller("SinglePOICtrl", function($scope, $http, $routeParams) {
    $scope.POIid = $routeParams.id;
    $http({
      method: "GET",
      url: "http://localhost:3000/else/getPOIbyID/" + $scope.POIid
    }).then(
      function mySuccess(response) {
        $scope.POIData = response.data["POI"];
        console.log($scope.POIData);
      },
      function myError(response) {
        $scope.allPoisData = response.statusText;
        console.log(response);
      }
    );
    $scope.submit = function() {
      alert("Thank you for the review!");
      $scope.reviewData = {
        poiID: $scope.POIid,
        description: $scope.newReviewDescription,
        ranking: $scope.newRankingValue
      };
      $("#writeReviewModal").modal("hide");
      console.log($scope.reviewData);
      //   todo: send review to server by token.
      //
      $scope.newReviewDescription = "";
    };
    $scope.addToFavourites = function() {
      console.log("adding to favourites");
      // todo: get poiID from scope and send to server by token.
    };
  });
