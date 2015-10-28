angular.module('controller.login', [])
.controller('LoginCtrl', function($scope, $location, AuthenticationService,$ionicPopup, debug){
    $scope.user = {};

    (function initController() {
        // reset login status
        AuthenticationService.ClearCredentials();
    })();



    $scope.login = function login() {

        //Always log in in debug mode!
        if (debug == 1) {
            AuthenticationService.SetCredentials("lewis", 1, "password");
            $location.path('/tab/map');
            return;
        }



        AuthenticationService.Login($scope.user)
        .then(function(response) {
            //Get the logged in user info
            AuthenticationService.SetCredentials(response.data.username, response.data.id, $scope.user.password);
                $location.path('/tab/report');
           
        },
        function(data) {
              var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
            //TODO: alert user
        });
    };  

    $scope.signup = function signup() {
        $location.path('/signup');
    }        
});