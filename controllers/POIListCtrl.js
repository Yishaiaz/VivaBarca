angular
  .module("mainApp")
  .controller("POIListCtrl", function($scope, $http, $window) {
    //USER TOKEN//
    $scope.isLoggedIn = false;
    $scope.userData = localStorage.getItem("userData");
    if ($scope.userData && $scope.userData != {}) {
    }

    $scope.bySearchFilter = false;
    $scope.POIsAfterFiltering = $scope.allPoisData;
    $scope.POIsByCategory = {};
    //  GETTING ALL POI DATA
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
    // GETTING ALL THE CATEGORIES
    $http({
      method: "GET",
      url: "http://localhost:3000/Authentication/ParametersForRegistration"
    }).then(
      function mySuccess(response) {
        $scope.categoriesList = response.data["categories"];
        // GETTING FOR EACH CATEGORY ALL IT'S POIS
        for (let i = 0; i < $scope.categoriesList.length; i++) {
          $scope.currentCat = {
            category: $scope.categoriesList[i]["categoryName"] //$scope.categoriesList[i]["categoryName"]
          };
          // GET ALL POIS BY CATEGORY
          $scope.currentCat = JSON.stringify($scope.currentCat);
          var req = {
            method: "POST",
            url: "http://localhost:3000/else/getAllPOIsByCategory",
            headers: {
              "Content-Type": "application/json"
            },
            data: $scope.currentCat
          };
          $http(req).then(
            function mySuccess(response) {
              let categoryEntry = {
                categoryName: $scope.categoriesList[i]["categoryName"],
                categoryData: response.data["POIs"]
              };
              $scope.POIsByCategory[i] = categoryEntry;
            },
            function myError(response) {
              console.log(response);
            }
          );
        }
      },
      function myError(response) {
        $scope.allPoisData = response.statusText;
        console.log(response);
      }
    );

    // SEARCH FUNCTION INTIATED, FILTER BY TEXT CONTAINED IN THE NAME OF THE POI
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
    // A POI IMAGE WAS CLICKED, REDIRECTED TO SINGLE POI PAGE
    $scope.POIClicked = function(event) {
      $window.location.href = "#!/SinglePOI/" + event.currentTarget.id;
    };
    //ADD TO FAVOURITE BUTTON CLICKED
    $scope.addToFavourites = function(event) {
      var allFavouriteButtons = document.getElementsByClassName(
        "isUserFavouriteIcon"
      );
      for (let i = 0; i < allFavouriteButtons.length; i++) {
        if (allFavouriteButtons[i].id === event.currentTarget.id) {
          if (
            allFavouriteButtons[i].childNodes[0].className === "fa fa-star-o"
          ) {
            allFavouriteButtons[i].childNodes[0].className = "fa fa-star";
          } else {
            allFavouriteButtons[i].childNodes[0].className = "fa fa-star-o";
          }
        }
      }
      // todo: add the http method to add to user favourite.
    };
  });
