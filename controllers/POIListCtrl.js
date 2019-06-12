angular
  .module("mainApp")
  .controller("POIListCtrl", function($scope, $http, $window) {
    //USER TOKEN//
    $scope.isLoggedIn = false;

    // USER IS LOGGED IN
    if ($scope.userData && $scope.userData != {}) {
      $scope.userData = JSON.parse(localStorage.getItem("userData"));
      $scope.isLoggedIn = true;
      // GET USER FAVOURITE POI
      var req = {
        method: "POST",
        url: "http://localhost:3000/Analysis/getFavoritePOIs",
        headers: {
          "x-auth-token": $scope.userData["token"]
        }
      };
      $http(req).then(
        function mySuccess(response) {
          $scope.userFavouritePOIsID = [];
          for (let j = 0; j < response.data["response"].length; j++) {
            $scope.userFavouritePOIsID.push(
              response.data["response"][j]["poiID"]
            );
          }
        },
        function myError(response) {
          console.log(response);
        }
      );

      // USER ISN'T LOGGED IN
    } else {
      $scope.isLoggedIn = false;
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
        $scope.allPoisData = $scope.POIsByCategory;
      },
      function myError(response) {
        $scope.allPoisData = response.statusText;
        console.log(response);
      }
    );

    // SEARCH FUNCTION INTIATED, FILTER BY TEXT CONTAINED IN THE NAME OF THE POI
    //todo fit to new by category presentation
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
      let idToAddToFavourites;
      let toRemove = false;
      for (let i = 0; i < allFavouriteButtons.length; i++) {
        if (allFavouriteButtons[i].id === event.currentTarget.id) {
          if (
            allFavouriteButtons[i].childNodes[0].className === "fa fa-star-o"
          ) {
            allFavouriteButtons[i].childNodes[0].className = "fa fa-star";
            idToAddToFavourites = allFavouriteButtons[i].id;
          } else {
            allFavouriteButtons[i].childNodes[0].className = "fa fa-star-o";
            idToAddToFavourites = allFavouriteButtons[i].id;
            toRemove = true;
          }
        }
      }

      // SAVING TO LOCAL STORAGE
      var POIsToAddToLCL;
      let exists = false;
      try {
        POIsToAddToLCL = JSON.parse(localStorage.getItem("usersFavouritePOIs"));
        if (POIsToAddToLCL == null) {
          POIsToAddToLCL = [];
        }
        exists = true;
      } catch {
        exists = false;
      }
      if (!exists) {
        POIsToAddToLCL = [
          {
            poiID: idToAddToFavourites
          }
        ];
      } else {
        if (!toRemove) {
          // checks if already exists before pushing it
          let toAdd = true;
          for (let k = 0; k < POIsToAddToLCL.length; k++) {
            if (POIsToAddToLCL[k]["poiID"] == idToAddToFavourites) {
              toAdd = false;
            }
          }
          if (toAdd) {
            POIsToAddToLCL.push({
              poiID: parseInt(idToAddToFavourites)
            });
          }
        } else {
          let index = -1;
          for (let k = 0; k < POIsToAddToLCL.length; k++) {
            if (POIsToAddToLCL[k]["poiID"] == idToAddToFavourites) {
              index = k;
            }
          }
          if (index > -1) {
            POIsToAddToLCL.splice(index, 1);
          }
        }
      }
      localStorage.setItem(
        "usersFavouritePOIs",
        JSON.stringify(POIsToAddToLCL)
      );
    };
  });
