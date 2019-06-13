angular
  .module("mainApp")
  .controller("userFavouritesCtrl", function($scope, $http, $window) {
    // console.log(localStorage);
    // CHECKS FOR USER DATA FROM LCL STORAGE, IF DOESN'T EXIST => todo: present no favourites yet
    try {
      userData = JSON.parse(localStorage.getItem("userData"));
      // console.log(localStorage.getItem("userData"));
    } catch {
      console.log("something went wrong");
    }
    if (userData && userData != {}) {
      $scope.isLoggedIn = true;
    } else {
      $scope.isLoggedIn = false;
      // $window.location.href = "#!/";
      //CHANGE HERE
    }

    // getting the users favourites' data from LCL storage
    var POIsFromLCL;
    $scope.FavouritePOIsExists = false;

    try {
      POIsFromLCL = JSON.parse(localStorage.getItem("usersFavouritePOIs"));
      if (POIsFromLCL.length > 0) {
        $scope.FavouritePOIsExists = true;
      }
    } catch {
      $scope.FavouritePOIsExists = false;
    }

    $scope.userFavPOIs = [];
    for (let j = 0; j < POIsFromLCL.length; j++) {
      var onePOIReq = {
        method: "GET",
        url: "http://localhost:3000/else/getPOIbyID/" + POIsFromLCL[j]["poiID"],
        headers: {
          "x-auth-token": $scope.userData["token"]
        }
      };
      $http(onePOIReq).then(
        function mySuccess(response) {
          $scope.userFavPOIs.push(response.data["POI"]);
        },
        function myError(response) {
          console.log(response);
        }
      );
    }

    // NG-CLICK FUNCTIONS:
    $scope.saveFavouritesToDB = function(event) {
      // console.log("here");
      $scope.poiIDsToDelete = [];
      // DELETE ALL EXISTING ONES:
      // getting the existing poi's id
      var req = {
        method: "POST",
        url: "http://localhost:3000/Analysis/getFavoritePOIs",
        headers: {
          "x-auth-token": $scope.userData["token"]
        }
      };
      $http(req).then(
        function mySuccess(response) {
          var listOfFavPOIData = response.data["response"];
          console.log(listOfFavPOIData);
          //deleting from the db one by one
          for (let k = 0; k < listOfFavPOIData.length; k++) {
            poiToDelete = {
              poiID: listOfFavPOIData[k]["poiID"]
            };
            console.log(poiToDelete);
            var req = {
              method: "DELETE",
              url: "http://localhost:3000/Analysis/deleteFavoritePOI",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": $scope.userData["token"]
              },
              data: poiToDelete
            };
            console.log(req);
            $http(req).then(
              function mySuccess(response) {
                console.log(response);
              },
              function myError(response) {
                console.log(response);
              }
            );
          }
        },
        function myError(response) {
          console.log(response);
        }
      );
      console.log($scope.userFavPOIs);
      //ADDING TO THE DB ALL THE POIS THAT IS IN THE LCL STORAGE
      for (let m = 0; m < $scope.userFavPOIs.length; m++) {
        console.log($scope.userFavPOIs[m]);
        let poiToADD = {
          poiID: $scope.userFavPOIs[m]["poiID"]
        };
        var req = {
          method: "POST",
          url: "http://localhost:3000/Analysis/addFavoritePOI",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": $scope.userData["token"]
          },
          data: poiToADD
        };
        $http(req).then(
          function mySuccess(response) {
            console.log(response);
          },
          function mySuccess(response) {
            console.log(req);
            console.log(response);
          }
        );
      }
    };
    // A POI IMAGE WAS CLICKED, REDIRECTED TO SINGLE POI PAGE
    $scope.POIClicked = function(event) {
      $window.location.href = "#!/SinglePOI/" + event.currentTarget.id;
    };
    // REMOVES ONLY FROM LCL STORAGE
    $scope.removeFromFavourites = function(event) {
      console.log(event.currentTarget.id);
      let indexToRemove = -1;
      let t = 0;
      for (let t = 0; t < $scope.userFavPOIs.length; t++) {
        if ($scope.userFavPOIs[t]["poiID"] == event.currentTarget.id) {
          indexToRemove = t;
        }
      }
      if (indexToRemove > -1) {
        $scope.userFavPOIs.splice(indexToRemove, 1);
      }
      localStorage.setItem(
        "usersFavouritePOIs",
        JSON.stringify($scope.userFavPOIs)
      );
    };
  });
