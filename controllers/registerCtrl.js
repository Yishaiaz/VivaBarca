angular
  .module("mainApp")
  .controller("registerCtrl", function($scope, $http, $window) {
    $http({
      method: "GET",
      url: "http://localhost:3000/Authentication/ParametersForRegistration"
    }).then(
      function mySuccess(response) {
        $scope.possibleCountries = response.data["countries"];
        $scope.possibleQuestions = response.data["questions"];
        $scope.possibleCategories = response.data["categories"];
        console.log($scope.possibleQuestions);
      },
      function myError(response) {
        console.log(response);
      }
    );

    $scope.testVar = "not Changed";

    // $scope.possibleCountries = ["Yemen", "Great Yemen", "Wow Yemen"];
    // $scope.possibleCategories = [
    //   "yemenites",
    //   "great yemenites",
    //   "amazing yemenites"
    // ];
    // $scope.possibleQuestions = ["are you yemenite?", "are you not yemenite?"];

    $scope.submit = function() {
      let toPost = false;
      var registerDetailsToPost = {};
      let numberOfChosenCategories = 0;
      // ADDING THE COUNTRY
      registerDetailsToPost["country"] = $scope.chosenCountry;
      // GETTING THE CHECKED CATEGORIES
      var chosenCategories = [];
      var x = document.getElementsByClassName("ChosenCategory");
      for (let element of x) {
        if (element.checked == true) {
          numberOfChosenCategories++;
          chosenCategories.push({ categoryName: element.id });
        }
      }
      // ADDING THE CATEGORIES
      registerDetailsToPost["categories"] = chosenCategories;
      // not enough categories were chosen
      if (numberOfChosenCategories < 2) {
        document.getElementById("CategoriesAlert").style =
          "color:red; font-size:20px;";
        toPost = false;
      }
      // enough categories were chosen
      else {
        document.getElementById("CategoriesAlert").style =
          "color: black; font-size:10px;";
        toPost = true;
      }
      if (toPost) {
        // ADDING USERNAME
        registerDetailsToPost["username"] = $scope.firstname + $scope.lastname;
        // ADDING PASSWORD
        registerDetailsToPost["password"] = $scope.password;
        // ADDING FIRSTNAME
        registerDetailsToPost["firstName"] = $scope.firstname;
        // ADDING LASTNAME
        registerDetailsToPost["lastName"] = $scope.lastname;
        // ADDING CITY
        registerDetailsToPost["city"] = $scope.city;
        // ADDING EMAIL
        registerDetailsToPost["email"] = $scope.email;
        // ADDING QUESTION1
        registerDetailsToPost["question1"] = $scope.firstQuestion;
        // ADDING QUESTION2
        registerDetailsToPost["question2"] = $scope.secondQuestion;
        // ADDING ANSWER1
        registerDetailsToPost["answer1"] = $scope.firstAnswer;
        // ADDING ANSWER2
        registerDetailsToPost["answer2"] = $scope.secondAnswer;

        var req = {
          method: "POST",
          url: "http://localhost:3000/Authentication/Register",
          headers: {
            "Content-Type": "application/json"
          },
          data: registerDetailsToPost
        };
        console.log(registerDetailsToPost);
        $http(req).then(
          function mySuccess(response) {
            console.log(response);
          },
          function myError(response) {
            console.log(response);
          }
        );
        alert(
          "Succesfully registered! username:" +
            registerDetailsToPost["username"]
        );
        $window.location.href = "/index.html";
      } else {
        alert("please fill all required fields!");
      }
    };
  });
