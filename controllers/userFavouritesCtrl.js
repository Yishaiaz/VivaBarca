angular
  .module("mainApp")
  .controller("userFavouritesCtrl", function($scope, $http, $window) {
    //getting the users favourite pois with the position
    // CHECKS FOR USER DATA FROM LCL STORAGE, IF DOESN'T EXIST => todo: present no favourites yet
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
    var req = {
      method: "POST",
      url: "http://localhost:3000/Analysis/getFavoritePOIs",
      headers: {
        "x-auth-token": $scope.userData["token"]
      }
    };
    $http(req).then(
      function mySuccess(response) {
        $scope.userFavouritePOIs = [];
        for (let j = 0; j < response.data["response"].length; j++) {
          $scope.userFavouritePOIs.push({
            poiID: response.data["response"][j]
          });
        }
        // PUTTING THE POSITION FROM FAV POIs THAT ALREADY EXIST IN THE DB, AND IN LCL STORAGE
        // for (let l = 0; l < $scope.userFavouritePOIs.length; l++) {
        //   for (let m = 0; m < POIsFromLCL.length; m++) {
        //     if (
        //       POIsFromLCL[m]["poiID"] == $scope.userFavouritePOIs[l]["poiID"]
        //     ) {
        //       POIsFromLCL[m]["position"] =
        //         $scope.userFavouritePOIs[l]["position"];
        //     }
        //   }
        // }
        console.log(POIsFromLCL);
      },
      function myError(response) {
        console.log(response);
      }
    );

    // console.log(localStorage);

    $scope.userFavPOIs = [];
    for (let j = 0; j < POIsFromLCL.length; j++) {
      // console.log(POIsFromLCL);
      var onePOIReq = {
        method: "GET",
        url: "http://localhost:3000/else/getPOIbyID/" + POIsFromLCL[j]["poiID"],
        headers: {
          "x-auth-token": $scope.userData["token"]
        }
      };
      $http(onePOIReq).then(
        function mySuccess(response) {
          // console.log(response);
          var poiData = response.data["POI"];

          for (let m = 0; m < $scope.userFavouritePOIs.length; m++) {
            // console.log(poiData["poiID"]);
            // console.log($scope.userFavouritePOIs[m]["poiID"]["poiID"]);
            if (
              poiData["poiID"] == $scope.userFavouritePOIs[m]["poiID"]["poiID"]
            ) {
              poiData["position"] =
                $scope.userFavouritePOIs[m]["poiID"]["position"];
            }
          }

          $scope.userFavPOIs.push(poiData);
          $scope.userFavPOIs.sort((a, b) =>
            a["position"] > b["position"] ? 1 : -1
          );
          // console.log($scope.userFavPOIs);
        },
        function myError(response) {
          console.log(response);
        }
      );
    }
    // NG-CLICK FUNCTIONS:
    $scope.saveOrderToDB = function(event) {
      var poiIDsByOrder = [];
      var poisOrderInputs = document.getElementsByClassName(
        "orderNumberForPOI"
      );
      for (let k = 0; k < poisOrderInputs.length; k++) {
        let poiIDandPosition = {
          poiID:
            poisOrderInputs[k].parentElement.parentElement.children[0]
              .children[0].id,
          position: parseInt(poisOrderInputs[k].value)
        };
        poiIDsByOrder.push(poiIDandPosition);
      }
      // console.log(poiIDsByOrder);
      poiIDsByOrder.sort((a, b) => (a["position"] > b["position"] ? 1 : -1));
      var onlyPOIIDs = [];
      for (poi of poiIDsByOrder) {
        onlyPOIIDs.push(parseInt(poi["poiID"]));
      }

      onlyPOIIDs = {
        newOrder: onlyPOIIDs
      };
      req = {
        method: "PUT",
        url: "http://localhost:3000/Analysis/updateUserOrder",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": $scope.userData["token"]
        },
        data: onlyPOIIDs
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
    };
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
          // console.log(listOfFavPOIData);
          //deleting from the db one by one
          for (let k = 0; k < listOfFavPOIData.length; k++) {
            poiToDelete = {
              poiID: listOfFavPOIData[k]["poiID"]
            };
            // console.log(poiToDelete);
            var req = {
              method: "DELETE",
              url: "http://localhost:3000/Analysis/deleteFavoritePOI",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": $scope.userData["token"]
              },
              data: poiToDelete
            };
            // console.log(req);
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
      // console.log($scope.userFavPOIs);
      //ADDING TO THE DB ALL THE POIS THAT IS IN THE LCL STORAGE
      for (let m = 0; m < $scope.userFavPOIs.length; m++) {
        // console.log($scope.userFavPOIs[m]);
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
    $scope.sortByRank = function(event) {
      $scope.POIsByFilter = $scope.userFavPOIs;
      $scope.POIsByFilter = $scope.POIsByFilter.sort((a, b) =>
        a["ranking"] > b["ranking"] ? 1 : -1
      );
      $scope.bySearchFilter = true;
    };
  });
