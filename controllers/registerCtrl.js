angular.module("mainApp").controller("registerCtrl", function($scope) {
  $scope.testVar = "not Changed";

  $scope.possibleCountries = ["Yemen", "Great Yemen", "Wow Yemen"];
  $scope.possibleCategories = [
    "yemenites",
    "great yemenites",
    "amazing yemenites"
  ];
  $scope.possibleQuestions = ["are you yemenite?", "are you not yemenite?"];

  $scope.submit = function() {
    let numberOfChosenCategories = 0;
    $scope.testVar = $scope.chosenCountry;
    var x = document.getElementsByClassName("ChosenCategory");
    for (let element of x) {
      if (element.checked == true) numberOfChosenCategories++;
    }
    // not enough categories were chosen
    if (numberOfChosenCategories < 2) {
      document.getElementById("CategoriesAlert").style =
        "color:red; font-size:20px;";
    }
    // enough categories were chosen
    else {
      document.getElementById("CategoriesAlert").style =
        "color: black; font-size:10px;";
    }
  };
});
