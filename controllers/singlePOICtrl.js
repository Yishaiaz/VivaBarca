angular
  .module("mainApp")
  .controller("SinglePOICtrl", function($scope, $http, $routeParams) {
    //getting logged user details
    console.log($scope.isLoggedIn);
    var isLoggedIn = $scope.isLoggedIn;
    var userToken;
    if (isLoggedIn) {
      userToken = $scope.userData["token"];
    }

    $scope.reviewsExist = false;
    $scope.POIid = $routeParams.id;
    $http({
      method: "GET",
      url: "http://localhost:3000/else/getPOIbyID/" + $scope.POIid
    }).then(
      function mySuccess(response) {
        $scope.POIData = response.data["POI"];
        var req = {
          method: "GET",
          url:
            "http://localhost:3000/else/getAllReviews/" +
            $scope.POIData["poiID"]
        };
        $http(req).then(
          function mySuccess(response) {
            console.log(response.data);
            $scope.POIData["reviews"] = response.data;
            if (response.data["Reviews"].length > 0) {
              $scope.reviewsExist = true;
            }
            console.log($scope.POIData);
          },
          function myError(response) {
            console.log(response);
          }
        );
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
      console.log(userToken);
      var req = {
        method: "POST",
        url: "http://localhost:3000/Analysis/addReview",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": userToken
        },
        data: $scope.reviewData
      };
      $scope.newReviewDescription = "";
      $http(req).then(
        function mySuccess(response) {
          console.log(response);
        },
        function myError(response) {
          console.log(response);
        }
      );
    };
    $scope.addToFavourites = function(event) {
      var allFavouriteButtons = document.getElementsByClassName(
        "isUserFavouriteButton"
      );
      let idToAddToFavourites = -1;
      // let toRemove = false;
      for (let i = 0; i < allFavouriteButtons.length; i++) {
        if (allFavouriteButtons[i].id === event.currentTarget.id) {
          idToAddToFavourites = allFavouriteButtons[i].id;
        }
      }
      // SAVING TO LOCAL STORAGE
      var POIsToAddToLCL;
      let exists = false;
      let toRemove = false;
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
      }
      localStorage.setItem(
        "usersFavouritePOIs",
        JSON.stringify(POIsToAddToLCL)
      );
    };
  });
