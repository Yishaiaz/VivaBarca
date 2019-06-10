angular
  .module("mainApp")
  .controller("POIListCtrl", function($scope, $http, $window) {
    $scope.bySearchFilter = false;
    $scope.POIsAfterFiltering = $scope.allPoisData;
    $http({
      method: "GET",
      url: "http://localhost:3000/else/getAllPOIs"
    }).then(
      function mySuccess(response) {
        $scope.allPoisData = response.data["POIs"];
        $scope.POIS = $scope.allPoisData;
      },
      function myError(response) {
        $scope.allPoisData = response.statusText;
        console.log(response);
      }
    );

    // search function
    $scope.submitSearch = function() {
      var searchKeyWord = $scope.searchBox;
      $scope.POIsAfterFiltering = [];
      for (let i = 0; i < $scope.allPoisData.length; i++) {
        if (
          $scope.allPoisData[i]["name"]
            .toLowerCase()
            .includes(searchKeyWord.toLowerCase())
        ) {
          $scope.POIsAfterFiltering.push($scope.allPoisData[i]);
        }
      }
      $scope.bySearchFilter = true;
    };

    $scope.POIClicked = function(event) {
      $window.location.href = "#!/SinglePOI/" + event.currentTarget.id;
    };
  });
